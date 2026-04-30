import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaChartPie, FaTicketAlt, FaBook, FaHistory, 
    FaFileAlt, FaSignOutAlt, FaBell, FaUser, FaCog, FaBars, FaSun, FaMoon, FaCheckDouble
} from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';
import FloatingScrollToTop from './FloatingScrollToTop';

const AgentLayout = ({ children, subtitle = "Here's your support overview." }) => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    
    // Notifications State
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);

    // Profile Dropdown State
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await axios.get('/api/notifications/unread-count');
            setUnreadCount(data.count);
        } catch (error) {}
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/notifications');
            setNotifications(data);
        } catch (error) {}
    };

    const handleBellClick = () => {
        const next = !showNotif;
        setShowNotif(next);
        setShowProfile(false);
        if (next) fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put('/api/notifications/mark-all-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {}
    };

    const handleMarkOne = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {}
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const profilePicUrl = user?.profilePicture && user.profilePicture !== 'default-avatar.png'
        ? `http://localhost:5000${user.profilePicture}`
        : `https://ui-avatars.com/api/?name=${user?.name || 'Agent'}&background=3699ff&color=fff&size=40`;

    const navItems = [
        { name: 'Dashboard', path: '/agent/dashboard', icon: <FaChartPie /> },
        { name: 'Tickets', path: '/agent/tickets', icon: <FaTicketAlt /> },
        { name: 'Knowledge Base', path: '/agent/knowledge-base', icon: <FaBook /> },
        { name: 'Performance', path: '/agent/performance', icon: <FaHistory /> },
        { name: 'Templates', path: '/agent/templates', icon: <FaFileAlt /> }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            {/* Sidebar */}
            <div style={{ 
                width: collapsed ? '80px' : '280px', 
                backgroundColor: 'var(--bg-sidebar)', 
                color: '#fff', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', 
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ 
                    padding: '30px 25px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: 'linear-gradient(135deg, #3699ff 0%, #00d2ff 100%)', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                        boxShadow: '0 5px 15px rgba(54, 153, 255, 0.4)'
                    }}>
                        <FaTicketAlt />
                    </div>
                    {!collapsed && <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '1px' }}>AGENT<span style={{ color: '#3699ff' }}>PRO</span></span>}
                </div>

                <div style={{ flex: 1, padding: '25px 0', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px 25px',
                                    color: isActive ? '#fff' : '#a2a3b7',
                                    textDecoration: 'none',
                                    backgroundColor: isActive ? 'rgba(54, 153, 255, 0.12)' : 'transparent',
                                    borderLeft: isActive ? '4px solid #3699ff' : '4px solid transparent',
                                    transition: 'all 0.3s ease',
                                    marginBottom: '4px'
                                }}
                            >
                                <span style={{ marginRight: collapsed ? '0' : '18px', fontSize: '20px', color: isActive ? '#3699ff' : 'inherit', display: 'flex' }}>{item.icon}</span>
                                {!collapsed && <span style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px' }}>{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* User Profile Card */}
                {!collapsed && (
                    <div style={{ padding: '0 20px', marginBottom: '10px' }}>
                        <div style={{ 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            padding: '15px', 
                            borderRadius: '18px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
                                <div style={{ fontSize: '11px', color: '#a2a3b7', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '500' }}>{user?.email}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#f64e60',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            gap: '15px',
                            fontWeight: '700',
                            boxShadow: '0 5px 15px rgba(246, 78, 96, 0.2)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <FaSignOutAlt />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                flex: 1, 
                marginLeft: collapsed ? '80px' : '280px',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Navbar */}
                <header style={{ 
                    height: '80px', 
                    backgroundColor: 'var(--bg-header)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 30px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 999,
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    {/* Left Side: Hamburger & Greeting */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <button 
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ 
                                background: 'var(--border-color)', 
                                border: 'none', 
                                color: 'var(--text-primary)', 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '10px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                            }}
                        >
                            <FaBars />
                        </button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {getGreeting()}, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            style={{ 
                                background: 'var(--border-color)', 
                                border: 'none', 
                                color: isDarkMode ? '#ffa800' : '#3699ff', 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '10px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isDarkMode ? <FaSun /> : <FaMoon />}
                        </button>

                        {/* Notification Bell */}
                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <div onClick={handleBellClick} style={{ cursor: 'pointer', position: 'relative', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: showNotif ? 'var(--border-color)' : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaBell size={18} color={showNotif ? '#3699ff' : 'var(--text-secondary)'} />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#f64e60', color: 'white', fontSize: '10px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', padding: '0 2px', border: '2px solid var(--bg-header)' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>

                            {/* Notification Dropdown */}
                            {showNotif && (
                                <div style={{ position: 'absolute', top: '55px', right: '0', width: '380px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', animation: 'slideIn 0.2s ease-out' }}>
                                    <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>Notifications</h4>
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{unreadCount} unread messages</span>
                                        </div>
                                        <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#3699ff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
                                            <FaCheckDouble size={12} /> Mark all read
                                        </button>
                                    </div>

                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '50px 30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <FaBell size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                                                <p style={{ margin: 0, fontWeight: '600' }}>Your inbox is empty</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n._id}
                                                    onClick={() => handleMarkOne(n._id)}
                                                    style={{
                                                        padding: '18px 25px',
                                                        borderBottom: '1px solid var(--border-color)',
                                                        backgroundColor: n.isRead ? 'transparent' : 'rgba(54, 153, 255, 0.03)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        gap: '15px',
                                                        alignItems: 'flex-start',
                                                        transition: 'background 0.2s'
                                                    }}
                                                >
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3699ff', marginTop: '6px', flexShrink: 0, opacity: n.isRead ? 0.2 : 1 }}></div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: n.isRead ? '600' : '800', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.title}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: '1.4' }}>{n.message}</div>
                                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>{new Date(n.createdAt).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ width: '1px', height: '25px', backgroundColor: 'var(--border-color)' }}></div>

                        {/* Profile Dropdown */}
                        <div ref={profileRef} style={{ position: 'relative' }}>
                            <div 
                                onClick={() => setShowProfile(!showProfile)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '12px',
                                    backgroundColor: showProfile ? 'var(--border-color)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <img
                                    src={profilePicUrl}
                                    alt="Profile"
                                    style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--bg-header)', boxShadow: 'var(--shadow-sm)' }}
                                />
                            </div>

                            {/* Profile Dropdown Menu */}
                            {showProfile && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '60px', 
                                    right: '0', 
                                    width: '280px', 
                                    backgroundColor: 'var(--bg-card)', 
                                    borderRadius: '16px', 
                                    boxShadow: 'var(--shadow-lg)', 
                                    border: '1px solid var(--border-color)', 
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    animation: 'slideIn 0.2s ease-out'
                                }}>
                                    {/* User Header */}
                                    <div style={{ padding: '25px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img
                                            src={profilePicUrl}
                                            alt="Profile"
                                            style={{ width: '55px', height: '55px', borderRadius: '15px', objectFit: 'cover' }}
                                        />
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginTop: '2px' }}>{user?.email}</div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '12px' }}>
                                        <Link to="/agent/profile"
                                            onClick={() => setShowProfile(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', borderRadius: '12px', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaUser color="#3699ff" size={18} /> My Profile
                                        </Link>

                                        <Link to="/agent/profile"
                                            onClick={() => setShowProfile(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', borderRadius: '12px', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaCog color="#8950fc" size={18} /> Settings
                                        </Link>

                                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>

                                        <button 
                                            onClick={handleLogout}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', color: '#f64e60', fontWeight: '700', fontSize: '14px', borderRadius: '12px', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffe2e5'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaSignOutAlt size={18} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ 
                    padding: '40px', 
                    flex: 1, 
                    opacity: 0.96,
                    transition: 'opacity 0.3s ease'
                }}>
                    {children}
                </main>
                <Footer />
                <FloatingScrollToTop />
            </div>
            
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AgentLayout;
