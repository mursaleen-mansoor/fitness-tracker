import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

// Multer config for profile pictures
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(path.resolve(), 'uploads'));
    },
    filename(req, file, cb) {
        cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Images only (jpeg, jpg, png, gif, webp)'));
    }
});

export const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('profilePicture');
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        return res.status(403).json({ message: 'Public registration is currently disabled. Please contact an administrator.' });
        /* 
        const { name, username, email, password, dob, gender } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            username,
            email,
            password,
            dob,
            gender
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                preferences: user.preferences,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
        */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                preferences: user.preferences,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                dob: user.dob,
                gender: user.gender,
                profilePicture: user.profilePicture,
                preferences: user.preferences
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.dob) user.dob = req.body.dob;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.preferences) {
            user.preferences = { ...user.preferences.toObject(), ...req.body.preferences };
        }

        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            username: updated.username,
            email: updated.email,
            role: updated.role,
            dob: updated.dob,
            gender: updated.gender,
            profilePicture: updated.profilePicture,
            preferences: updated.preferences,
            token: req.headers.authorization?.split(' ')[1]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload profile picture
// @route   PUT /api/auth/profile/picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        // Return full user data so frontend can update context
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            dob: user.dob,
            gender: user.gender,
            profilePicture: user.profilePicture,
            preferences: user.preferences,
            token: req.headers.authorization?.split(' ')[1]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
