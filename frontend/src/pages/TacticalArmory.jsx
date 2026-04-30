import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUnlock, FaPalette, FaGem, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const TacticalArmory = () => {
    const { user, setUser } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/armory');
            setItems(data);
        } catch (error) {
            console.error("Error fetching armory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUnlock = async (id) => {
        try {
            const { data } = await axios.post(`/api/armory/unlock/${id}`);
            toast.success(data.message);
            // Update context user to reflect new unlocked skins
            setUser(data.user);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unlock failed');
        }
    };

    const handleApply = async (name) => {
        try {
            const { data } = await axios.patch(`/api/armory/apply/${name}`);
            toast.success(data.message);
            setUser(data.user);
        } catch (error) {
            toast.error('Failed to apply skin');
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>ACCESSING ARMORY VAULT...</div>;

    const totalXp = user.level * 500 + user.xp;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .item-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 25px; transition: all 0.3s; position: relative; overflow: hidden; }
                .item-card:hover { border-color: #39ff14; transform: translateY(-5px); }
                .item-locked { opacity: 0.7; }
                .xp-badge { background: rgba(57, 255, 20, 0.1); border: 1px solid #39ff14; color: #39ff14; padding: 10px 20px; border-radius: 4px; font-weight: 900; }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        TACTICAL <span className="text-neon">ARMORY</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>EXCHANGE XP FOR ELITE GEAR</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#666', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>XP CLEARANCE LEVEL</div>
                    <div className="xp-badge font-display" style={{ fontSize: '24px' }}>{totalXp} XP</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '300px', gap: '30px' }}>
                {items.map((item) => {
                    const isUnlocked = user.unlockedSkins.includes(item.name);
                    const isActive = user.activeHUDSkin === item.name;
                    const canAfford = totalXp >= item.xpCost;

                    return (
                        <motion.div 
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`item-card ${!isUnlocked ? 'item-locked' : ''}`}
                            style={{ border: isActive ? '2px solid #39ff14' : '1px solid #222' }}
                        >
                            <div style={{ width: '100%', height: '150px', background: item.secondaryColor || '#0a0a0a', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <FaShieldAlt style={{ fontSize: '60px', color: item.primaryColor }} />
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', fontWeight: '900', color: '#444' }}>HUD_SIG_v4.1</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className="font-display" style={{ fontSize: '24px', margin: 0, color: item.primaryColor }}>{item.name}</h3>
                                    <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>Advanced HUD overlay system.</p>
                                </div>
                                <div className="font-display" style={{ fontSize: '20px' }}>{item.xpCost} XP</div>
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                {isActive ? (
                                    <button disabled style={{ width: '100%', padding: '15px', background: 'rgba(57, 255, 20, 0.1)', border: '1px solid #39ff14', color: '#39ff14', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <FaCheckCircle /> ACTIVE HUD
                                    </button>
                                ) : isUnlocked ? (
                                    <button onClick={() => handleApply(item.name)} style={{ width: '100%', padding: '15px', background: item.primaryColor, border: 'none', color: 'black', fontWeight: '900', cursor: 'pointer' }}>
                                        APPLY SKIN
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleUnlock(item._id)} 
                                        disabled={!canAfford}
                                        style={{ width: '100%', padding: '15px', background: canAfford ? 'white' : '#222', border: 'none', color: 'black', fontWeight: '900', cursor: canAfford ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        <FaUnlock /> {canAfford ? 'UNLOCK GEAR' : 'XP LOCKED'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default TacticalArmory;
