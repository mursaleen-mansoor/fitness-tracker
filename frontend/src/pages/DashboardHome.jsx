import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
    FaFire, FaClock, FaWeight, FaTint, FaChartLine, 
    FaCalendarAlt, FaSkull, FaCrown, FaBolt, FaCrosshairs,
    FaDumbbell, FaShieldAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DNASequence from '../components/DNASequence';

const getGreeting = () => {
    const hour = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Karachi"})).getHours();
    if (hour >= 5 && hour < 12) return "GOOD MORNING";
    if (hour >= 12 && hour < 17) return "GOOD AFTERNOON";
    if (hour >= 17 && hour < 21) return "GOOD EVENING";
    return "GOOD NIGHT";
};

const DashboardHome = () => {
    const { user: authUser } = useContext(AuthContext);
    const [summary, setSummary] = useState({
        totalCalories: 0,
        workoutDuration: 0,
        currentWeight: 0,
        waterIntake: 0
    });
    const [stats, setStats] = useState({
        level: 1,
        xp: 0,
        achievements: [],
        stats: { strength: 10, endurance: 10, agility: 10, recovery: 10 }
    });
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRedAlert, setIsRedAlert] = useState(false);
    const [isXrayMode, setIsXrayMode] = useState(false);
    const [showDropPod, setShowDropPod] = useState(false);

    // Dynamic HUD Theme
    const getHUDColor = () => {
        switch (authUser?.activeHUDSkin) {
            case 'Cyber Blue': return '#00f2ff';
            case 'Blood Red': return '#ff0000';
            case 'Gold Elite': return '#ffd700';
            default: return '#39ff14';
        }
    };
    const hudColor = isRedAlert ? '#ff0000' : getHUDColor();

    const fetchData = async () => {
        try {
            const [summaryRes, statsRes, missionRes, bioRes] = await Promise.all([
                axios.get('/api/dashboard/summary'),
                axios.get('/api/gamification/stats'),
                axios.get('/api/gamification/daily-mission'),
                axios.get('/api/biometrics')
            ]);
            setSummary(summaryRes.data);
            setStats(statsRes.data);
            setMission(missionRes.data);
            
            // Red Alert Check (Stress > 8 or Sleep < 4)
            const latestBio = bioRes.data[0];
            if (latestBio && (latestBio.stressLevel > 8 || latestBio.sleepHours < 4)) {
                setIsRedAlert(true);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const acceptMission = async () => {
        setShowDropPod(true);
        // Wait for animation to finish
        setTimeout(async () => {
            try {
                await axios.post(`/api/gamification/accept-mission/${mission._id}`);
                setShowDropPod(false);
                fetchData();
            } catch (error) {
                console.error("Error accepting mission");
                setShowDropPod(false);
            }
        }, 4000);
    };

    const completeMission = async () => {
        try {
            await axios.post(`/api/gamification/complete-mission/${mission._id}`);
            fetchData();
        } catch (error) {
            console.error("Error completing mission");
        }
    };

    // HUD Circle Component
    const HUDCircle = ({ percent, color, label, icon }) => (
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#222" strokeWidth="8" />
                <motion.circle 
                    cx="60" cy="60" r="54" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="8" 
                    strokeDasharray="339.29"
                    initial={{ strokeDashoffset: 339.29 }}
                    animate={{ strokeDashoffset: 339.29 - (339.29 * percent) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ color: color, fontSize: '24px' }}>{icon}</div>
                <div style={{ fontSize: '10px', color: '#666', fontWeight: '900', letterSpacing: '1px' }}>{label}</div>
            </div>
        </div>
    );

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>INITIALIZING HUD...</div>;

    return (
        <div style={{ backgroundColor: 'rgba(5, 5, 5, 0.95)', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif", backdropFilter: 'blur(10px)' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: ${hudColor}; text-shadow: 0 0 10px ${hudColor}66; }
                .hud-border { border: 1px solid ${hudColor}33; background: rgba(10, 10, 10, 0.6); backdrop-filter: blur(10px); }
                .scanline {
                    position: absolute; width: 100%; height: 2px; background: ${hudColor}1a;
                    top: 0; animation: scan 4s linear infinite; pointer-events: none;
                }
                .red-alert-pulse {
                    animation: red-pulse 1s infinite alternate;
                }
                @keyframes red-pulse {
                    from { box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); border-color: rgba(255, 0, 0, 0.3); }
                    to { box-shadow: 0 0 40px rgba(255, 0, 0, 0.6); border-color: #ff0000; }
                }
                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            `}</style>

            <AnimatePresence>
                {isRedAlert && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: '10px solid #ff0000', pointerEvents: 'none', zIndex: 999, animation: 'red-pulse 1s infinite alternate' }}
                    />
                )}
                {showDropPod && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                    >
                        <motion.div 
                            initial={{ y: -1000, rotate: 10 }}
                            animate={{ y: 0, rotate: 0 }}
                            transition={{ duration: 1.5, type: 'spring', damping: 10 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ width: '4px', height: '100vh', background: 'linear-gradient(to bottom, transparent, #39ff14)', position: 'absolute', top: '-100vh', left: '50%', transform: 'translateX(-50%)' }} />
                            <FaShieldAlt style={{ fontSize: '100px', color: hudColor, filter: 'drop-shadow(0 0 20px #39ff14)' }} />
                            <h2 className="font-display" style={{ fontSize: '40px', marginTop: '20px', color: hudColor }}>ATMOSPHERIC RE-ENTRY</h2>
                            <p style={{ color: '#666', letterSpacing: '4px', fontWeight: '900' }}>DEPLOING MISSION DATA...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top HUD Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', padding: '20px', borderBottom: '2px solid #111' }}>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
                    <DNASequence color={hudColor} />
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display" style={{ fontSize: '14px', color: isRedAlert ? '#ff0000' : '#666', letterSpacing: '4px' }}>
                            SYSTEM STATUS: {isRedAlert ? 'CRITICAL - RED ALERT' : 'ACTIVE'}
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                            {getGreeting()}, <span className="text-neon">{authUser?.name?.toUpperCase()}</span>
                        </motion.h1>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="font-display" style={{ fontSize: '24px' }}>LEVEL <span className="text-neon" style={{ fontSize: '40px' }}>{stats.level}</span></div>
                    <div style={{ width: '250px', height: '6px', background: '#222', borderRadius: '3px', marginTop: '5px', position: 'relative' }}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.xp / (stats.level * 500)) * 100}%` }}
                            style={{ height: '100%', background: hudColor, borderRadius: '3px', boxShadow: `0 0 10px ${hudColor}` }}
                        />
                    </div>
                    <div style={{ fontSize: '10px', color: '#555', fontWeight: '900', marginTop: '5px', letterSpacing: '1px' }}>
                        XP: {stats.xp} / {stats.level * 500} TO NEXT CLEARANCE
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
                {/* Left Column: Analytics & Missions */}
                <div>
                    {/* HUD Stats Row */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        {[
                            { label: 'CALORIES', val: summary.totalCalories, color: isRedAlert ? '#ff0000' : '#ff4444', icon: <FaFire /> },
                            { label: 'DURATION', val: summary.workoutDuration, color: isRedAlert ? '#ff0000' : '#8950fc', icon: <FaClock /> },
                            { label: 'HYDRATION', val: summary.waterIntake, color: isRedAlert ? '#ff0000' : '#3699ff', icon: <FaTint /> },
                            { label: 'LOAD', val: summary.currentWeight, color: isRedAlert ? '#ff0000' : '#1bc5bd', icon: <FaWeight /> }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`hud-border ${isRedAlert ? 'red-alert-pulse' : ''}`}
                                style={{ flex: 1, padding: '25px', position: 'relative', overflow: 'hidden' }}
                            >
                                <div className="scanline" />
                                <div style={{ color: stat.color, fontSize: '20px', marginBottom: '10px' }}>{stat.icon}</div>
                                <div className="font-display" style={{ fontSize: '12px', color: '#666', letterSpacing: '2px' }}>{stat.label}</div>
                                <div className="font-display" style={{ fontSize: '36px' }}>{stat.val}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Grid: Body Map & Daily Mission */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {/* 3D Muscle Heatmap Placeholder */}
                        <div className={`hud-border ${isRedAlert ? 'red-alert-pulse' : ''}`} style={{ padding: '30px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 className="font-display" style={{ fontSize: '24px', margin: 0 }}>
                                    <FaBolt className="text-neon" style={{ marginRight: '10px' }} /> ANATOMICAL SCAN
                                </h3>
                                <button 
                                    onClick={() => setIsXrayMode(!isXrayMode)}
                                    style={{ background: isXrayMode ? hudColor : 'transparent', border: `1px solid ${hudColor}`, color: isXrayMode ? 'black' : hudColor, padding: '5px 15px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                >
                                    {isXrayMode ? 'EXIT X-RAY' : 'INITIATE X-RAY'}
                                </button>
                            </div>
                            <div className="scanline" />
                            {/* Simple SVG Body Map */}
                            <svg viewBox="0 0 200 400" width="180" style={{ opacity: 0.8 }}>
                                <g filter={isXrayMode ? "grayscale(100%) brightness(200%)" : "none"}>
                                    <path d="M100 20 L120 40 L120 80 L100 100 L80 80 L80 40 Z" fill={stats.stats.strength > 15 ? hudColor : "#222"} stroke="#444" /> {/* Chest */}
                                    <circle cx="100" cy="30" r="15" fill="#222" stroke="#444" /> {/* Head */}
                                    <rect x="85" y="110" width="30" height="80" fill="#222" stroke="#444" /> {/* Abs */}
                                    <path d="M75 50 L40 100 L50 110 L80 60 Z" fill={stats.stats.endurance > 15 ? hudColor : "#222"} stroke="#444" /> {/* Arm L */}
                                    <path d="M125 50 L160 100 L150 110 L120 60 Z" fill={stats.stats.endurance > 15 ? hudColor : "#222"} stroke="#444" /> {/* Arm R */}
                                    <rect x="85" y="200" width="12" height="150" fill={stats.stats.agility > 15 ? hudColor : "#222"} stroke="#444" /> {/* Leg L */}
                                    <rect x="103" y="200" width="12" height="150" fill={stats.stats.agility > 15 ? hudColor : "#222"} stroke="#444" /> {/* Leg R */}
                                </g>
                                {isXrayMode && (
                                    <g stroke={hudColor} strokeWidth="1" fill="none" opacity="0.5">
                                        <path d="M100 20 L100 350" strokeDasharray="5 5" />
                                        <rect x="90" y="50" width="20" height="150" rx="10" />
                                        <rect x="95" y="200" width="10" height="150" rx="5" />
                                    </g>
                                )}
                            </svg>
                            <div style={{ marginTop: '20px', fontSize: '10px', color: '#666', fontWeight: '800', letterSpacing: '2px' }}>
                                STATUS: {isXrayMode ? 'X-RAY SCAN ACTIVE' : 'THERMAL SCAN ACTIVE'}
                            </div>
                        </div>

                        {/* Daily Mission */}
                        <div className={`hud-border ${isRedAlert ? 'red-alert-pulse' : ''}`} style={{ padding: '30px', position: 'relative' }}>
                            <div className="scanline" />
                            <h3 className="font-display" style={{ fontSize: '24px', marginBottom: '25px' }}>
                                <FaCrosshairs style={{ color: isRedAlert ? '#ff0000' : '#ff4444', marginRight: '10px' }} /> MISSION DEPLOYMENT
                            </h3>
                            {mission && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div style={{ backgroundColor: '#111', padding: '20px', borderLeft: `4px solid ${hudColor}`, marginBottom: '20px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: '#333', fontWeight: '900' }}>GHOST_SYNC: ACTIVE</div>
                                        <div className="font-display text-neon" style={{ fontSize: '24px' }}>{mission.title}</div>
                                        <p style={{ fontSize: '13px', color: '#888', margin: '5px 0' }}>{mission.description}</p>
                                        <div style={{ fontSize: '11px', fontWeight: '900', color: '#444' }}>REWARD: {mission.xpReward} XP</div>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        {mission.exercises.map((ex, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a', fontSize: '13px' }}>
                                                <span style={{ fontWeight: '700' }}>{ex.name}</span>
                                                <span className="text-neon">{ex.sets}x{ex.reps} {ex.duration}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {mission.status === 'Pending' ? (
                                        <button onClick={acceptMission} style={{ width: '100%', padding: '15px', background: hudColor, color: 'black', border: 'none', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer' }}>
                                            ACCEPT MISSION
                                        </button>
                                    ) : mission.status === 'Accepted' ? (
                                        <button onClick={completeMission} style={{ width: '100%', padding: '15px', background: 'transparent', color: hudColor, border: `2px solid ${hudColor}`, fontWeight: '900', letterSpacing: '2px', cursor: 'pointer' }}>
                                            MARK AS COMPLETED
                                        </button>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '15px', background: `${hudColor}1a`, color: hudColor, fontWeight: '900' }}>
                                            MISSION ACCOMPLISHED
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Biometrics & Achievements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Biometric Rings */}
                    <div className={`hud-border ${isRedAlert ? 'red-alert-pulse' : ''}`} style={{ padding: '30px', textAlign: 'center' }}>
                        <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '30px', textAlign: 'left' }}>BIOMETRICS</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            <HUDCircle percent={stats.stats.strength * 4} color={isRedAlert ? '#ff0000' : '#ff4444'} label="STR" icon={<FaDumbbell />} />
                            <HUDCircle percent={stats.stats.endurance * 4} color={isRedAlert ? '#ff0000' : '#3699ff'} label="END" icon={<FaBolt />} />
                            <HUDCircle percent={stats.stats.agility * 4} color={isRedAlert ? '#ff0000' : hudColor} label="AGI" icon={<FaSkull />} />
                            <HUDCircle percent={stats.stats.recovery * 4} color={isRedAlert ? '#ff0000' : '#8950fc'} label="REC" icon={<FaShieldAlt />} />
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className={`hud-border ${isRedAlert ? 'red-alert-pulse' : ''}`} style={{ padding: '30px', flex: 1 }}>
                        <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '20px' }}>ACHIEVEMENTS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {stats.achievements.length === 0 ? (
                                <div style={{ color: '#444', fontSize: '13px' }}>No tactical medals earned yet. Keep grinding.</div>
                            ) : (
                                stats.achievements.map((ach, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ x: 20, opacity: 0 }} 
                                        animate={{ x: 0, opacity: 1 }} 
                                        transition={{ delay: i * 0.1 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#111', padding: '15px', borderRadius: '8px' }}
                                    >
                                        <div style={{ color: hudColor, fontSize: '20px' }}><FaCrown /></div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '13px' }}>{ach.title}</div>
                                            <div style={{ fontSize: '10px', color: '#555' }}>{new Date(ach.awardedAt).toLocaleDateString()}</div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
