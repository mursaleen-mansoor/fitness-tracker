import Transformation from '../models/Transformation.js';

// @desc    Upload Transformation Photo
// @route   POST /api/transformations
// @access  Private
export const uploadTransformation = async (req, res) => {
    try {
        const { imageUrl, weight, bodyFat, label } = req.body;
        const transformation = await Transformation.create({
            user: req.user._id,
            imageUrl,
            weight,
            bodyFat,
            label
        });
        res.status(201).json(transformation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Transformation Photos
// @route   GET /api/transformations
// @access  Private
export const getTransformations = async (req, res) => {
    try {
        const photos = await Transformation.find({ user: req.user._id }).sort({ date: -1 });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
