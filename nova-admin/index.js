import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import AdminJS, { ComponentLoader } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';
import uploadFeature, { BaseProvider } from '@adminjs/upload';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import bcrypt from 'bcrypt';
import sharp from 'sharp';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import AdminUser from './models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variables from the frontend's .env file where you added them
dotenv.config({ path: path.resolve(__dirname, '../nova-admin/.env') });
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// ✅ Crash immediately if COOKIE_SECRET is not set — no insecure fallback
if (!process.env.COOKIE_SECRET) {
    console.error('❌ CRITICAL: COOKIE_SECRET is not set in environment variables. Set it in nova-admin/.env and restart.');
    process.exit(1);
}
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

// ─── Storefront cache invalidation ───────────────────────────────────────────
// Called after every product create / edit / delete so the storefront's
// server-side products cache is cleared immediately instead of waiting for TTL.
// Supports multiple storefronts via comma-separated STOREFRONT_URLS env var
// e.g. STOREFRONT_URLS=https://novajewel.in,https://novajewels.in
async function invalidateStorefrontCache() {
    const urlsRaw = process.env.STOREFRONT_URLS || process.env.STOREFRONT_URL;
    const secret = process.env.CACHE_INVALIDATE_SECRET;
    if (!urlsRaw || !secret) {
        console.warn('⚠️  STOREFRONT_URLS or CACHE_INVALIDATE_SECRET not set — skipping cache invalidation');
        return;
    }

    // Support both a single URL (legacy) and comma-separated list
    const urls = urlsRaw.split(',').map(u => u.trim()).filter(Boolean);

    // Fire all invalidation requests in parallel
    await Promise.allSettled(
        urls.map(async (url) => {
            try {
                const res = await fetch(`${url}/api/products/invalidate-cache`, {
                    method: 'POST',
                    headers: { 'x-invalidate-secret': secret },
                });
                if (res.ok) {
                    console.log(`✅ Storefront cache invalidated: ${url}`);
                } else {
                    console.warn(`⚠️  Cache invalidation returned ${res.status} for ${url}`);
                }
            } catch (err) {
                console.error(`❌ Failed to invalidate cache for ${url}:`, err.message || err);
            }
        })
    );
}

// 2. Create the Custom R2 Provider for AdminJS
class R2Provider extends BaseProvider {
    constructor() {
        // This will act as the folder prefix inside your R2 bucket
        super(R2_BUCKET_NAME);
    }

    // Handles uploading the temporary file to R2
    // All images are converted to WebP (quality 85, max 1400px) before upload
    async upload(file, key) {
        const rawBuffer = fs.readFileSync(file.path);

        // Convert to WebP for ~10-20x smaller file sizes
        const webpBuffer = await sharp(rawBuffer)
            .resize({ width: 1400, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();

        // Replace original extension with .webp in the stored key
        const webpKey = key.replace(/\.[^.]+$/, '') + '.webp';

        await s3Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: webpKey,
            Body: webpBuffer,
            ContentType: 'image/webp',
        }));

        // Securely erase the temporary file from the server instance to prevent clutter
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Return the webp key so AdminJS stores the correct filename in MongoDB
        return webpKey;
    }

    // Handles deleting the asset from R2 when a product is deleted
    async delete(key, bucket) {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        }));
    }

    // Generates the external URL to serve images to your frontend
    async path(key, bucket) {
        return `${R2_PUBLIC_URL}/${key}`;
    }
}

// Global ComponentLoader instance for AdminJS bundler tracking
const componentLoader = new ComponentLoader();

// Register the custom Dashboard component
const DashboardComponent = componentLoader.add('Dashboard', path.join(__dirname, 'components', 'Dashboard'));

// Register the Mongoose Adapter so AdminJS can read your DB
AdminJS.registerAdapter(AdminJSMongoose);

