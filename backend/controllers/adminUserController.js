import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Workout from '../models/Workout.js';
import NutritionLog from '../models/NutritionLog.js';
import ProgressLog from '../models/ProgressLog.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Get all users with filtering and search
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;
        if (status) query.status = status;

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalUsers: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get full user profile with stats
// @route   GET /api/admin/users/:id
export const getUserFullProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const [workouts, nutrition, progress, tickets] = await Promise.all([
            Workout.countDocuments({ userId: user._id }),
            NutritionLog.countDocuments({ userId: user._id }),
            ProgressLog.findOne({ userId: user._id }).sort({ createdAt: -1 }),
            Ticket.find({ userId: user._id }).sort({ createdAt: -1 })
        ]);

        res.json({
            user,
            stats: {
                totalWorkouts: workouts,
                totalNutrition: nutrition,
                currentWeight: progress ? progress.weight : 'N/A',
                latestProgressDate: progress ? progress.createdAt : null
            },
            tickets
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
export const updateUserByAdmin = async (req, res) => {
    try {
        const { role, status, name, username, email } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Cannot modify another admin' });
        }

        if (role) user.role = role;
        if (status) user.status = status;
        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user permanently
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

        await user.deleteOne();
        res.json({ message: 'User deleted permanently' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new user by admin and email details
// @route   POST /api/admin/users
export const createUserByAdmin = async (req, res) => {
    try {
        const { name, username, email, role, dob, gender } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // Generate a random 8-character password
        const rawPassword = crypto.randomBytes(4).toString('hex');

        // Create user
        const user = await User.create({
            name,
            username,
            email,
            password: rawPassword,
            role: role || 'user',
            dob: dob || new Date('2000-01-01'), // Default DOB if not provided
            gender: gender || 'Prefer not to say' // Default gender if not provided
        });

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Account Details - Fitness Tracker',
                html: `
                    <h2>Welcome to Fitness Tracker!</h2>
                    <p>An administrator has created an account for you.</p>
                    <p><strong>Login Details:</strong></p>
                    <ul>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Password:</strong> ${rawPassword}</li>
                    </ul>
                    <p>Please log in and change your password immediately.</p>
                `
            });
            console.log(`Credentials emailed to ${user.email}`);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // We still return success for user creation, but note email failure
            return res.status(201).json({
                message: 'User created successfully, but email failed to send. Please provide the credentials manually.',
                user,
                rawPassword // Only returning this because email failed, admin needs it
            });
        }

        res.status(201).json({ message: 'User created successfully and email sent', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
