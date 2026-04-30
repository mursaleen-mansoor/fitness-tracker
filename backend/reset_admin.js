import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const resetAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOne({ email: 'admin@fitness.com' });
    if(admin) {
        admin.password = 'admin123';
        await admin.save();
        console.log("Password reset for admin@fitness.com to admin123");
    } else {
        console.log("Admin not found");
    }
    process.exit();
};

resetAdmin();
