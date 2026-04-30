import express from 'express';
import { getArmoryItems, unlockItem, applySkin, seedArmory } from '../controllers/armoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getArmoryItems);
router.post('/unlock/:id', protect, unlockItem);
router.patch('/apply/:name', protect, applySkin);
router.post('/seed', protect, adminOnly, seedArmory);

export default router;
