import express from 'express';
import { logBiometrics, getBiometrics } from '../controllers/biometricController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, logBiometrics).get(protect, getBiometrics);

export default router;
