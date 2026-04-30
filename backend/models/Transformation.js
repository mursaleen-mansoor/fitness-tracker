import mongoose from 'mongoose';

const transformationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: Number,
    bodyFat: Number,
    label: String // e.g., "Starting Point", "Month 3"
}, { timestamps: true });

const Transformation = mongoose.model('Transformation', transformationSchema);
export default Transformation;
