import ProgressLog from '../models/ProgressLog.js';

// @desc    Get all progress logs
// @route   GET /api/progress
// @access  Private
export const getProgressLogs = async (req, res) => {
    console.log(`Fetching progress logs for user: ${req.user._id}`);
    try {
        const logs = await ProgressLog.find({ userId: req.user._id }).sort({ date: 1 });
        res.json(logs);
    } catch (error) {
        console.error("GET Progress Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create progress log
// @route   POST /api/progress
// @access  Private
export const createProgressLog = async (req, res) => {
    try {
        const { weight, bodyFat, measurements, date } = req.body;
        const log = await ProgressLog.create({
            userId: req.user._id,
            weight,
            bodyFat,
            measurements,
            date
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete progress log
// @route   DELETE /api/progress/:id
// @access  Private
export const deleteProgressLog = async (req, res) => {
    console.log(`Attempting to delete log: ${req.params.id} for user: ${req.user._id}`);
    try {
        const log = await ProgressLog.findById(req.params.id);
        if (!log) {
            console.log("Log not found in database");
            return res.status(404).json({ message: 'Log not found' });
        }
        
        console.log(`Log owner: ${log.userId}, Requesting user: ${req.user._id}`);
        
        if (log.userId.toString() === req.user._id.toString()) {
            await log.deleteOne();
            console.log("Log deleted successfully");
            res.json({ message: 'Log removed' });
        } else {
            console.log("Unauthorized delete attempt");
            res.status(401).json({ message: 'Not authorized' });
        }
    } catch (error) {
        console.error("DELETE Progress Error:", error);
        res.status(500).json({ message: error.message });
    }
};