// ─────────────────────────────────────────────────────────────────────────────
// Category & Subcategory taxonomy
// ─────────────────────────────────────────────────────────────────────────────
//
// Main Categories  →  Subcategories
// ─────────────────────────────────
// gifts-for-her    →  female-rings | female-earrings | female-bracelets |
//                     female-chains | female-bangles | female-pendants
//
// gifts-for-him    →  male-rings | male-earrings | male-bracelets |
//                     male-chains | male-ear-studs
//
// astro-collection →  astro-pendants | astro-rings | astro-bracelets
//
// These values are stored in the DB and mapped to storefront pages in the
// frontend's ProductsContext CATEGORY_MAP.
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_CATEGORIES = [
    { value: 'gifts-for-her',    label: '🎀 Gifts For Her' },
    { value: 'gifts-for-him',    label: '🎁 Gifts For Him' },
    { value: 'astro-collection', label: '✨ Astro Collection' },
];

// Map main → subcategories
const SUBCATEGORY_MAP = {
    'gifts-for-her': [
        { value: 'female-rings',     label: 'Female Rings' },
        { value: 'female-earrings',  label: 'Female Earrings' },
        { value: 'female-bracelets', label: 'Female Bracelets' },
        { value: 'female-chains',    label: 'Female Chains' },
        { value: 'female-bangles',   label: 'Female Bangles' },
        { value: 'female-pendants',  label: 'Female Pendants' },
    ],
    'gifts-for-him': [
        { value: 'male-rings',      label: 'Male Rings' },
        { value: 'male-earrings',   label: 'Male Earrings' },
        { value: 'male-bracelets',  label: 'Male Bracelets' },
        { value: 'male-chains',     label: 'Male Chains' },
        { value: 'male-ear-studs',  label: 'Male Ear Studs' },
    ],
    'astro-collection': [
        { value: 'astro-pendants',   label: 'Astro Pendants (Zodiac)' },
        { value: 'astro-rings',      label: 'Astro Rings' },
        { value: 'astro-bracelets',  label: 'Astro Bracelets' },
    ],
};

// Flat list of all valid subcategory values (used in the schema enum)
const ALL_SUBCATEGORIES = Object.values(SUBCATEGORY_MAP).flat().map(s => s.value);

// ─────────────────────────────────────────────────────────────────────────────
// Define the Product Schema
// ─────────────────────────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    originalPrice: { type: Number },
    productcode: { type: String, required: true },

    // Main storefront category (e.g. 'gifts-for-her')
    category: {
        type: String,
        enum: MAIN_CATEGORIES.map(c => c.value),
        required: true
    },

    // Subcategory that determines which filter tab the product appears under
    // (e.g. 'female-rings' → Rings tab on the Gifts For Her page)
    subcategory: {
        type: String,
        enum: ALL_SUBCATEGORIES,
        required: true
    },

    // Core data references populated by the upload plugin
    imageKeys: [{ type: String }],       // Stores the R2 object keys (filenames)
    imageBuckets: [{ type: String }],    // Stores the R2 bucket names
    imageMimeTypes: [{ type: String }],  // Stores file types (e.g., image/webp)
    imageSizes: [{ type: Number }],      // Stores data volume in bytes

    // Stock Management
    stockStatus: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK'],
        default: 'IN_STOCK'
    },

    // Offers and Coupons
    hasActiveOffer: { type: Boolean, default: false },
    offerDiscountPercentage: { type: Number, default: 0 },
    couponCode: { type: String, default: null },

    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build the allowed subcategory values for a given category value.
// Used in the AdminJS before hook to validate subcategory belongs to category.
// ─────────────────────────────────────────────────────────────────────────────
function getSubcategoriesForCategory(categoryValue) {
    return (SUBCATEGORY_MAP[categoryValue] || []).map(s => s.value);
}

