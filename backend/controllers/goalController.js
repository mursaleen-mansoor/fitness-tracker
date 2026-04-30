import Goal from '../models/Goal.js';

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
    try {
        const { title, type, targetValue, deadline } = req.body;
        const goal = await Goal.create({
            userId: req.user._id,
            title,
            type,
            targetValue,
            deadline
        });
        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoalProgress = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (goal && goal.userId.toString() === req.user._id.toString()) {
            goal.currentValue = req.body.currentValue;
            
            // Basic logic for completion
            if (goal.type === 'Weight') {
                // If weight goal, we check if target is met (can be gain or lose)
                // For simplicity, we just save the value
            } else {
                if (goal.currentValue >= goal.targetValue) goal.status = 'Achieved';
            }
            
            const updatedGoal = await goal.save();
            res.json(updatedGoal);
        } else {
            res.status(404).json({ message: 'Goal not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (goal && goal.userId.toString() === req.user._id.toString()) {
            await goal.deleteOne();
            res.json({ message: 'Goal removed' });
        } else {
            res.status(404).json({ message: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
