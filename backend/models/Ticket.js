import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    category: {
        type: String,
        enum: ['Technical', 'Billing', 'Feature Request', 'Bug Report', 'General'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Awaiting User Reply', 'Resolved', 'Closed'],
        default: 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    firstResponseAt: { type: Date, default: null },
    overdueSince: { type: Date, default: null },
    csatRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    }
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
