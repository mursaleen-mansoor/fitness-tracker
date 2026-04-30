import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ['Workout Tracking', 'Nutrition Log', 'Progress Tracking', 'Account / Profile Issue', 'Notification Problem', 'Export / Report Issue', 'Other'],
        required: true
    },
    content: { type: String, required: true },
    tags: [String],
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
