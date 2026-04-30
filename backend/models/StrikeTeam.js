import mongoose from 'mongoose';

const strikeTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name'],
        unique: true,
        trim: true
    },
    motto: {
        type: String,
        default: 'Veni, Vidi, Vici'
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teamXP: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const StrikeTeam = mongoose.model('StrikeTeam', strikeTeamSchema);
export default StrikeTeam;
