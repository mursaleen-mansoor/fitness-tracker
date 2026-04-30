import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, changePassword, uploadProfilePicture, uploadMiddleware } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/profile/picture', protect, uploadMiddleware, uploadProfilePicture);
router.put('/change-password', protect, changePassword);

export default router;