// Setup AdminJS configuration
const startAdmin = async () => {
    const app = express();

    // Connect to your MongoDB database cluster
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const admin = new AdminJS({
        componentLoader,
        rootPath: '/admin',
        dashboard: {
            component: DashboardComponent,
            handler: async () => ({}),
        },
        resources: [
            {
                resource: Product,
                options: {
                    navigation: { name: 'Products', icon: 'Diamond' },
                    properties: {
                        description: { type: 'richtext' },

                        productcode: {
                            isVisible: { list: true, filter: true, show: true, edit: true },
                            position: 2,
                        },

                        // ── Category & Subcategory ─────────────────────────────
                        category: {
                            position: 3,
                            isTitle: false,
                            availableValues: MAIN_CATEGORIES.map(c => ({
                                value: c.value,
                                label: c.label,
                            })),
                        },
                        subcategory: {
                            position: 4,
                            // Full list is shown; the before hook validates the pairing.
                            // AdminJS doesn't natively do cascading dropdowns without a
                            // custom component, so we list all subcategories grouped.
                            availableValues: [
                                // ── Gifts For Her ──
                                ...SUBCATEGORY_MAP['gifts-for-her'].map(s => ({
                                    value: s.value,
                                    label: `🎀 ${s.label}`,
                                })),
                                // ── Gifts For Him ──
                                ...SUBCATEGORY_MAP['gifts-for-him'].map(s => ({
                                    value: s.value,
                                    label: `🎁 ${s.label}`,
                                })),
                                // ── Astro Collection ──
                                ...SUBCATEGORY_MAP['astro-collection'].map(s => ({
                                    value: s.value,
                                    label: `✨ ${s.label}`,
                                })),
                            ],
                        },

                        // Keep database metadata fields hidden from standard entry form view
                        imageKeys:      { isVisible: { list: true,  filter: false, show: true,  edit: false } },
                        imageBuckets:   { isVisible: false },
                        imageMimeTypes: { isVisible: false },
                        imageSizes:     { isVisible: false },
                    },
                    // ── Validate subcategory belongs to selected category ──────
                    actions: {
                        new: {
                            before: async (request) => {
                                const { category, subcategory } = request.payload || {};
                                if (category && subcategory) {
                                    const allowed = getSubcategoriesForCategory(category);
                                    if (!allowed.includes(subcategory)) {
                                        throw new Error(
                                            `Subcategory "${subcategory}" does not belong to category "${category}". ` +
                                            `Allowed: ${allowed.join(', ')}`
                                        );
                                    }
                                }
                                return request;
                            },
                            // Bust the storefront cache so the new product is visible immediately
                            after: async (response) => {
                                await invalidateStorefrontCache();
                                return response;
                            },
                        },
                        edit: {
                            before: async (request) => {
                                const { category, subcategory } = request.payload || {};
                                if (category && subcategory) {
                                    const allowed = getSubcategoriesForCategory(category);
                                    if (!allowed.includes(subcategory)) {
                                        throw new Error(
                                            `Subcategory "${subcategory}" does not belong to category "${category}". ` +
                                            `Allowed: ${allowed.join(', ')}`
                                        );
                                    }
                                }
                                return request;
                            },
                            // Bust the storefront cache so edits are visible immediately
                            after: async (response) => {
                                await invalidateStorefrontCache();
                                return response;
                            },
                        },
                        delete: {
                            // Bust the storefront cache so deleted products disappear immediately
                            after: async (response) => {
                                await invalidateStorefrontCache();
                                return response;
                            },
                        },
                    },
                },
                features: [
                    uploadFeature({
                        componentLoader,
                        // 3. Use the R2 provider for image uploads
                        provider: new R2Provider(),
                        multiple: true,
                        properties: {
                            file: 'uploadFile',
                            key: 'imageKeys',
                            mimeType: 'imageMimeTypes',
                            bucket: 'imageBuckets',
                            size: 'imageSizes',
                        },
                        validation: {
                            mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
                        },
                    }),
                ],
            },
            // ─── Admin Users Resource (superadmin-only) ───────────────────────────
            {
                resource: AdminUser,
                options: {
                    navigation: { name: 'Access Management', icon: 'User' },
                    // Only superadmins can see / manage the Admin Users section
                    actions: {
                        list:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        show:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        new:    { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        edit:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                    },
                    properties: {
                        email:     { position: 1 },
                        role:      { position: 2 },
                        isActive:  { position: 3 },
                        createdAt: { position: 4, isVisible: { list: true, filter: false, show: true, edit: false } },
                        // Never expose the stored hash — show a write-only password field instead
                        password: {
                            position: 5,
                            isVisible: { list: false, filter: false, show: false, edit: true },
                            type: 'password',
                        },
                    },
                    // Before creating or editing, bcrypt-hash any newly supplied password
                    actions: {
                        list:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        show:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin' },
                        new: {
                            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin',
                            before: async (request) => {
                                if (request.payload?.password) {
                                    request.payload.password = await bcrypt.hash(request.payload.password, 12);
                                }
                                return request;
                            },
                        },
                        edit: {
                            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'superadmin',
                            before: async (request) => {
                                // Only re-hash if the superadmin actually typed a new password
                                if (request.payload?.password && request.payload.password.trim() !== '') {
                                    request.payload.password = await bcrypt.hash(request.payload.password, 12);
                                } else {
                                    // Leave the existing hash untouched
                                    delete request.payload.password;
                                }
                                return request;
                            },
                        },
                    },
                },
            },
        ],
        locale: {
            language: 'en',
            translations: {
                en: {
                    properties: {
                        offerDiscountPercentage: 'Offer Discount %',
                        hasActiveOffer: 'Has Active Offer',
                        couponCode: 'Coupon Code',
                        productcode: 'Product Code',
                        stockStatus: 'Stock Status',
                        originalPrice: 'Original Price (MRP)',
                        imageKeys: 'Image Keys',
                        imageBuckets: 'Image Buckets',
                        imageMimeTypes: 'Image Mime Types',
                        imageSizes: 'Image Sizes',
                        uploadFile: 'Upload Images',
                        category: 'Main Category',
                        subcategory: 'Subcategory',
                    },
                },
            },
        },
        branding: {
            companyName: 'NOVA Jewellery Admin',
            withMadeWithLove: false,
        },
    });

    // Build bundle for production, watch for changes in development
    if (process.env.NODE_ENV === 'production') {
        await admin.build();
    } else {
        admin.watch();
    }

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      admin,
      {
        authenticate: async (email, password) => {
          // Look up the admin by email in MongoDB
          const user = await AdminUser.findOne({ email: email.toLowerCase().trim() });
          if (!user) return null;

          // Reject immediately if the account has been deactivated
          if (!user.isActive) return null;

          // Verify the supplied plaintext password against the bcrypt hash
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;

          // Return the session payload — role is used for RBAC throughout AdminJS
          return { email: user.email, role: user.role };
        },
        cookieName: 'nova-admin-session',
        cookiePassword: COOKIE_SECRET,
      },
      null,
      {
        store: ConnectMongo.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: 'admin_sessions',
          ttl: 24 * 60 * 60, // 1 day
        }),
        resave: false,
        saveUninitialized: false,
        secret: COOKIE_SECRET,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // ✅ HTTPS-only in production
          sameSite: 'strict',                            // ✅ CSRF protection
        },
      }
    );

    // ─── Dashboard Stats API ──────────────────────────────────────────────
    // ✅ Protect dashboard stats — only authenticated admin sessions can access
    // Registered on the adminRouter to ensure session and auth are available.
    adminRouter.get('/api/dashboard-stats', async (req, res) => {
        try {
            const totalProducts = await Product.countDocuments();
            const inStock = await Product.countDocuments({ stockStatus: 'IN_STOCK' });
            const outOfStock = await Product.countDocuments({ stockStatus: 'OUT_OF_STOCK' });
            const withOffers = await Product.countDocuments({ hasActiveOffer: true });

            // Category breakdown
            const categoryAgg = await Product.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);
            const categoryBreakdown = {};
            categoryAgg.forEach(c => { categoryBreakdown[c._id] = c.count; });

            // Subcategory breakdown
            const subcategoryAgg = await Product.aggregate([
                { $group: { _id: { category: '$category', subcategory: '$subcategory' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            // Recent products (last 8)
            const recentProducts = await Product.find()
                .sort({ createdAt: -1 })
                .limit(8)
                .lean();

            // Total orders (from orders collection if it exists)
            let totalOrders = 0;
            try {
                totalOrders = await mongoose.connection.db.collection('orders').countDocuments();
            } catch (e) { /* orders collection may not exist yet */ }

            res.json({
                totalProducts,
                inStock,
                outOfStock,
                withOffers,
                categoryBreakdown,
                subcategoryAgg,
                recentProducts,
                totalOrders,
            });
        } catch (err) {
            console.error('Dashboard stats error:', err);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    app.use(admin.options.rootPath, adminRouter);


    // Start the Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 AdminJS running at http://0.0.0.0:${PORT}${admin.options.rootPath}`);
    });
};

startAdmin().catch((err) => {
    console.error('Failed to start AdminJS:', err);
});