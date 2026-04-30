import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Workout from '../models/Workout.js';
import NutritionLog from '../models/NutritionLog.js';
import ProgressLog from '../models/ProgressLog.js';
import KnowledgeBase from '../models/KnowledgeBase.js';
import Goal from '../models/Goal.js';

// @desc    Get top-level dashboard stats
// @route   GET /api/admin/stats/overview
export const getAdminOverview = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const overdueThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [totalUsers, activeToday, openTickets, overdueTickets, avgCSAT, totalArticles] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ lastLogin: { $gte: startOfToday } }), // Assuming lastLogin field exists, if not we use activity logs
            Ticket.countDocuments({ status: { $in: ['Open', 'In Progress', 'Awaiting User Reply'] } }),
            Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] }, createdAt: { $lte: overdueThreshold } }),
            Ticket.aggregate([
                { $match: { csatRating: { $ne: null } } },
                { $group: { _id: null, avg: { $avg: '$csatRating' } } }
            ]),
            KnowledgeBase.countDocuments()
        ]);

        res.json({
            totalUsers,
            activeToday,
            openTickets,
            overdueTickets,
            avgCSAT: avgCSAT[0]?.avg ? parseFloat(avgCSAT[0].avg.toFixed(1)) : 0,
            totalArticles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get detailed analytics for charts
// @route   GET /api/admin/stats/analytics
export const getAdminAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        const workoutUsers = await Workout.distinct('userId');
        const nutritionUsers = await NutritionLog.distinct('userId');

        const [
            userGrowth, 
            featureUsage, 
            commonComplaints, 
            resolutionRate,
            dau,
            csatTrend,
            workoutOnly,
            nutritionOnly,
            bothActivity
        ] = await Promise.all([
            // User Growth (Line Chart)
            User.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                { 
                    $group: { 
                        _id: { $dateToString: { format: "%Y-%U", date: "$createdAt" } }, 
                        count: { $sum: 1 } 
                    } 
                },
                { $sort: { _id: 1 } }
            ]),
            // Feature Usage (Bar Chart)
            Promise.all([
                Workout.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                NutritionLog.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                ProgressLog.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                Goal.countDocuments({ createdAt: { $gte: start, $lte: end } })
            ]),
            // Common Complaints (Bar Chart)
            Ticket.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            // Resolution Rate (Doughnut)
            Ticket.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            // Daily Active Users (DAU) - Use updatedAt as proxy if lastLogin is missing
            User.aggregate([
                { $match: { updatedAt: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Avg CSAT Trend over time
            Ticket.aggregate([
                { $match: { csatRating: { $ne: null }, createdAt: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%U", date: "$createdAt" } },
                        avg: { $avg: '$csatRating' }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Engagement Stats
            User.countDocuments({ role: 'user', _id: { $in: workoutUsers, $nin: nutritionUsers } }),
            User.countDocuments({ role: 'user', _id: { $in: nutritionUsers, $nin: workoutUsers } }),
            User.countDocuments({ role: 'user', _id: { $in: workoutUsers, $all: [workoutUsers, nutritionUsers].filter(Array.isArray).flat() } }) // simplified logic
        ]);

        // Fix for bothActivity logic
        const bothCount = await User.countDocuments({ role: 'user', _id: { $in: workoutUsers.filter(id => nutritionUsers.some(nid => nid.toString() === id.toString())) } });

        res.json({
            userGrowth,
            featureUsage: {
                labels: ['Workouts', 'Nutrition', 'Progress', 'Goals'],
                data: featureUsage
            },
            commonComplaints,
            resolutionRate,
            dau: dau.length > 0 ? dau : [],
            csatTrend,
            engagement: {
                labels: ['Workouts Only', 'Nutrition Only', 'Both Activity'],
                data: [workoutOnly, nutritionOnly, bothCount]
            }
        });
    } catch (error) {
        console.error('getAdminAnalytics Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get support team performance
// @route   GET /api/admin/stats/support-team
export const getSupportTeamStats = async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);

        const agents = await User.find({ role: { $in: ['support_agent', 'admin'] } }).select('name email profilePicture status');

        const stats = await Promise.all(agents.map(async (agent) => {
            const [assigned, resolved, csat] = await Promise.all([
                Ticket.countDocuments({ assignedTo: agent._id, createdAt: { $gte: startOfWeek } }),
                Ticket.countDocuments({ assignedTo: agent._id, status: 'Resolved', updatedAt: { $gte: startOfWeek } }),
                Ticket.aggregate([
                    { $match: { assignedTo: agent._id, csatRating: { $ne: null } } },
                    { $group: { _id: null, avg: { $avg: '$csatRating' } } }
                ])
            ]);

            return {
                ...agent._doc,
                assignedThisWeek: assigned,
                resolvedThisWeek: resolved,
                csatScore: csat[0]?.avg ? parseFloat(csat[0].avg.toFixed(1)) : 0,
                avgResponseTime: "2.4 hrs" // Placeholder for now
            };
        }));

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
