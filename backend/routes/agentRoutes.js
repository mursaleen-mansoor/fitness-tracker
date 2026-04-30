import express from 'express';
import { protect, agentOnly } from '../middleware/agentMiddleware.js';
import { getAgentStats } from '../controllers/agentStatsController.js';
import { 
    getAgentTickets, 
    getAgentTicketById, 
    updateAgentTicket, 
    agentReply, 
    addNote, 
    escalateTicket 
} from '../controllers/agentTicketController.js';
import { 
    getTemplates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate 
} from '../controllers/replyTemplateController.js';
import { 
    getArticles, 
    createArticle, 
    updateArticle, 
    deleteArticle, 
    rateArticle 
} from '../controllers/knowledgeBaseController.js';
import { getAgentPerformance } from '../controllers/agentPerformanceController.js';

const router = express.Router();

// All routes here are protected and restricted to agents/admins
router.use(protect);
router.use(agentOnly);

// Stats
router.get('/stats', getAgentStats);

// Tickets
router.get('/tickets', getAgentTickets);
router.route('/tickets/:id')
    .get(getAgentTicketById)
    .put(updateAgentTicket);
router.post('/tickets/:id/reply', agentReply);
router.post('/tickets/:id/notes', addNote);
router.post('/tickets/:id/escalate', escalateTicket);

// Reply Templates
router.route('/templates')
    .get(getTemplates)
    .post(createTemplate);
router.route('/templates/:id')
    .put(updateTemplate)
    .delete(deleteTemplate);

// Knowledge Base
router.route('/knowledge')
    .get(getArticles)
    .post(createArticle);
router.route('/knowledge/:id')
    .put(updateArticle)
    .delete(deleteArticle);
router.post('/knowledge/:id/rate', rateArticle);

// Performance
router.get('/performance', getAgentPerformance);

export default router;
