import mongoose from 'mongoose';

const ticketNoteSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('TicketNote', ticketNoteSchema);
