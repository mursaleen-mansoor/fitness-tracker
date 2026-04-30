import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMedal, FaCrown, FaBolt, FaSkull, FaShieldAlt, FaDumbbell, FaFire } from 'react-icons/fa';

const Achievements = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/gamification/stats');
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const allAchievements = [
        { id: 'lv_5', title: 'Specialist', desc: 'Reach Level 5', icon: <FaBolt />, color: '#39ff14' },
        { id: 'lv_10', title: 'Elite Operative', desc: 'Reach Level 10', icon: <FaCrown />, color: '#FFD700' },
        { id: 'first_workout', title: 'Initiated', desc: 'Log your first workout', icon: <FaDumbbell />, color: '#3699ff' },
        { id: 'streak_7', title: 'Consistent Fire', desc: '7 Day Workout Streak', icon: <FaFire />, color: '#ff4444' },
        { id: 'heavy_lifter', title: 'Iron Will', desc: 'Lift over 1000kg total', icon: <FaSkull />, color: '#8950fc' }
    ];

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>RETRIEVING MEDALS...</div>;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .medal-card { background: #111; border: 1px solid #222; padding: 30px; border-radius: 12px; text-align: center; position: relative; overflow: hidden; }
                .medal-locked { opacity: 0.3; filter: grayscale(100%); }
            `}</style>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '50px' }}>
                <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                    TACTICAL <span className="text-neon">ACHIEVEMENTS</span>
                </h1>
                <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>PROOF OF SUPERIORITY</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                {allAchievements.map((ach, index) => {
                    const isUnlocked = stats.achievements.find(a => a.id === ach.id);
                    return (
                        <motion.div 
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`medal-card ${!isUnlocked ? 'medal-locked' : ''}`}
                            style={{ border: isUnlocked ? `1px solid ${ach.color}` : '1px solid #222' }}
                        >
                            <div style={{ fontSize: '50px', color: ach.color, marginBottom: '15px' }}>
                                {ach.icon}
                            </div>
                            <h3 className="font-display" style={{ fontSize: '24px', margin: '0 0 5px 0', color: isUnlocked ? 'white' : '#444' }}>{ach.title}</h3>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{ach.desc}</p>
                            
                            {isUnlocked && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', color: ach.color, fontSize: '12px', fontWeight: '900' }}>
                                    UNLOCKED
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
