import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';
import FloatingScrollToTop from './FloatingScrollToTop';
import { 
    FaChartPie, FaUsers, FaUserTie, FaTicketAlt, 
    FaChartBar, FaBook, FaBullhorn, FaHistory, 
    FaCog, FaSignOutAlt, FaUser, FaBars, FaSun, FaMoon, FaKey 
} from 'react-icons/fa';

const AdminLayout = ({ children, subtitle = "Here's your system overview." }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    // Profile Dropdown State
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const profilePicUrl = user?.profilePicture && user.profilePicture !== 'default-avatar.png'
        ? `http://localhost:5000${user.profilePicture}`
        : `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=8950fc&color=fff&size=40`;

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Overview' },
        { path: '/admin/access-requests', icon: <FaKey />, label: 'Access Requests' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/agents', icon: <FaUserTie />, label: 'Support Team' },
        { path: '/admin/tickets', icon: <FaTicketAlt />, label: 'Master Queue' },
        { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
        { path: '/admin/knowledge-base', icon: <FaBook />, label: 'Knowledge Base' },
        { path: '/admin/broadcast', icon: <FaBullhorn />, label: 'Broadcast' },
        { path: '/admin/logs', icon: <FaHistory />, label: 'Audit Logs' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' }
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
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 1000,
                boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
            }}>
                {/* Logo Section */}
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
                        background: 'linear-gradient(135deg, #8950fc 0%, #6c32e1 100%)', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                        boxShadow: '0 5px 15px rgba(137, 80, 252, 0.4)'
                    }}>
                        <FaCog />
                    </div>
                    {!collapsed && <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '1px' }}>ADMIN<span style={{ color: '#8950fc' }}>PRO</span></span>}
                </div>

                {/* Navigation */}
                <div style={{ flex: 1, padding: '25px 0', overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '16px 25px', 
                                    color: isActive ? '#fff' : '#a2a3b7', 
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    backgroundColor: isActive ? 'rgba(137, 80, 252, 0.12)' : 'transparent',
                                    borderLeft: isActive ? '4px solid #8950fc' : '4px solid transparent',
                                    marginBottom: '4px'
                                }}
                            >
                                <span style={{ fontSize: '20px', marginRight: collapsed ? '0' : '18px', color: isActive ? '#8950fc' : 'inherit', display: 'flex' }}>{item.icon}</span>
                                {!collapsed && <span style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px' }}>{item.label}</span>}
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

                {/* Sign Out Button */}
                <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            width: '100%', 
                            padding: '14px', 
                            backgroundColor: '#f64e60', 
                            border: 'none', 
                            color: '#fff', 
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
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                marginLeft: collapsed ? '80px' : '280px', 
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}>
                {/* Top Header */}
                <header style={{ 
                    height: '80px', 
                    backgroundColor: 'var(--bg-header)', 
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px',
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

                    {/* Right Side: Theme Toggle & Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button 
                            onClick={toggleTheme}
                            style={{ 
                                background: 'var(--border-color)', 
                                border: 'none', 
                                color: isDarkMode ? '#ffa800' : '#8950fc', 
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
                                        <Link to="/admin/profile"
                                            onClick={() => setShowProfile(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', borderRadius: '12px', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaUser color="#8950fc" size={18} /> My Profile
                                        </Link>

                                        <Link to="/admin/settings"
                                            onClick={() => setShowProfile(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', borderRadius: '12px', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaCog color="#3699ff" size={18} /> Settings
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

export default AdminLayout;
