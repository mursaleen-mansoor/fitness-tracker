import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a workout name']
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Sports'],
        required: [true, 'Please select a category']
    },
    tags: [String],
    notes: String,
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        weight: Number, // in kg
        duration: Number, // in minutes
        restTime: Number, // in seconds
        notes: String
    }]
}, {
    timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
