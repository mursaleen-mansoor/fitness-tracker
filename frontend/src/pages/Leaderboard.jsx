import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaStar, FaBolt } from 'react-icons/fa';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await axios.get('/api/gamification/leaderboard');
                setUsers(data);
            } catch (error) {
                console.error("Error fetching leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>ACCESSING GLOBAL RANKINGS...</div>;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .rank-card { background: #111; border: 1px solid #222; margin-bottom: 15px; border-radius: 8px; transition: all 0.3s; }
                .rank-card:hover { border-color: #39ff14; transform: scale(1.01); background: #151515; }
            `}</style>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '50px' }}>
                <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                    HALL OF <span className="text-neon">FAME</span>
                </h1>
                <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>GLOBAL OPERATIVE RANKINGS</p>
            </motion.div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {users.map((user, index) => (
                    <motion.div 
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rank-card"
                        style={{ display: 'flex', alignItems: 'center', padding: '20px', gap: '20px' }}
                    >
                        <div style={{ 
                            width: '40px', 
                            fontSize: '24px', 
                            fontWeight: '900', 
                            color: index === 0 ? '#FFD700' : (index === 1 ? '#C0C0C0' : (index === 2 ? '#CD7F32' : '#444')),
                            textAlign: 'center'
                        }} className="font-display">
                            #{index + 1}
                        </div>
                        
                        <img 
                            src={user.profilePicture && user.profilePicture !== 'default-avatar.png'
                                ? `http://localhost:5000${user.profilePicture}`
                                : `https://ui-avatars.com/api/?name=${user.name}&background=333&color=fff`}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: index < 3 ? `2px solid ${index === 0 ? '#FFD700' : (index === 1 ? '#C0C0C0' : '#CD7F32')}` : 'none' }}
                        />

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {user.name.toUpperCase()}
                                {index === 0 && <FaCrown style={{ color: '#FFD700' }} />}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', fontWeight: '700' }}>LEVEL {user.level}</div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div className="font-display text-neon" style={{ fontSize: '24px' }}>{user.xp}</div>
                            <div style={{ fontSize: '10px', color: '#444', fontWeight: '900' }}>TOTAL XP GATHERED</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
