import express from 'express';
import { getProgressLogs, createProgressLog, deleteProgressLog } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getProgressLogs)
    .post(protect, createProgressLog);

router.route('/:id')
    .delete(protect, deleteProgressLog);

export default router;
