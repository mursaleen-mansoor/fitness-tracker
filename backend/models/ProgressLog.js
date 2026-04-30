import mongoose from 'mongoose';

const progressLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        required: [true, 'Please add weight']
    },
    bodyFat: Number,
    measurements: {
        waist: Number,
        chest: Number,
        hips: Number,
        arms: Number,
        legs: Number
    }
}, {
    timestamps: true
});

const ProgressLog = mongoose.model('ProgressLog', progressLogSchema);

export default ProgressLog;
