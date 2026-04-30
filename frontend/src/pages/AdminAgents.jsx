import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaUserTie, FaCheckCircle, FaClock, FaStar, 
    FaBan, FaChevronRight, FaChartBar, FaTicketAlt, 
    FaLevelUpAlt, FaEnvelope, FaShieldAlt, FaTerminal,
    FaBolt, FaUserShield
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminAgents = () => {
    const { isDarkMode } = useTheme();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAgents = async () => {
        try {
            const { data } = await axios.get('/api/admin/stats/support-team');
            setAgents(data);
        } catch (error) {
            toast.error('OPERATIONAL DATA RETRIEVAL FAILED');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const toggleAgentStatus = async (id, status) => {
        try {
            await axios.put(`/api/admin/users/${id}`, { status });
            toast.success(`AGENT UNIT ${status.toUpperCase()} SUCCESSFULLY`);
            fetchAgents();
        } catch (error) {
            toast.error('STATE TRANSITION FAILURE');
        }
    };

    const getProfilePic = (pic) => {
        if (!pic || pic === 'default-avatar.png') return null;
        if (pic.startsWith('http')) return pic;
        return `http://localhost:5000${pic.startsWith('/') ? '' : '/'}${pic}`;
    };

    return (
        <div style={{ animation: 'agentsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1.5px' }}>Command Personnel Matrix</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '12px 0 0 0', fontSize: '17px', fontWeight: '600' }}>Manage strategic support operatives and tactical operational throughput</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1bc5bd', animation: 'agentPulse 2s infinite' }}></div>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '35px' }}>
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} style={{ height: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', opacity: 0.5, animation: 'agentPulse 1.5s infinite' }}></div>
                    ))
                ) : agents.map((agent) => (
                    <div key={agent._id} style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '40px', 
                        borderRadius: '32px', 
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        overflow: 'hidden'
                    }}
                    className="agent-card"
                    >
                        <div style={{ 
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            padding: '8px 16px', 
                            borderRadius: '12px', 
                            fontSize: '10px', 
                            fontWeight: '900', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            backgroundColor: agent.status === 'active' ? (isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5') : (isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5'),
                            color: agent.status === 'active' ? '#1bc5bd' : '#f64e60',
                            border: `1px solid ${agent.status === 'active' ? 'rgba(27, 197, 189, 0.2)' : 'rgba(246, 78, 96, 0.2)'}`,
                            zIndex: 2
                        }}>
                            {agent.status}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '35px' }}>
                            <div style={{ 
                                width: '85px', 
                                height: '85px', 
                                borderRadius: '28px', 
                                backgroundColor: 'var(--bg-main)', 
                                overflow: 'hidden', 
                                border: '4px solid var(--bg-card)', 
                                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                                flexShrink: 0,
                                position: 'relative'
                            }}>
                                {getProfilePic(agent.profilePicture) ? (
                                    <img src={getProfilePic(agent.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: '900', fontSize: '32px' }}>{agent.name[0]}</div>
                                )}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', letterSpacing: '-0.5px' }}>{agent.name}</h3>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <FaEnvelope size={12} color="#8950fc" /> {agent.email}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }} className="metric-box">
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>WORKLOAD</div>
                                <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    {agent.assignedThisWeek} <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>UNITS</span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }} className="metric-box">
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>THROUGHPUT</div>
                                <div style={{ fontSize: '26px', fontWeight: '900', color: '#1bc5bd', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    {agent.resolvedThisWeek} <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>DONE</span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }} className="metric-box">
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>TRUST INDEX</div>
                                <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffa800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaStar size={18} /> {agent.csatScore}
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }} className="metric-box">
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>LATENCY</div>
                                <div style={{ fontSize: '26px', fontWeight: '900', color: '#8950fc' }}>{agent.avgResponseTime}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            {agent.status === 'active' ? (
                                <button 
                                    onClick={() => toggleAgentStatus(agent._id, 'deactivated')} 
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? 'rgba(246, 78, 96, 0.1)' : '#ffe2e5', color: '#f64e60', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f64e60'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(246, 78, 96, 0.1)' : '#ffe2e5'}
                                    onMouseDown={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(0.95)'; }}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <FaBan size={14} /> DEACTIVATE
                                </button>
                            ) : (
                                <button 
                                    onClick={() => toggleAgentStatus(agent._id, 'active')} 
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? 'rgba(27, 197, 189, 0.1)' : '#c9f7f5', color: '#1bc5bd', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#1bc5bd'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(27, 197, 189, 0.1)' : '#c9f7f5'}
                                    onMouseDown={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(0.95)'; }}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <FaCheckCircle size={14} /> REACTIVATE
                                </button>
                            )}
                            <button style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: 'var(--shadow-lg)', transition: 'all 0.3s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                onMouseDown={e => e.currentTarget.style.transform = 'translateY(0) scale(0.95)'}
                            >
                                <FaTerminal size={14} /> OPERATIONAL VIEW
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes agentsFadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes agentPulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
                .agent-card:hover {
                    transform: translateY(-12px) scale(1.02) !important;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.15) !important;
                    border-color: #8950fc !important;
                }
                .agent-card:hover .metric-box {
                    background-color: var(--bg-card) !important;
                    border-color: var(--border-color) !important;
                }
            `}</style>
        </div>
    );
};

export default AdminAgents;
