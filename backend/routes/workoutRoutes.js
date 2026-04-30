import express from 'express';
import { getWorkouts, createWorkout, getWorkoutById, updateWorkout, deleteWorkout } from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getWorkouts)
    .post(protect, createWorkout);

router.route('/:id')
    .get(protect, getWorkoutById)
    .put(protect, updateWorkout)
    .delete(protect, deleteWorkout);

export default router;
