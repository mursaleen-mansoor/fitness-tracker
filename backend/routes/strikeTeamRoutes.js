import express from 'express';
import { 
    createStrikeTeam, 
    getStrikeTeams, 
    joinStrikeTeam, 
    getMyTeam 
} from '../controllers/strikeTeamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createStrikeTeam).get(protect, getStrikeTeams);
router.get('/my-team', protect, getMyTeam);
router.post('/join/:id', protect, joinStrikeTeam);

export default router;
