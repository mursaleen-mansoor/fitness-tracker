import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const checkAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const admins = await User.find({ role: 'admin' });
    console.log("Admins:", admins.map(a => ({ email: a.email, name: a.name })));
    process.exit();
};

checkAdmin();
