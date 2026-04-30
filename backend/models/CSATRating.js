import mongoose from 'mongoose';

const csatRatingSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('CSATRating', csatRatingSchema);
