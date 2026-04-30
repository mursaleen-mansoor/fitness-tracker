import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedAgent = async () => {
    try {
        const email = 'agent@example.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log('Updating existing agent user...');
            user.role = 'support_agent';
            user.password = 'password123'; // will be hashed by pre-save hook
            await user.save();
            console.log('Agent user updated to support_agent role.');
        } else {
            console.log('Creating new agent user...');
            await User.create({
                name: 'Support Agent One',
                username: 'agent001',
                email: email,
                password: 'password123',
                role: 'support_agent',
                gender: 'Other',
                dob: new Date('1990-01-01')
            });
            console.log('Support Agent created successfully!');
        }

        console.log('Email: agent@example.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error seeding agent:', error);
        process.exit(1);
    }
};

seedAgent();
