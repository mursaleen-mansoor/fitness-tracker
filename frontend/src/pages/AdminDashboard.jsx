import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaUsers, FaUserClock, FaTicketAlt, FaClock, 
    FaStar, FaBook, FaArrowUp, FaArrowDown, FaChartLine 
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const getGreeting = () => {
    const hour = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Karachi"})).getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
};

const AdminDashboard = () => {
    const { isDarkMode } = useTheme();
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    axios.get('/api/admin/stats/overview'),
                    axios.get('/api/admin/stats/analytics')
                ]);
                setStats(statsRes.data);
                setAnalytics(analyticsRes.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                toast.error('Failed to load system metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#8950fc' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '2px' }}>INITIALIZING SYSTEM OVERVIEW...</div>
        </div>
    );

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: '#3699ff', bg: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff' },
        { title: 'Active Today', value: stats?.activeToday || 0, icon: <FaUserClock />, color: '#1bc5bd', bg: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5' },
        { title: 'Open Tickets', value: stats?.openTickets || 0, icon: <FaTicketAlt />, color: '#8950fc', bg: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff' },
        { title: 'Overdue', value: stats?.overdueTickets || 0, icon: <FaClock />, color: '#f64e60', bg: isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5' },
        { title: 'Avg CSAT', value: stats?.avgCSAT || 0, unit: '/ 5.0', icon: <FaStar />, color: '#ffa800', bg: isDarkMode ? 'rgba(255, 168, 0, 0.15)' : '#fff4de' },
        { title: 'Articles', value: stats?.totalArticles || 0, icon: <FaBook />, color: '#00c3ed', bg: isDarkMode ? 'rgba(0, 195, 237, 0.15)' : '#e1f9ff' }
    ];

    const COLORS = ['#8950fc', '#1bc5bd', '#3699ff', '#ffa800', '#f64e60'];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '45px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>{getGreeting()}, Admin</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '500' }}>Real-time analytical dashboard for platform governance</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '45px' }}>
                {statCards.map((card, index) => (
                    <div key={index} style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '35px', 
                        borderRadius: '28px', 
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    >
                        <div style={{ 
                            width: '55px', 
                            height: '55px', 
                            borderRadius: '16px', 
                            backgroundColor: card.bg, 
                            color: card.color, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '24px',
                            marginBottom: '25px',
                            boxShadow: `0 8px 20px ${card.color}20`
                        }}>
                            {card.icon}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>{card.title}</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            {card.value}
                            {card.unit && <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>{card.unit}</span>}
                        </div>
                        
                        {/* Subtle background decoration */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '-20px', 
                            right: '-20px', 
                            fontSize: '100px', 
                            opacity: 0.03, 
                            color: card.color,
                            transform: 'rotate(-15deg)'
                        }}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '35px', marginBottom: '45px' }}>
                {/* User Growth Chart */}
                <div style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    padding: '40px', 
                    borderRadius: '32px', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>User Growth Matrix</h3>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Monthly registration analytics</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#1bc5bd', backgroundColor: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5', padding: '8px 16px', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaArrowUp /> 12.5% Growth
                            </span>
                        </div>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.userGrowth || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8950fc" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#8950fc" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2b2b40' : '#f3f6f9'} />
                                <XAxis 
                                    dataKey="_id" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}} 
                                    dy={15}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}} 
                                    dx={-10}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-card)', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--border-color)', 
                                        boxShadow: 'var(--shadow-lg)',
                                        padding: '15px'
                                    }}
                                    itemStyle={{ fontWeight: '800', color: 'var(--text-primary)' }}
                                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '700' }}
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

                {/* Distribution Chart */}
                <div style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    padding: '40px', 
                    borderRadius: '32px', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', 
                    flexDirection: 'column' 
                }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>Traffic Allocation</h3>
                    <p style={{ margin: '0 0 40px 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Ticket status distribution</p>
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={analytics?.resolutionRate || []}
                                    innerRadius={80}
                                    outerRadius={105}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                    animationBegin={500}
                                    animationDuration={1500}
                                >
                                    {analytics?.resolutionRate?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-card)', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--border-color)', 
                                        boxShadow: 'var(--shadow-lg)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                        {analytics?.resolutionRate?.map((entry, index) => (
                            <div key={index} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                padding: '12px 15px',
                                backgroundColor: 'var(--bg-main)',
                                borderRadius: '14px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}40` }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{entry._id}</span>
                                    <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>{entry.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
