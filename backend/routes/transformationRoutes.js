import express from 'express';
import { uploadTransformation, getTransformations } from '../controllers/transformationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, uploadTransformation).get(protect, getTransformations);

export default router;
