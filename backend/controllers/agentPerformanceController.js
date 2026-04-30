import Ticket from '../models/Ticket.js';
import CSATRating from '../models/CSATRating.js';
import Escalation from '../models/Escalation.js';

export const getAgentPerformance = async (req, res) => {
    try {
        const agentId = req.user._id;
        const now = new Date();
        const startOfWeek = new Date(); startOfWeek.setDate(now.getDate() - 7);
        const startOfLastWeek = new Date(); startOfLastWeek.setDate(now.getDate() - 14);

        // This week's metrics
        const [resolvedThisWeek, assignedThisWeek, csatThisWeek, escalatedThisWeek, ticketsWithResponse] = await Promise.all([
            Ticket.countDocuments({ assignedTo: agentId, status: 'Closed', updatedAt: { $gte: startOfWeek } }),
            Ticket.countDocuments({ assignedTo: agentId, createdAt: { $gte: startOfWeek } }),
            CSATRating.aggregate([
                { $match: { agentId, createdAt: { $gte: startOfWeek } } },
                { $group: { _id: null, avg: { $avg: '$rating' } } }
            ]),
            Escalation.countDocuments({ fromAgentId: agentId, createdAt: { $gte: startOfWeek } }),
            Ticket.find({ assignedTo: agentId, firstResponseAt: { $ne: null }, createdAt: { $gte: startOfWeek } })
        ]);

        // Last week's metrics for comparison
        const [resolvedLastWeek, assignedLastWeek, csatLastWeek] = await Promise.all([
            Ticket.countDocuments({ assignedTo: agentId, status: 'Closed', updatedAt: { $gte: startOfLastWeek, $lt: startOfWeek } }),
            Ticket.countDocuments({ assignedTo: agentId, createdAt: { $gte: startOfLastWeek, $lt: startOfWeek } }),
            CSATRating.aggregate([
                { $match: { agentId, createdAt: { $gte: startOfLastWeek, $lt: startOfWeek } } },
                { $group: { _id: null, avg: { $avg: '$rating' } } }
            ])
        ]);

        // Calculate Average First Response Time (in hours)
        let totalResponseTime = 0;
        ticketsWithResponse.forEach(t => {
            const diff = (t.firstResponseAt - t.createdAt) / (1000 * 60 * 60);
            totalResponseTime += diff;
        });
        const avgResponseTime = ticketsWithResponse.length > 0 ? (totalResponseTime / ticketsWithResponse.length).toFixed(1) : 0;

        res.json({
            metrics: {
                resolved: resolvedThisWeek,
                assigned: assignedThisWeek,
                avgCSAT: csatThisWeek[0]?.avg ? parseFloat(csatThisWeek[0].avg.toFixed(1)) : 0,
                escalated: escalatedThisWeek,
                avgResponseTime
            },
            comparison: {
                resolvedDiff: resolvedThisWeek - resolvedLastWeek,
                assignedDiff: assignedThisWeek - assignedLastWeek,
                csatDiff: (csatThisWeek[0]?.avg || 0) - (csatLastWeek[0]?.avg || 0)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
