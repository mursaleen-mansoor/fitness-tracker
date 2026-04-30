import mongoose from 'mongoose';

const ticketMessageSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['user', 'support', 'admin'],
        default: 'user'
    },
    message: {
        type: String,
        required: [true, 'Message cannot be empty']
    }
}, {
    timestamps: true
});

const TicketMessage = mongoose.model('TicketMessage', ticketMessageSchema);
export default TicketMessage;
