import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a goal title']
    },
    type: {
        type: String,
        enum: ['Weight', 'Calories', 'Workouts', 'Water'],
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    },
    currentValue: {
        type: Number,
        default: 0
    },
    deadline: Date,
    status: {
        type: String,
        enum: ['In Progress', 'Achieved', 'Failed'],
        default: 'In Progress'
    }
}, {
    timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
