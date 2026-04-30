import StrikeTeam from '../models/StrikeTeam.js';
import User from '../models/User.js';

// @desc    Create a new Strike Team
// @route   POST /api/strike-teams
// @access  Private
export const createStrikeTeam = async (req, res) => {
    try {
        const { name, motto } = req.body;
        
        const existingTeam = await StrikeTeam.findOne({ name });
        if (existingTeam) return res.status(400).json({ message: 'Team name already exists' });

        const team = await StrikeTeam.create({
            name,
            motto,
            leader: req.user._id,
            members: [req.user._id]
        });

        await User.findByIdAndUpdate(req.user._id, { strikeTeam: team._id });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public Strike Teams
// @route   GET /api/strike-teams
// @access  Private
export const getStrikeTeams = async (req, res) => {
    try {
        const teams = await StrikeTeam.find({ isPublic: true })
            .populate('leader', 'name')
            .sort({ teamXP: -1 });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a Strike Team
// @route   POST /api/strike-teams/join/:id
// @access  Private
export const joinStrikeTeam = async (req, res) => {
    try {
        const team = await StrikeTeam.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        // Remove from old team if any
        const user = await User.findById(req.user._id);
        if (user.strikeTeam) {
            await StrikeTeam.findByIdAndUpdate(user.strikeTeam, { $pull: { members: req.user._id } });
        }

        team.members.push(req.user._id);
        await team.save();

        user.strikeTeam = team._id;
        await user.save();

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Team Details
// @route   GET /api/strike-teams/my-team
// @access  Private
export const getMyTeam = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('strikeTeam');
        if (!user.strikeTeam) return res.status(404).json({ message: 'Not part of any team' });
        
        const team = await StrikeTeam.findById(user.strikeTeam._id)
            .populate('members', 'name level profilePicture')
            .populate('leader', 'name');
            
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
