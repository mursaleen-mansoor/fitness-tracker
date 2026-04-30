import Ticket from '../models/Ticket.js';
import TicketMessage from '../models/TicketMessage.js';
import User from '../models/User.js';

// @desc    Get all tickets in the system
// @route   GET /api/admin/tickets
export const getAllTicketsAdmin = async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        const query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { ticketId: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        const tickets = await Ticket.find(query)
            .populate('userId', 'name email profilePicture')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get escalated tickets
// @route   GET /api/admin/tickets/escalated
export const getEscalatedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ isEscalated: true })
            .populate('userId', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reassign ticket to another agent
// @route   PUT /api/admin/tickets/:id/reassign
export const reassignTicket = async (req, res) => {
    try {
        const { agentId } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const agent = await User.findById(agentId);
        if (!agent || (agent.role !== 'support_agent' && agent.role !== 'admin')) {
            return res.status(400).json({ message: 'Invalid agent for assignment' });
        }

        ticket.assignedTo = agentId;
        ticket.status = 'In Progress';
        await ticket.save();

        res.json({ message: 'Ticket reassigned successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ticket permanently
// @route   DELETE /api/admin/tickets/:id
export const deleteTicketByAdmin = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        await TicketMessage.deleteMany({ ticketId: ticket._id });
        await ticket.deleteOne();

        res.json({ message: 'Ticket and associated messages deleted permanently' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get single ticket detail
// @route   GET /api/admin/tickets/:id
export const getTicketDetailAdmin = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('userId', 'name email profilePicture createdAt')
            .populate('assignedTo', 'name email');
        
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const messages = await TicketMessage.find({ ticketId: ticket._id })
            .populate('senderId', 'name profilePicture')
            .sort({ createdAt: 1 });

        // Get some user activity stats for the detail view
        const [lastWorkout, lastNutrition] = await Promise.all([
            import('../models/Workout.js').then(m => m.default.findOne({ userId: ticket.userId._id }).sort({ createdAt: -1 })),
            import('../models/NutritionLog.js').then(m => m.default.findOne({ userId: ticket.userId._id }).sort({ createdAt: -1 }))
        ]);

        res.json({
            ticket,
            messages,
            userActivity: {
                lastWorkout,
                lastNutrition
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to ticket as admin
// @route   POST /api/admin/tickets/:id/reply
export const replyToTicketAdmin = async (req, res) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const newMessage = await TicketMessage.create({
            ticketId: ticket._id,
            senderId: req.user._id,
            senderRole: 'admin',
            message
        });

        ticket.status = 'In Progress';
        ticket.isEscalated = false; // Resolved or being handled by admin now
        await ticket.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket status by admin
// @route   PUT /api/admin/tickets/:id/status
export const updateTicketStatusAdmin = async (req, res) => {
    try {
        const { status, priority } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
