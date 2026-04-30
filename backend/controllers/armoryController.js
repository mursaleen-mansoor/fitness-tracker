import ArmoryItem from '../models/ArmoryItem.js';
import User from '../models/User.js';

// @desc    Get All Armory Items
// @route   GET /api/armory
// @access  Private
export const getArmoryItems = async (req, res) => {
    try {
        const items = await ArmoryItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unlock Armory Item
// @route   POST /api/armory/unlock/:id
// @access  Private
export const unlockItem = async (req, res) => {
    try {
        const item = await ArmoryItem.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (user.unlockedSkins.includes(item.name)) return res.status(400).json({ message: 'Item already unlocked' });
        
        // Check if user has enough level/xp (simulated check for now)
        // For simplicity, we'll just check if they have enough total XP
        const totalXp = user.level * 500 + user.xp;
        if (totalXp < item.xpCost) return res.status(400).json({ message: 'Insufficient XP clearance' });

        user.unlockedSkins.push(item.name);
        await user.save();

        res.json({ message: `${item.name} Unlocked`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply HUD Skin
// @route   PATCH /api/armory/apply/:name
// @access  Private
export const applySkin = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.unlockedSkins.includes(req.params.name)) {
            return res.status(403).json({ message: 'Skin not unlocked' });
        }

        user.activeHUDSkin = req.params.name;
        await user.save();

        res.json({ message: `Skin ${req.params.name} Applied`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed Armory (Utility)
export const seedArmory = async (req, res) => {
    const items = [
        { name: 'Neon Green', type: 'HUD_SKIN', xpCost: 0, primaryColor: '#39ff14', secondaryColor: 'rgba(57, 255, 20, 0.2)', glowColor: 'rgba(57, 255, 20, 0.4)' },
        { name: 'Cyber Blue', type: 'HUD_SKIN', xpCost: 1000, primaryColor: '#00f2ff', secondaryColor: 'rgba(0, 242, 255, 0.2)', glowColor: 'rgba(0, 242, 255, 0.4)' },
        { name: 'Blood Red', type: 'HUD_SKIN', xpCost: 2500, primaryColor: '#ff0000', secondaryColor: 'rgba(255, 0, 0, 0.2)', glowColor: 'rgba(255, 0, 0, 0.4)' },
        { name: 'Gold Elite', type: 'HUD_SKIN', xpCost: 5000, primaryColor: '#ffd700', secondaryColor: 'rgba(255, 215, 0, 0.2)', glowColor: 'rgba(255, 215, 0, 0.4)' }
    ];
    
    try {
        await ArmoryItem.deleteMany({});
        await ArmoryItem.insertMany(items);
        res.json({ message: 'Armory Seeded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
