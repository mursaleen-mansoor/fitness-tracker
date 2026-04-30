import NutritionLog from '../models/NutritionLog.js';

// @desc    Get all nutrition logs for a user
// @route   GET /api/nutrition
// @access  Private
export const getNutritionLogs = async (req, res) => {
    try {
        const logs = await NutritionLog.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new nutrition log
// @route   POST /api/nutrition
// @access  Private
export const createNutritionLog = async (req, res) => {
    try {
        const { date, mealType, foodItems } = req.body;
        const log = await NutritionLog.create({
            userId: req.user._id,
            date,
            mealType,
            foodItems
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update nutrition log
// @route   PUT /api/nutrition/:id
// @access  Private
export const updateNutritionLog = async (req, res) => {
    try {
        const log = await NutritionLog.findById(req.params.id);
        if (log && log.userId.toString() === req.user._id.toString()) {
            Object.assign(log, req.body);
            const updatedLog = await log.save();
            res.json(updatedLog);
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete nutrition log
// @route   DELETE /api/nutrition/:id
// @access  Private
export const deleteNutritionLog = async (req, res) => {
    try {
        const log = await NutritionLog.findById(req.params.id);
        if (log && log.userId.toString() === req.user._id.toString()) {
            await log.deleteOne();
            res.json({ message: 'Nutrition log removed' });
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
