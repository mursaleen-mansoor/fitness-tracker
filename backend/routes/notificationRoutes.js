import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification, notifyAdmins } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.post('/notify-admins', protect, notifyAdmins);

export default router;
