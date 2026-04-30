import express from 'express';
import { 
    getLeaderboard, 
    getUserStats, 
    getDailyMission, 
    acceptMission, 
    completeMission 
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getUserStats);
router.get('/daily-mission', protect, getDailyMission);
router.post('/accept-mission/:id', protect, acceptMission);
router.post('/complete-mission/:id', protect, completeMission);

export default router;
