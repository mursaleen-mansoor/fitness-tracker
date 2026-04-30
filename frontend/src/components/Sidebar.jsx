import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaHome, FaDumbbell, FaUtensils, FaChartLine, FaBullseye, 
    FaTicketAlt, FaCog, FaFileAlt, FaSignOutAlt, FaTrophy, 
    FaMedal, FaUsers, FaCamera, FaHeartbeat, FaShieldAlt, 
    FaGlobeAmericas, FaBolt, FaChartPie, FaKey, FaUserTie, 
    FaChartBar, FaBook, FaBullhorn, FaHistory 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const getNavItems = () => {
        const role = user?.role;

        if (role === 'admin') {
            return [
                { name: 'Overview', path: '/admin/dashboard', icon: <FaChartPie /> },
                { name: 'Access Requests', path: '/admin/access-requests', icon: <FaKey /> },
                { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
                { name: 'Support Team', path: '/admin/agents', icon: <FaUserTie /> },
                { name: 'Master Queue', path: '/admin/tickets', icon: <FaTicketAlt /> },
                { name: 'Analytics', path: '/admin/analytics', icon: <FaChartBar /> },
                { name: 'Knowledge Base', path: '/admin/knowledge-base', icon: <FaBook /> },
                { name: 'Broadcast', path: '/admin/broadcast', icon: <FaBullhorn /> },
                { name: 'Audit Logs', path: '/admin/logs', icon: <FaHistory /> },
                { name: 'Settings', path: '/admin/settings', icon: <FaCog /> }
            ];
        }

        if (role === 'support_agent') {
            return [
                { name: 'Dashboard', path: '/agent/dashboard', icon: <FaChartPie /> },
                { name: 'Tickets', path: '/agent/tickets', icon: <FaTicketAlt /> },
                { name: 'Knowledge Base', path: '/agent/knowledge-base', icon: <FaBook /> },
                { name: 'Performance', path: '/agent/performance', icon: <FaHistory /> },
                { name: 'Templates', path: '/agent/templates', icon: <FaFileAlt /> },
                { name: 'Settings', path: '/agent/profile', icon: <FaCog /> }
            ];
        }

        // Default to user role items as requested
        return [
            { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
            { name: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> },
            { name: 'Achievements', path: '/achievements', icon: <FaMedal /> },
            { name: 'Armory', path: '/armory', icon: <FaShieldAlt /> },
            { name: 'Global Map', path: '/global-map', icon: <FaGlobeAmericas /> },
            { name: 'Fitness Hub', path: '/fitness-hub', icon: <FaBolt /> },
            { name: 'Exercise DB', path: '/exercises', icon: <FaDumbbell /> },
            { name: 'Strike Teams', path: '/strike-teams', icon: <FaUsers /> },
            { name: 'War Room', path: '/war-room', icon: <FaCamera /> },
            { name: 'Biometrics', path: '/biometrics', icon: <FaHeartbeat /> },
            { name: 'Workouts', path: '/workouts', icon: <FaDumbbell /> },
            { name: 'Nutrition', path: '/nutrition', icon: <FaUtensils /> },
            { name: 'Progress', path: '/progress', icon: <FaChartLine /> },
            { name: 'Goals', path: '/goals', icon: <FaBullseye /> },
            { name: 'Gallery', path: '/gallery', icon: <FaCamera /> },
            { name: 'Testimonials', path: '/testimonials', icon: <FaBook /> },
            { name: 'Support', path: '/support', icon: <FaTicketAlt /> },
            { name: 'Settings', path: '/settings', icon: <FaCog /> }
        ];
    };

    const navItems = getNavItems();

    const profilePicUrl = user?.profilePicture && user.profilePicture !== 'default-avatar.png'
        ? `http://localhost:5000${user.profilePicture}`
        : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=aa3bff&color=fff&size=40`;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ 
            width: collapsed ? '80px' : '280px', 
            backgroundColor: 'var(--bg-sidebar)', 
            color: '#fff', 
            height: '100vh', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
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
                    background: 'rgba(57, 255, 20, 0.1)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                    color: '#39ff14',
                    boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)'
                }}>
                    <FaFireAlt />
                </div>
                {!collapsed && <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '1px' }}>FIT<span style={{ color: '#39ff14' }}>TRACK</span> PRO</span>}
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: '25px 0', overflowY: 'auto' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
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
                                transition: 'all 0.2s',
                                backgroundColor: isActive ? 'rgba(170, 59, 255, 0.12)' : 'transparent',
                                borderLeft: isActive ? '4px solid #aa3bff' : '4px solid transparent',
                                marginBottom: '4px'
                            }}
                        >
                            <span style={{ fontSize: '20px', marginRight: collapsed ? '0' : '18px', color: isActive ? '#aa3bff' : 'inherit', display: 'flex' }}>{item.icon}</span>
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
    );
};

export default Sidebar;
