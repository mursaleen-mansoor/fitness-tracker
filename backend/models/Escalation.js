import mongoose from 'mongoose';

const escalationSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    fromAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    toAdmin: { type: Boolean, default: false },
    reason: { type: String, required: true },
    resolved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Escalation', escalationSchema);
