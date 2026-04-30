import mongoose from 'mongoose';

const replyTemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, default: 'General' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('ReplyTemplate', replyTemplateSchema);
