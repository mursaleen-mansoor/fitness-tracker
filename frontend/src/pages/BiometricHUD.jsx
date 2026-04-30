import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaBed, FaHeartbeat, FaBrain, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BiometricHUD = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLogModal, setShowLogModal] = useState(false);
    const [formData, setFormData] = useState({
        sleepHours: '',
        stressLevel: 5,
        restingHeartRate: ''
    });

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/biometrics');
            setHistory(data.reverse()); // Chronological order for chart
        } catch (error) {
            console.error("Error fetching biometrics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/biometrics', formData);
            toast.success('Biometric Log Updated');
            setShowLogModal(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to log data');
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>CALIBRATING SENSORS...</div>;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .hud-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 30px; position: relative; overflow: hidden; }
                .scan-line { position: absolute; width: 100%; height: 1px; background: rgba(57,255,20,0.1); top: 0; animation: scan 4s linear infinite; }
                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        BIOMETRIC <span className="text-neon">HUD</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>REAL-TIME PHYSIOLOGICAL DATA</p>
                </div>
                <button onClick={() => setShowLogModal(true)} style={{ background: '#39ff14', color: 'black', border: 'none', padding: '12px 25px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPlus /> LOG VITALS
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Recovery Score Chart */}
                <div className="hud-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="scan-line" />
                    <h3 className="font-display" style={{ fontSize: '24px', marginBottom: '30px' }}>RECOVERY EVOLUTION</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()} stroke="#444" />
                                <YAxis stroke="#444" />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #39ff14' }} />
                                <Area type="monotone" dataKey="recoveryScore" stroke="#39ff14" fillOpacity={1} fill="url(#colorRec)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sleep History */}
                <div className="hud-card">
                    <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBed className="text-neon" /> SLEEP ANALYSIS
                    </h3>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="date" hide />
                                <YAxis stroke="#444" />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #3699ff' }} />
                                <Line type="monotone" dataKey="sleepHours" stroke="#3699ff" strokeWidth={3} dot={{ fill: '#3699ff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heart Rate & Stress */}
                <div className="hud-card">
                    <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHeartbeat style={{ color: '#ff4444' }} /> HEART RATE & STRESS
                    </h3>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="date" hide />
                                <YAxis stroke="#444" />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #ff4444' }} />
                                <Line type="monotone" dataKey="restingHeartRate" stroke="#ff4444" strokeWidth={2} />
                                <Line type="monotone" dataKey="stressLevel" stroke="#aa3bff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '12px', fontWeight: '700' }}>
                        <span style={{ color: '#ff4444' }}>● BPM</span>
                        <span style={{ color: '#aa3bff' }}>● STRESS</span>
                    </div>
                </div>
            </div>

            {/* Log Modal */}
            {showLogModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#111', border: '1px solid #39ff14', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
                        <h2 className="font-display text-neon" style={{ fontSize: '30px', marginBottom: '30px' }}>LOG VITALS</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>SLEEP DURATION (HOURS)</label>
                                <input type="number" step="0.5" value={formData.sleepHours} onChange={(e) => setFormData({...formData, sleepHours: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} required />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>STRESS LEVEL (1-10)</label>
                                <input type="range" min="1" max="10" value={formData.stressLevel} onChange={(e) => setFormData({...formData, stressLevel: e.target.value})} style={{ width: '100%', accentColor: '#39ff14' }} />
                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#39ff14' }}>{formData.stressLevel} / 10</div>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>RESTING HEART RATE (BPM)</label>
                                <input type="number" value={formData.restingHeartRate} onChange={(e) => setFormData({...formData, restingHeartRate: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setShowLogModal(false)} style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #444', color: '#444', fontWeight: '900', cursor: 'pointer' }}>CANCEL</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', background: '#39ff14', border: 'none', color: 'black', fontWeight: '900', cursor: 'pointer' }}>UPLOAD</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default BiometricHUD;
