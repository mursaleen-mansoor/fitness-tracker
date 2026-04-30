import Biometric from '../models/Biometrics.js';

// @desc    Log Daily Biometrics
// @route   POST /api/biometrics
// @access  Private
export const logBiometrics = async (req, res) => {
    try {
        const { sleepHours, stressLevel, restingHeartRate } = req.body;
        
        // Calculate recovery score (simple logic)
        const recoveryScore = Math.min(100, (sleepHours * 10) - (stressLevel * 2));

        const biometric = await Biometric.create({
            user: req.user._id,
            sleepHours,
            stressLevel,
            restingHeartRate,
            recoveryScore
        });

        res.status(201).json(biometric);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Biometric History
// @route   GET /api/biometrics
// @access  Private
export const getBiometrics = async (req, res) => {
    try {
        const history = await Biometric.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(30);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
