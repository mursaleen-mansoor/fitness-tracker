import KnowledgeBase from '../models/KnowledgeBase.js';
import ReplyTemplate from '../models/ReplyTemplate.js';

// @desc    Get all knowledge articles for moderation
// @route   GET /api/admin/knowledge
export const getAllArticlesAdmin = async (req, res) => {
    try {
        const articles = await KnowledgeBase.find()
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle article publication status
// @route   PUT /api/admin/knowledge/:id/toggle
export const toggleArticleStatus = async (req, res) => {
    try {
        const article = await KnowledgeBase.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.published = !article.published;
        await article.save();
        res.json({ message: `Article ${article.published ? 'published' : 'unpublished'}`, article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reply templates
// @route   GET /api/admin/templates
export const getAllTemplatesAdmin = async (req, res) => {
    try {
        const templates = await ReplyTemplate.find().sort({ category: 1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
