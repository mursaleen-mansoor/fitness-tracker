import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

import { 
    getAllUsers, 
    getUserFullProfile, 
    updateUserByAdmin, 
    deleteUserByAdmin,
    createUserByAdmin
} from '../controllers/adminUserController.js';

import { 
    getAllTicketsAdmin, 
    getEscalatedTickets, 
    reassignTicket, 
    deleteTicketByAdmin,
    getTicketDetailAdmin,
    replyToTicketAdmin,
    updateTicketStatusAdmin
} from '../controllers/adminTicketController.js';

import { 
    getAdminOverview, 
    getAdminAnalytics,
    getSupportTeamStats
} from '../controllers/adminStatsController.js';

import { 
    sendBroadcast, 
    getBroadcastHistory 
} from '../controllers/adminBroadcastController.js';

import { getAuditLogs } from '../controllers/adminAuditController.js';

import { 
    getAllArticlesAdmin, 
    toggleArticleStatus, 
    getAllTemplatesAdmin 
} from '../controllers/adminKnowledgeController.js';

// Apply protection to all admin routes
router.use(protect);
router.use(adminOnly);

// Stats & Overview
router.get('/stats/overview', getAdminOverview);
router.get('/stats/analytics', getAdminAnalytics);
router.get('/stats/support-team', getSupportTeamStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);
router.get('/users/:id', getUserFullProfile);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

// Ticket Management
router.get('/tickets', getAllTicketsAdmin);
router.get('/tickets/escalated', getEscalatedTickets);
router.get('/tickets/:id', getTicketDetailAdmin);
router.post('/tickets/:id/reply', replyToTicketAdmin);
router.put('/tickets/:id/status', updateTicketStatusAdmin);
router.put('/tickets/:id/reassign', reassignTicket);
router.delete('/tickets/:id', deleteTicketByAdmin);

// Broadcast System
router.post('/broadcast', sendBroadcast);
router.get('/broadcast/history', getBroadcastHistory);

// Audit Logs
router.get('/logs', getAuditLogs);

// Knowledge & Templates
router.get('/knowledge', getAllArticlesAdmin);
router.put('/knowledge/:id/toggle', toggleArticleStatus);
router.get('/templates', getAllTemplatesAdmin);

export default router;
