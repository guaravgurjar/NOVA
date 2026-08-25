import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Raw password is NEVER stored — only the bcrypt hash
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['superadmin', 'editor'],
        default: 'editor',
        required: true,
    },
    // Set to false to instantly revoke access without deleting the account
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook: hash password whenever it is set or changed
adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const SALT_ROUNDS = 12;
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
});

// Helper method to verify a plaintext password against the stored hash
adminUserSchema.methods.verifyPassword = function (plaintext) {
    return bcrypt.compare(plaintext, this.password);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;
