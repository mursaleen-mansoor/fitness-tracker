import User from '../models/User.js';
import Mission from '../models/Mission.js';

// @desc    Get Leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('name level xp profilePicture')
            .sort({ level: -1, xp: -1 })
            .limit(10);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User Stats and Achievements
// @route   GET /api/gamification/stats
// @access  Private
export const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('level xp achievements stats');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Daily Mission
// @route   GET /api/gamification/daily-mission
// @access  Private
export const getDailyMission = async (req, res) => {
    try {
        // Check if user already has a mission for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        let mission = await Mission.findOne({
            user: req.user._id,
            date: { $gte: startOfDay }
        });

        if (!mission) {
            // Generate a random "AI" mission
            const missionTypes = ['Strength', 'Endurance', 'Recovery'];
            const chosenType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
            
            mission = await Mission.create({
                user: req.user._id,
                title: `Operation: ${chosenType} Surge`,
                description: `A tactical training protocol focused on ${chosenType.toLowerCase()} to push your limits.`,
                type: chosenType,
                difficulty: req.user.level > 10 ? 'Elite' : (req.user.level > 5 ? 'Tactical' : 'Basic'),
                xpReward: Math.floor(Math.random() * 100) + 50,
                exercises: [
                    { name: chosenType === 'Strength' ? 'Deadlifts' : 'Running', sets: 4, reps: 10, duration: '20 mins' },
                    { name: 'Pushups', sets: 3, reps: 20 }
                ]
            });
        }

        res.json(mission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept Mission
// @route   POST /api/gamification/accept-mission/:id
// @access  Private
export const acceptMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (mission && mission.user.toString() === req.user._id.toString()) {
            mission.status = 'Accepted';
            await mission.save();
            res.json(mission);
        } else {
            res.status(404).json({ message: 'Mission not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete Mission and Award XP
// @route   POST /api/gamification/complete-mission/:id
// @access  Private
export const completeMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (mission && mission.user.toString() === req.user._id.toString() && mission.status === 'Accepted') {
            mission.status = 'Completed';
            await mission.save();

            // Update User XP and Level
            const user = await User.findById(req.user._id);
            user.xp += mission.xpReward;
            
            // Level up logic (e.g., 500 XP per level)
            if (user.xp >= user.level * 500) {
                user.level += 1;
                user.xp = user.xp % (user.level * 500); // Carry over XP
                // Award "Level Up" Achievement if not already awarded
                if (!user.achievements.find(a => a.id === `lv_${user.level}`)) {
                    user.achievements.push({
                        id: `lv_${user.level}`,
                        title: `Reached Level ${user.level}`,
                        icon: 'FaCrown'
                    });
                }
            }
            
            await user.save();
            res.json({ message: 'Mission Completed. XP Awarded!', user });
        } else {
            res.status(404).json({ message: 'Mission not found or not accepted' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
