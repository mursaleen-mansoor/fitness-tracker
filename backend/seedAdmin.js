import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = 'admin@fitness.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating role to admin...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
        } else {
            await User.create({
                name: 'System Admin',
                username: 'admin',
                email: adminEmail,
                password: 'admin123', // pre-save hook will hash this
                role: 'admin',
                dob: new Date('1990-01-01'),
                gender: 'Prefer not to say',
                status: 'active'
            });
            console.log('Admin account created: admin@fitness.com / admin123');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
