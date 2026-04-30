import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'support_agent', 'admin'],
        default: 'user'
    },
    dob: {
        type: Date,
        required: [true, 'Please add date of birth']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: [true, 'Please specify gender']
    },
    profilePicture: {
        type: String,
        default: 'default-avatar.png'
    },
    preferences: {
        units: {
            type: String,
            enum: ['metric', 'imperial'],
            default: 'metric' // metric = kg/cm, imperial = lbs/inches
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        notifications: {
            goalAchieved: { type: Boolean, default: true },
            supportReply: { type: Boolean, default: true },
            reminder: { type: Boolean, default: true }
        }
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    achievements: [{
        id: String,
        title: String,
        icon: String,
        awardedAt: { type: Date, default: Date.now }
    }],
    stats: {
        strength: { type: Number, default: 10 },
        endurance: { type: Number, default: 10 },
        agility: { type: Number, default: 10 },
        recovery: { type: Number, default: 10 }
    },
    strikeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StrikeTeam'
    },
    activeHUDSkin: {
        type: String,
        default: 'Neon Green'
    },
    unlockedSkins: {
        type: [String],
        default: ['Neon Green']
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
