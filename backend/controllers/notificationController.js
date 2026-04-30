import Notification from '../models/Notification.js';

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.userId.toString() === req.user._id.toString()) {
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a notification (internal use / admin)
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
    try {
        const { title, message, type, link } = req.body;
        const notification = await Notification.create({
            userId: req.user._id,
            title,
            message,
            type,
            link
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Notify all admins (internal use)
// @route   POST /api/notifications/notify-admins
// @access  Private
export const notifyAdmins = async (req, res) => {
    try {
        const { title, message, type, link } = req.body;
        
        // Find all admins
        const User = (await import('../models/User.js')).default;
        const admins = await User.find({ role: 'admin' });
        
        const notifications = admins.map(admin => ({
            userId: admin._id,
            title,
            message,
            type: type || 'system',
            link: link || ''
        }));
        
        await Notification.insertMany(notifications);
        
        res.status(201).json({ message: `Notification sent to ${admins.length} admins` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
