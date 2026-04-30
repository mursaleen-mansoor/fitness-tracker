import express from 'express';
import { getTickets, createTicket, getTicketById, replyToTicket, rateTicket, closeTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.get('/:id', protect, getTicketById);
router.post('/:id/messages', protect, replyToTicket);
router.put('/:id/rate', protect, rateTicket);
router.put('/:id/close', protect, closeTicket);

export default router;
