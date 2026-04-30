import ReplyTemplate from '../models/ReplyTemplate.js';

// GET all templates
export const getTemplates = async (req, res) => {
    try {
        const templates = await ReplyTemplate.find().populate('createdBy', 'name');
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create template
export const createTemplate = async (req, res) => {
    try {
        const template = await ReplyTemplate.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update template
export const updateTemplate = async (req, res) => {
    try {
        const template = await ReplyTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE template
export const deleteTemplate = async (req, res) => {
    try {
        await ReplyTemplate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
