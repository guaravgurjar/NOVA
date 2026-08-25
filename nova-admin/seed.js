/**
 * seed.js — Run ONCE to create the first superadmin account.
 *
 * Usage:
 *   node seed.js
 *
 * It reads SEED_EMAIL and SEED_PASSWORD from your .env file.
 * After running successfully, you can remove those two variables from .env
 * and manage admin users entirely through the AdminJS UI.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import AdminUser from './models/AdminUser.js';

const SEED_EMAIL    = process.env.SEED_EMAIL    || process.env.ADMIN_EMAIL;
const SEED_PASSWORD = process.env.SEED_PASSWORD || process.env.ADMIN_PASSWORD;

if (!SEED_EMAIL || !SEED_PASSWORD) {
    console.error('❌  SEED_EMAIL and SEED_PASSWORD (or ADMIN_EMAIL / ADMIN_PASSWORD) must be set in .env');
    process.exit(1);
}

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    const existing = await AdminUser.findOne({ email: SEED_EMAIL.toLowerCase() });
    if (existing) {
        console.log(`ℹ️   Superadmin already exists for ${SEED_EMAIL} — nothing to do.`);
        await mongoose.disconnect();
        return;
    }

    // The pre-save hook in AdminUser.js will bcrypt-hash the password automatically
    const superadmin = new AdminUser({
        email: SEED_EMAIL,
        password: SEED_PASSWORD,
        role: 'superadmin',
        isActive: true,
    });

    await superadmin.save();
    console.log(`🎉  Superadmin created: ${SEED_EMAIL}`);
    console.log('👉  You can now log in to AdminJS and manage admin users from the UI.');
    console.log('👉  Remove ADMIN_EMAIL / ADMIN_PASSWORD from .env once you have confirmed login.');

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
});
