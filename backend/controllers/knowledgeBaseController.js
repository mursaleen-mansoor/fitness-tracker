import KnowledgeBase from '../models/KnowledgeBase.js';

// GET all articles
export const getArticles = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        if (category) query.category = category;

        const articles = await KnowledgeBase.find(query).populate('authorId', 'name').sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create article
export const createArticle = async (req, res) => {
    try {
        const article = await KnowledgeBase.create({
            ...req.body,
            authorId: req.user._id
        });
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update article
export const updateArticle = async (req, res) => {
    try {
        const article = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE article
export const deleteArticle = async (req, res) => {
    try {
        await KnowledgeBase.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST rate article
export const rateArticle = async (req, res) => {
    try {
        const { helpful } = req.body;
        const article = await KnowledgeBase.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        if (helpful) {
            article.helpfulCount += 1;
        } else {
            article.notHelpfulCount += 1;
        }

        const totalVotes = article.helpfulCount + article.notHelpfulCount;
        article.averageRating = (article.helpfulCount / totalVotes) * 5;

        await article.save();
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
