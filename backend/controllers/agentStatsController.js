import Ticket from '../models/Ticket.js';
import Activity from '../models/Activity.js';

export const getAgentStats = async (req, res) => {
    try {
        const agentId = req.user._id;
        const now = new Date();
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(); startOfWeek.setDate(now.getDate() - 7);
        const overdue24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [todayOpen, inProgress, overdue, csatData, activities, weekData] = await Promise.all([
            Ticket.countDocuments({ status: 'Open', createdAt: { $gte: startOfDay } }),
            Ticket.countDocuments({ status: 'In Progress', assignedTo: agentId }),
            Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] }, createdAt: { $lte: overdue24h } }),
            Ticket.aggregate([
                { $match: { assignedTo: agentId, csatRating: { $ne: null }, updatedAt: { $gte: startOfWeek } } },
                { $group: { _id: null, avg: { $avg: '$csatRating' } } }
            ]),
            Activity.find()
                .populate('userId', 'name profilePicture')
                .sort({ createdAt: -1 })
                .limit(10),
            Ticket.aggregate([
                { $match: { createdAt: { $gte: startOfWeek } } },
                { 
                    $group: { 
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                        count: { $sum: 1 } 
                    } 
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Process trend data to ensure all days are present
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = weekData.find(w => w._id === dateStr);
            trend.push({ date: dateStr, count: found ? found.count : 0 });
        }

        res.json({
            todayOpen,
            inProgress,
            overdue,
            avgCSAT: csatData[0]?.avg ? parseFloat(csatData[0].avg.toFixed(1)) : 0,
            activities,
            trend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
