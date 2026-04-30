import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaCalendarAlt, FaDownload, FaChartLine, FaChartBar, 
    FaChartPie, FaFilter, FaRedo, FaBrain, FaRocket, FaShieldAlt
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, 
    LineChart, Line 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const AdminAnalytics = () => {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ 
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        endDate: new Date().toISOString().split('T')[0] 
    });

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/admin/stats/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
            setData(data);
        } catch (error) {
            toast.error('Strategic intelligence retrieval failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const themeColors = {
        grid: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f3f6f9',
        text: isDarkMode ? '#a1a5b7' : '#b5b5c3',
        tooltipBg: isDarkMode ? '#1e1e2d' : '#ffffff',
        tooltipBorder: isDarkMode ? '#2b2b40' : '#f3f6f9',
        cardBg: 'var(--bg-card)',
        border: 'var(--border-color)'
    };

    if (loading && !data) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', color: '#8950fc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="analytics-pulse" style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px' }}>SYNCHRONIZING GLOBAL INTELLIGENCE...</div>
            </div>
        </div>
    );

    const COLORS = ['#8950fc', '#3699ff', '#1bc5bd', '#ffa800', '#f64e60'];

    return (
        <div style={{ animation: 'analyticsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1px' }}>Global Intelligence Matrix</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '600' }}>Strategic real-time insights across user growth, operational performance and system engagement</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '12px 25px', 
                        borderRadius: '16px', 
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <FaCalendarAlt color="#8950fc" />
                        <input 
                            type="date" 
                            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontWeight: '800', fontSize: '13px' }}
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                        />
                        <span style={{ color: 'var(--text-muted)', fontWeight: '900', fontSize: '10px' }}>TO</span>
                        <input 
                            type="date" 
                            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontWeight: '800', fontSize: '13px' }}
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                        />
                        <button onClick={fetchAnalytics} style={{ border: 'none', background: '#8950fc', color: '#fff', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}><FaRedo size={12}/></button>
                    </div>
                    <button style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', border: 'none', padding: '12px 30px', borderRadius: '16px', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: 'var(--shadow-lg)', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <FaDownload /> GENERATE EXECUTIVE REPORT
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '35px' }}>
                {/* 1. User Growth */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaRocket color="#8950fc"/> USER EXPANSION</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cumulative Growth Velocity</p>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.userGrowth || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8950fc" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8950fc" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}`, boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)' }}
                                    itemStyle={{ fontWeight: '800' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#8950fc" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. DAU Intelligence */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaBrain color="#1bc5bd"/> OPERATIONAL ENGAGEMENT</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Active Node Analysis (DAU)</p>
                    </div>
                    <div style={{ height: '300px', marginTop: '30px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.dau || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}`, boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#1bc5bd" strokeWidth={4} dot={{ r: 6, fill: '#1bc5bd', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Feature Distribution */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaChartBar color="#ffa800"/> FEATURE SUPREMACY</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.featureUsage?.labels?.map((l, i) => ({ name: l, value: data.featureUsage.data[i] })) || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} />
                                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f3f6f9'}} contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}` }} />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                                    {data?.featureUsage.labels.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Support Topology */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaShieldAlt color="#f64e60"/> OPERATIONAL TOPOLOGY</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.commonComplaints || []}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                    stroke="none"
                                >
                                    {data?.commonComplaints?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}` }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Satisfaction Matrix */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaChartLine color="#ffa800"/> SATISFACTION INDEX (CSAT)</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.csatTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} dy={10} />
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} />
                                <Tooltip contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}` }} />
                                <Line type="monotone" dataKey="avg" stroke="#ffa800" strokeWidth={4} dot={{ r: 8, fill: '#ffa800', strokeWidth: 3, stroke: 'var(--bg-card)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 6. Cross-Correlation */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}><FaChartBar color="#3699ff"/> CROSS-FEATURE CORRELATION</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data?.engagement?.labels?.map((l, i) => ({ name: l, value: data.engagement.data[i] })) || []}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={themeColors.grid} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '700'}} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: themeColors.text, fontSize: 11, fontWeight: '800'}} width={120} />
                                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f3f6f9'}} contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '15px', border: `1px solid ${themeColors.tooltipBorder}` }} />
                                <Bar dataKey="value" fill="#3699ff" radius={[0, 15, 15, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes analyticsFadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .analytics-pulse {
                    animation: pulseAnalytics 2s infinite;
                }
                @keyframes pulseAnalytics {
                    0% { opacity: 0.5; filter: blur(1px); }
                    50% { opacity: 1; filter: blur(0); }
                    100% { opacity: 0.5; filter: blur(1px); }
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: ${isDarkMode ? 'invert(1)' : 'none'};
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default AdminAnalytics;
