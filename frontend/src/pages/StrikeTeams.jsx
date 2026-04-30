import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaUserShield, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const StrikeTeams = () => {
    const [teams, setTeams] = useState([]);
    const [myTeam, setMyTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', motto: '' });

    const fetchData = async () => {
        try {
            const [teamsRes, myTeamRes] = await Promise.allSettled([
                axios.get('/api/strike-teams'),
                axios.get('/api/strike-teams/my-team')
            ]);
            
            if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data);
            if (myTeamRes.status === 'fulfilled') setMyTeam(myTeamRes.value.data);
            else setMyTeam(null);
            
        } catch (error) {
            console.error("Error fetching teams");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/strike-teams', formData);
            toast.success('Strike Team Commissioned');
            setShowCreateModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Creation Failed');
        }
    };

    const handleJoin = async (id) => {
        try {
            await axios.post(`/api/strike-teams/join/${id}`);
            toast.success('Team Joined');
            fetchData();
        } catch (error) {
            toast.error('Failed to join team');
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>ESTABLISHING COMMS...</div>;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .team-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 30px; position: relative; overflow: hidden; transition: all 0.3s; }
                .team-card:hover { border-color: #39ff14; transform: scale(1.02); }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        STRIKE <span className="text-neon">TEAMS</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>GLOBAL SOCIAL OPERATIVES</p>
                </div>
                {!myTeam && (
                    <button onClick={() => setShowCreateModal(true)} style={{ background: '#39ff14', color: 'black', border: 'none', padding: '12px 25px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaPlus /> FORM NEW TEAM
                    </button>
                )}
            </header>

            {myTeam && (
                <section style={{ marginBottom: '60px' }}>
                    <h2 className="font-display" style={{ fontSize: '32px', marginBottom: '25px', color: '#39ff14' }}>MY UNIT: {myTeam.name}</h2>
                    <div className="team-card" style={{ background: 'rgba(57, 255, 20, 0.05)', border: '1px solid #39ff14' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', textAlign: 'center' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', fontWeight: '800', letterSpacing: '2px' }}>TEAM LEVEL</div>
                                <div className="font-display" style={{ fontSize: '40px' }}>{myTeam.level}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', fontWeight: '800', letterSpacing: '2px' }}>TOTAL TEAM XP</div>
                                <div className="font-display text-neon" style={{ fontSize: '40px' }}>{myTeam.teamXP}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', fontWeight: '800', letterSpacing: '2px' }}>OPERATIVES</div>
                                <div className="font-display" style={{ fontSize: '40px' }}>{myTeam.members.length}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '20px' }}>OPERATIVE ROSTER</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {myTeam.members.map(member => (
                                    <div key={member._id} style={{ background: '#0a0a0a', padding: '10px 20px', borderRadius: '40px', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '10px', height: '10px', background: '#39ff14', borderRadius: '50%', boxShadow: '0 0 10px #39ff14' }}></div>
                                        <span style={{ fontSize: '14px', fontWeight: '700' }}>{member.name}</span>
                                        <span style={{ fontSize: '10px', color: '#555' }}>LVL {member.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <h2 className="font-display" style={{ fontSize: '32px', marginBottom: '25px' }}>ACTIVE UNITS IN FIELD</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                {teams.filter(t => t._id !== myTeam?._id).map((team) => (
                    <div key={team._id} className="team-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 className="font-display" style={{ fontSize: '24px', margin: 0 }}>{team.name}</h3>
                                <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>"{team.motto}"</p>
                            </div>
                            <div className="font-display text-neon" style={{ fontSize: '20px' }}>LVL {team.level}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#888' }}>
                                <FaUsers /> {team.members.length} Members
                            </div>
                            <button 
                                onClick={() => handleJoin(team._id)}
                                style={{ background: 'transparent', border: '1px solid #39ff14', color: '#39ff14', padding: '8px 20px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}
                            >
                                REQUEST ENLISTMENT
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#111', border: '1px solid #39ff14', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
                        <h2 className="font-display text-neon" style={{ fontSize: '30px', marginBottom: '30px' }}>COMMISSION UNIT</h2>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>UNIT NAME</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} required />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>UNIT MOTTO</label>
                                <input type="text" value={formData.motto} onChange={(e) => setFormData({...formData, motto: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #444', color: '#444', fontWeight: '900', cursor: 'pointer' }}>ABORT</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', background: '#39ff14', border: 'none', color: 'black', fontWeight: '900', cursor: 'pointer' }}>COMMISSION</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StrikeTeams;
