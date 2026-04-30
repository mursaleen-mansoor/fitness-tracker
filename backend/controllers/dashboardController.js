import Workout from '../models/Workout.js';
import NutritionLog from '../models/NutritionLog.js';
import ProgressLog from '../models/ProgressLog.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Calculate today's calories
        const nutritionLogs = await NutritionLog.find({
            userId: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalCalories = nutritionLogs.reduce((acc, log) => acc + log.totalCalories, 0);

        // Calculate today's workout duration
        const workouts = await Workout.find({
            userId: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        
        let workoutDuration = 0;
        workouts.forEach(workout => {
            workout.exercises.forEach(ex => {
                workoutDuration += (ex.duration || 0);
            });
        });

        // Fetch latest weight from ProgressLog
        const latestProgress = await ProgressLog.findOne({ userId: req.user._id }).sort({ date: -1 });

        const summary = {
            totalCalories,
            workoutDuration,
            currentWeight: latestProgress ? latestProgress.weight : 0,
            waterIntake: 0
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
