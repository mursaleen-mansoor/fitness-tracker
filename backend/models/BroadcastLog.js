import mongoose from 'mongoose';

const broadcastLogSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: String,
        enum: ['All Users', 'All Agents', 'Specific User'],
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    recipientCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const BroadcastLog = mongoose.model('BroadcastLog', broadcastLogSchema);
export default BroadcastLog;
