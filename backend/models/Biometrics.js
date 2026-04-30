import mongoose from 'mongoose';

const biometricSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sleepHours: {
        type: Number,
        required: true
    },
    stressLevel: {
        type: Number, // 1-10
        required: true
    },
    restingHeartRate: {
        type: Number
    },
    recoveryScore: {
        type: Number // Calculated or manual
    }
}, { timestamps: true });

const Biometric = mongoose.model('Biometric', biometricSchema);
export default Biometric;
