import User from '../models/User.js';
import Notification from '../models/Notification.js';
import BroadcastLog from '../models/BroadcastLog.js';

// @desc    Send broadcast notification
// @route   POST /api/admin/broadcast
export const sendBroadcast = async (req, res) => {
    try {
        const { target, targetUserId, message } = req.body;
        let query = {};
        let recipientCount = 0;

        if (target === 'All Users') {
            query = { role: 'user' };
        } else if (target === 'All Agents') {
            query = { role: { $in: ['support_agent', 'admin'] } };
        } else if (target === 'Specific User') {
            if (!targetUserId || !targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: 'Invalid or missing User ID for Specific User target' });
            }
            query = { _id: targetUserId };
        }

        const recipients = await User.find(query);
        recipientCount = recipients.length;

        if (recipientCount > 0) {
            const notifications = recipients.map(user => ({
                userId: user._id,
                title: 'System Broadcast',
                message: message,
                type: 'system',
                link: '/dashboard'
            }));
            await Notification.insertMany(notifications);
        }

        const log = await BroadcastLog.create({
            senderId: req.user._id,
            target,
            targetUser: target === 'Specific User' ? targetUserId : undefined,
            message,
            recipientCount
        });

        res.status(201).json({ message: `Broadcast sent to ${recipientCount} users`, log });
    } catch (error) {
        console.error('Broadcast Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

// @desc    Get broadcast history
// @route   GET /api/admin/broadcast/history
export const getBroadcastHistory = async (req, res) => {
    try {
        const history = await BroadcastLog.find()
            .populate('senderId', 'name email')
            .populate('targetUser', 'name email')
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
