import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaTicketAlt, FaClock, FaExclamationTriangle, FaStar, 
    FaArrowRight, FaHistory, FaChartLine, FaCheckCircle,
    FaUsers, FaLifeRing, FaShieldAlt, FaBolt
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const getGreeting = () => {
    const hour = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Karachi"})).getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
};

const AgentDashboard = () => {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState({ 
        todayOpen: 0, 
        inProgress: 0, 
        overdue: 0, 
        avgCSAT: 0, 
        activities: [], 
        trend: [] 
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async (isFirstLoad = false) => {
        try {
            const { data } = await axios.get('/api/agent/stats');
            setData(data);
            if (isFirstLoad) toast.success('AGENT COMMAND CENTER ONLINE');
        } catch (error) {
            console.error('Error fetching agent stats:', error);
            toast.error('DATA SYNCHRONIZATION FAILURE');
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(true);
        const interval = setInterval(() => fetchStats(false), 60000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { title: 'New Units', value: data.todayOpen, icon: <FaBolt />, color: '#3699ff', bg: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff' },
        { title: 'In Progress', value: data.inProgress, icon: <FaClock />, color: '#8950fc', bg: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff' },
        { title: 'Overdue', value: data.overdue, icon: <FaExclamationTriangle />, color: '#f64e60', bg: isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5' },
        { title: 'Trust Index', value: data.avgCSAT, icon: <FaStar />, color: '#ffa800', bg: isDarkMode ? 'rgba(255, 168, 0, 0.15)' : '#fff4de', unit: '/ 5.0' }
    ];

    const getProfilePic = (pic) => {
        if (!pic || pic === 'default-avatar.png') return null;
        if (pic.startsWith('http')) return pic;
        return `http://localhost:5000${pic.startsWith('/') ? '' : '/'}${pic}`;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8950fc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="dashboard-pulse" style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px' }}>INITIALIZING COMMAND CENTER...</div>
            </div>
        </div>
    );

    return (
        <div style={{ animation: 'dashboardFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            {/* Header */}
            <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1.5px' }}>{getGreeting()}, Operative</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '12px 0 0 0', fontSize: '17px', fontWeight: '600' }}>Tactical oversight of support performance and real-time ticket flow</p>
                </div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px', 
                    backgroundColor: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5', 
                    padding: '12px 25px', 
                    borderRadius: '16px',
                    color: '#1bc5bd',
                    fontWeight: '900',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    border: '1px solid rgba(27, 197, 189, 0.2)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <FaShieldAlt /> SYSTEM ACTIVE
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '35px', marginBottom: '50px' }}>
                {statCards.map((card, idx) => (
                    <div key={idx} style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '40px', 
                        borderRadius: '32px', 
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '30px',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-12px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        e.currentTarget.style.borderColor = card.color;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                    >
                        <div style={{ 
                            width: '65px', 
                            height: '65px', 
                            borderRadius: '20px', 
                            backgroundColor: card.bg, 
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '26px',
                            boxShadow: `0 12px 25px ${card.color}25`,
                            zIndex: 1,
                            transition: 'all 0.3s'
                        }}>
                            {card.icon}
                        </div>
                        <div style={{ zIndex: 1 }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{card.title}</div>
                            <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '8px', letterSpacing: '-1px' }}>
                                {card.value}
                                {card.unit && <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '700' }}>{card.unit}</span>}
                            </div>
                        </div>
                        <div style={{ position: 'absolute', right: '-25px', bottom: '-25px', fontSize: '120px', opacity: 0.03, color: card.color, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '40px', alignItems: 'start' }}>
                
                {/* Chart Section */}
                <div style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    padding: '45px', 
                    borderRadius: '35px', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '52px', height: '52px', backgroundColor: 'var(--bg-main)', borderRadius: '16px', color: '#8950fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid var(--border-color)' }}><FaChartLine /></div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>Tactical Flow Analysis</h3>
                                <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Visualizing operational throughput trends</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#8950fc', fontWeight: '900', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', padding: '8px 18px', borderRadius: '12px', letterSpacing: '1px', border: '1px solid rgba(137, 80, 252, 0.2)' }}>7D METRICS</span>
                    </div>
                    
                    <div style={{ width: '100%', height: '380px', position: 'relative', zIndex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8950fc" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8950fc" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f6f9'} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 800 }}
                                    dy={15}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString([], { weekday: 'short' }).toUpperCase()}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 800 }} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: isDarkMode ? '#1e1e2d' : '#ffffff', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--border-color)', 
                                        boxShadow: 'var(--shadow-lg)',
                                        padding: '15px'
                                    }}
                                    itemStyle={{ fontWeight: '900', color: 'var(--text-primary)' }}
                                    labelStyle={{ fontWeight: '800', marginBottom: '8px', color: '#8950fc', textTransform: 'uppercase' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#8950fc" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Feed */}
                <div style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    padding: '45px', 
                    borderRadius: '35px', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)', 
                    maxHeight: '585px', 
                    display: 'flex', 
                    flexDirection: 'column' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '52px', height: '52px', backgroundColor: isDarkMode ? 'rgba(255, 168, 0, 0.15)' : '#fff4de', borderRadius: '16px', color: '#ffa800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid rgba(255, 168, 0, 0.1)' }}><FaHistory /></div>
                            <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>Intelligence Stream</h3>
                        </div>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '15px' }} className="custom-scrollbar">
                        {data.activities.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '80px 0', fontSize: '17px', fontWeight: '700' }}>NO ACTIVITY DETECTED</div>
                        ) : data.activities.map((act, idx) => (
                            <div key={idx} style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                marginBottom: '30px', 
                                paddingBottom: '25px', 
                                borderBottom: idx === data.activities.length - 1 ? 'none' : '1px solid var(--border-color)',
                                animation: `dashboardFadeIn 0.5s ease-out ${idx * 0.1}s both`
                            }}>
                                <div style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    borderRadius: '16px', 
                                    backgroundColor: 'var(--bg-main)', 
                                    overflow: 'hidden', 
                                    flexShrink: 0, 
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {getProfilePic(act.userId?.profilePicture) ? (
                                        <img src={getProfilePic(act.userId.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: '900', fontSize: '18px' }}>
                                            {act.userId?.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                                        <span style={{ fontWeight: '900', color: 'var(--text-primary)' }}>{act.userId?.name}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '6px' }}>{act.action}</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <span style={{ 
                                            width: '10px', 
                                            height: '10px', 
                                            borderRadius: '3px', 
                                            backgroundColor: act.type.includes('reply') ? '#8950fc' : act.type.includes('created') ? '#1bc5bd' : '#ffa800',
                                            boxShadow: `0 0 12px ${act.type.includes('reply') ? '#8950fc' : act.type.includes('created') ? '#1bc5bd' : '#ffa800'}50`
                                        }}></span>
                                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.type.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <style>{`
                @keyframes dashboardFadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dashboard-pulse {
                    animation: pulseDashboard 2s infinite;
                }
                @keyframes pulseDashboard {
                    0% { opacity: 0.5; filter: blur(1px); }
                    50% { opacity: 1; filter: blur(0); }
                    100% { opacity: 0.5; filter: blur(1px); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default AgentDashboard;
;
