import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: null
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    type: {
        type: String,
        enum: ['ticket_created', 'agent_reply', 'user_reply', 'status_change', 'priority_change', 'assigned', 'note_added', 'escalated'],
        required: true
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
