import express from 'express';
import mongoose from 'mongoose';
import AdminJS, { ComponentLoader } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';
import uploadFeature, { BaseProvider } from '@adminjs/upload';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variables from the frontend's .env file where you added them
dotenv.config({ path: path.resolve(__dirname, '../nova-admin/.env') });
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

// 2. Create the Custom R2 Provider for AdminJS
class R2Provider extends BaseProvider {
    constructor() {
        // This will act as the folder prefix inside your R2 bucket
        super(R2_BUCKET_NAME);
    }

    // Handles uploading the temporary file to R2
    async upload(file, key) {
        const fileContent = fs.readFileSync(file.path);
        await s3Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: file.type,
        }));
        // Securely erase the temporary file from the server instance to prevent clutter
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
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

// Define the Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    originalPrice: { type: Number },
    productcode: { type: String, required: true },
    category: {
        type: String,
        enum: [
            'rings',
            'earrings',
            'bracelets',
            'pendants',
            'chains',
            'bangles',
            'sets',
            'astro'
        ],
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
                    properties: {
                        description: { type: 'richtext' },
                        productcode: {
                            isVisible: { list: true, filter: true, show: true, edit: true },
                            position: 2,
                        },

                        // Keep database metadata fields hidden from standard entry form view
                        imageKeys: { isVisible: { list: true, filter: false, show: true, edit: false } },
                        imageBuckets: { isVisible: false },
                        imageMimeTypes: { isVisible: false },
                        imageSizes: { isVisible: false },
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
        ],
        locale: {
            language: 'en',
            translations: {
                en: {
                    properties: {
                        offerDiscountPercentage: 'Offer Discount Percentage',
                        hasActiveOffer: 'Has Active Offer',
                        couponCode: 'Coupon Code',
                        productcode: 'Product Code',
                        stockStatus: 'Stock Status',
                        originalPrice: 'Original Price',
                        imageKeys: 'Image Keys',
                        imageBuckets: 'Image Buckets',
                        imageMimeTypes: 'Image Mime Types',
                        imageSizes: 'Image Sizes',
                        uploadFile: 'Upload File',
                    },
                },
            },
        },
        branding: {
            companyName: 'NOVA Jewellery Admin',
            withMadeWithLove: false,
        },
    });

    // Watch and bundle custom feature components in development
    admin.watch();

    // Build the Express Router
    // ─── Dashboard Stats API ──────────────────────────────────────────────
    app.get('/admin/api/dashboard-stats', async (req, res) => {
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
                recentProducts,
                totalOrders,
            });
        } catch (err) {
            console.error('Dashboard stats error:', err);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    const adminRouter = AdminJSExpress.buildRouter(admin);
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