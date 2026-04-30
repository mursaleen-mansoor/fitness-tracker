import mongoose from 'mongoose';

const armoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['HUD_SKIN', 'AVATAR', 'THEME'],
        required: true
    },
    description: String,
    xpCost: {
        type: Number,
        default: 0
    },
    primaryColor: String,
    secondaryColor: String,
    glowColor: String,
    previewImage: String
}, { timestamps: true });

const ArmoryItem = mongoose.model('ArmoryItem', armoryItemSchema);
export default ArmoryItem;
