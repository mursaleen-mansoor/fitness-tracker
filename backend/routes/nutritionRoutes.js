import express from 'express';
import { getNutritionLogs, createNutritionLog, updateNutritionLog, deleteNutritionLog } from '../controllers/nutritionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getNutritionLogs)
    .post(protect, createNutritionLog);

router.route('/:id')
    .put(protect, updateNutritionLog)
    .delete(protect, deleteNutritionLog);

export default router;
