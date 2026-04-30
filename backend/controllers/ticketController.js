import Ticket from '../models/Ticket.js';
import TicketMessage from '../models/TicketMessage.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

// @desc    Get all tickets for user
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
    try {
        const { subject, category, priority, firstMessage } = req.body;
        const ticket = await Ticket.create({
            userId: req.user._id,
            subject,
            category,
            priority
        });

        // Save the first message
        if (firstMessage) {
            await TicketMessage.create({
                ticketId: ticket._id,
                senderId: req.user._id,
                senderRole: 'user',
                message: firstMessage
            });
        }

        // Create a notification for the user
        await Notification.create({
            userId: req.user._id,
            title: 'Support Ticket Created',
            message: `Your ticket "${subject}" has been submitted. We'll respond shortly.`,
            type: 'support',
            link: `/support`
        });

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: ticket._id,
            action: 'Created a new ticket',
            type: 'ticket_created'
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single ticket with messages
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket || ticket.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        const messages = await TicketMessage.find({ ticketId: ticket._id }).sort({ createdAt: 1 });
        res.json({ ticket, messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to a ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
export const replyToTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket || ticket.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        const msg = await TicketMessage.create({
            ticketId: ticket._id,
            senderId: req.user._id,
            senderRole: 'user',
            message: req.body.message
        });

        // Update ticket status back to open if it was resolved
        if (ticket.status === 'Resolved') {
            ticket.status = 'Open';
            await ticket.save();
        }

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: ticket._id,
            action: 'User replied to ticket',
            type: 'user_reply'
        });

        res.status(201).json(msg);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Rate ticket (CSAT)
// @route   PUT /api/tickets/:id/rate
// @access  Private
export const rateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket || ticket.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        ticket.csatRating = req.body.rating;
        ticket.status = 'Closed';
        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Close ticket
// @route   PUT /api/tickets/:id/close
// @access  Private
export const closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket || ticket.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        ticket.status = 'Closed';
        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
