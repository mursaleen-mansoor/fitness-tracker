import Workout from '../models/Workout.js';

// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res) => {
    try {
        const { name, date, category, tags, notes, exercises } = req.body;
        const workout = await Workout.create({
            userId: req.user._id,
            name,
            date,
            category,
            tags,
            notes,
            exercises
        });
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (workout && workout.userId.toString() === req.user._id.toString()) {
            res.json(workout);
        } else {
            res.status(404).json({ message: 'Workout not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (workout && workout.userId.toString() === req.user._id.toString()) {
            Object.assign(workout, req.body);
            const updatedWorkout = await workout.save();
            res.json(updatedWorkout);
        } else {
            res.status(404).json({ message: 'Workout not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (workout && workout.userId.toString() === req.user._id.toString()) {
            await workout.deleteOne();
            res.json({ message: 'Workout removed' });
        } else {
            res.status(404).json({ message: 'Workout not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
