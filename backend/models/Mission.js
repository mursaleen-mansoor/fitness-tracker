import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Basic', 'Tactical', 'Elite'],
        default: 'Basic'
    },
    type: {
        type: String,
        enum: ['Strength', 'Endurance', 'Recovery'],
        required: true
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        duration: String
    }],
    xpReward: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Failed'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
