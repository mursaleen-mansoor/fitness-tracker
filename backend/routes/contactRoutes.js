import express from 'express';
import { submitContactRequest, getContactRequests, updateContactStatus, deleteContactRequest } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactRequest);
router.get('/', protect, adminOnly, getContactRequests);
router.patch('/:id', protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContactRequest);

export default router;
