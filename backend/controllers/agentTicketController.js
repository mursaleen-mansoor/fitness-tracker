import Ticket from '../models/Ticket.js';
import TicketMessage from '../models/TicketMessage.js';
import TicketNote from '../models/TicketNote.js';
import Escalation from '../models/Escalation.js';
import Notification from '../models/Notification.js';
import Workout from '../models/Workout.js';
import NutritionLog from '../models/NutritionLog.js';
import Activity from '../models/Activity.js';

// GET all tickets with search/filter/sort
export const getAgentTickets = async (req, res) => {
    try {
        const { search, status, priority, category, page = 1, limit = 20 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { ticketId: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        const overdue24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const tickets = await Ticket.find(query)
            .populate('userId', 'name email profilePicture')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Mark overdue
        const ticketsWithOverdue = tickets.map(t => ({
            ...t.toObject(),
            isOverdue: t.status !== 'Resolved' && t.status !== 'Closed' && t.createdAt < overdue24h
        }));

        // Sort: overdue first, then by priority, then by date
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        ticketsWithOverdue.sort((a, b) => {
            if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
            return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
        });

        const total = await Ticket.countDocuments(query);
        res.json({ tickets: ticketsWithOverdue, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single ticket with messages, notes, user activity
export const getAgentTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('userId', 'name email profilePicture createdAt')
            .populate('assignedTo', 'name');

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const [messages, notes, lastWorkout, lastNutrition] = await Promise.all([
            TicketMessage.find({ ticketId: ticket._id }).populate('senderId', 'name role profilePicture').sort({ createdAt: 1 }),
            TicketNote.find({ ticketId: ticket._id }).populate('agentId', 'name').sort({ createdAt: -1 }),
            Workout.findOne({ userId: ticket.userId._id }).sort({ date: -1 }).select('name date'),
            NutritionLog.findOne({ userId: ticket.userId._id }).sort({ date: -1 }).select('mealType date')
        ]);

        res.json({ ticket, messages, notes, userActivity: { lastWorkout, lastNutrition } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update ticket status/priority/assignee
export const updateAgentTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const { status, priority, assignedTo } = req.body;
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

        await ticket.save();

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: ticket._id,
            action: `Status updated to ${status || ticket.status}, Priority to ${priority || ticket.priority}`,
            type: status ? 'status_change' : 'priority_change'
        });

        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// POST agent reply
export const agentReply = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('userId', 'name');
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const msg = await TicketMessage.create({
            ticketId: ticket._id,
            senderId: req.user._id,
            senderRole: 'support',
            message: req.body.message
        });

        // Set first response time
        if (!ticket.firstResponseAt) {
            ticket.firstResponseAt = new Date();
        }
        if (ticket.status === 'Open') ticket.status = 'In Progress';
        if (!ticket.assignedTo) ticket.assignedTo = req.user._id;
        await ticket.save();

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: ticket._id,
            action: 'Replied to ticket',
            type: 'agent_reply'
        });

        // Notify the user
        await Notification.create({
            userId: ticket.userId._id,
            title: 'Support Reply Received',
            message: `An agent replied to your ticket: "${ticket.subject}"`,
            type: 'support',
            link: '/support'
        });

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`user_${ticket.userId._id}`).emit('ticket_reply', {
                ticketId: ticket._id,
                message: req.body.message
            });
        }

        const populated = await msg.populate('senderId', 'name role');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// POST internal note
export const addNote = async (req, res) => {
    try {
        const note = await TicketNote.create({
            ticketId: req.params.id,
            agentId: req.user._id,
            content: req.body.content
        });
        const populated = await note.populate('agentId', 'name');

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: req.params.id,
            action: 'Added an internal note',
            type: 'note_added'
        });

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// POST escalate ticket
export const escalateTicket = async (req, res) => {
    try {
        const { reason, toAgentId, toAdmin } = req.body;
        const escalation = await Escalation.create({
            ticketId: req.params.id,
            fromAgentId: req.user._id,
            toAgentId: toAgentId || null,
            toAdmin: toAdmin || false,
            reason
        });

        // Notify target agent
        if (toAgentId) {
            await Notification.create({
                userId: toAgentId,
                title: 'Ticket Escalated to You',
                message: `A ticket has been escalated to you: Reason — ${reason}`,
                type: 'support',
                link: `/agent/ticket/${req.params.id}`
            });
        }

        // Log Activity
        await Activity.create({
            userId: req.user._id,
            ticketId: req.params.id,
            action: `Escalated ticket: ${reason}`,
            type: 'escalated'
        });

        res.status(201).json(escalation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
