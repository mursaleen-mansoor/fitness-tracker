import Activity from '../models/Activity.js';

// @desc    Get all system activity logs
// @route   GET /api/admin/logs
export const getAuditLogs = async (req, res) => {
    try {
        const { type, search } = req.query;
        const query = {};

        if (type) query.type = type;
        
        const logs = await Activity.find(query)
            .populate('userId', 'name email profilePicture')
            .populate('ticketId', 'ticketId subject')
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
