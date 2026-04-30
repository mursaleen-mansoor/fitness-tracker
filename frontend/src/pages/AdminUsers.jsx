import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaSearch, FaFilter, FaUserEdit, FaTrashAlt, 
    FaShieldAlt, FaBan, FaCheckCircle, FaChevronRight, 
    FaTimes, FaDumbbell, FaUtensils, FaWeight, FaHistory, FaEnvelope, FaUser, FaPlus
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminUsers = () => {
    const { isDarkMode } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', username: '', email: '' });
    
    // Add User State
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', username: '', email: '', role: 'user' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`/api/admin/users?search=${search}&role=${roleFilter}&status=${statusFilter}`);
            setUsers(data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }, [search, roleFilter, statusFilter]);

    const handleUpdateUser = async (id, payload) => {
        try {
            await axios.put(`/api/admin/users/${id}`, payload);
            toast.success('User synchronized successfully');
            fetchUsers();
            if (showProfile) fetchUserProfile(id);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Synchronization failed');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/admin/users', addForm);
            toast.success('Subject Enlisted Successfully. Credentials sent via comm channels.');
            setShowAddModal(false);
            setAddForm({ name: '', username: '', email: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enlist subject');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY purge this user? All historical data will be lost.')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('User purged from systems');
            fetchUsers();
            setShowProfile(false);
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const fetchUserProfile = async (id) => {
        setProfileLoading(true);
        try {
            const { data } = await axios.get(`/api/admin/users/${id}`);
            setProfileData(data);
            setShowProfile(true);
        } catch (error) {
            toast.error('Failed to retrieve intelligence profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const getProfilePic = (pic) => {
        if (!pic || pic === 'default-avatar.png') return null;
        if (pic.startsWith('http')) return pic;
        return `http://localhost:5000${pic.startsWith('/') ? '' : '/'}${pic}`;
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1px' }}>System Directory</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '500' }}>Comprehensive management of all accounts and operational permissions</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    style={{ padding: '15px 25px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <FaPlus /> Enlist New Subject
                </button>
            </div>

            {/* Filters Bar */}
            <div style={{ 
                backgroundColor: 'var(--bg-card)', 
                padding: '30px', 
                borderRadius: '28px', 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '40px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', flex: 2, minWidth: '300px' }}>
                    <FaSearch style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '18px' }} />
                    <input 
                        type="text" 
                        placeholder="Search identity or digital footprint..." 
                        style={{ width: '100%', padding: '16px 20px 16px 55px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FaShieldAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8950fc', zIndex: 1 }} />
                        <select 
                            style={{ width: '100%', padding: '16px 16px 16px 40px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontWeight: '700', appearance: 'none', cursor: 'pointer' }}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Role Tiers</option>
                            <option value="user">Operational User</option>
                            <option value="support_agent">Support Executive</option>
                            <option value="admin">System Overseer</option>
                        </select>
                    </div>

                    <div style={{ position: 'relative', flex: 1 }}>
                        <FaHistory style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#1bc5bd', zIndex: 1 }} />
                        <select 
                            style={{ width: '100%', padding: '16px 16px 16px 40px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontWeight: '700', appearance: 'none', cursor: 'pointer' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Status Logic</option>
                            <option value="active">Active System Access</option>
                            <option value="deactivated">Access Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '32px', 
                boxShadow: 'var(--shadow-md)', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-main)' }}>
                            <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject Identity</th>
                            <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Clearance Tier</th>
                            <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Operational Status</th>
                            <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Enlistment</th>
                            <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Intelligence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#8950fc', fontWeight: '800' }}>SYNCHRONIZING DIRECTORY...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>NO SUBJECTS MATCHING CRITERIA</td></tr>
                        ) : users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="table-row-hover">
                                <td style={{ padding: '25px 35px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            borderRadius: '16px', 
                                            backgroundColor: 'var(--bg-main)', 
                                            overflow: 'hidden',
                                            border: '2px solid var(--border-color)',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            {getProfilePic(user.profilePicture) ? (
                                                <img src={getProfilePic(user.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: '900', fontSize: '20px' }}>
                                                    {user.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '16px' }}>{user.name}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginTop: '2px' }}>@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '25px 35px' }}>
                                    <span style={{ 
                                        padding: '8px 16px', 
                                        borderRadius: '12px', 
                                        fontSize: '11px', 
                                        fontWeight: '900', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        backgroundColor: user.role === 'admin' ? (isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5') : user.role === 'support_agent' ? (isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff') : 'var(--bg-main)',
                                        color: user.role === 'admin' ? '#f64e60' : user.role === 'support_agent' ? '#3699ff' : 'var(--text-secondary)',
                                        border: `1px solid ${user.role === 'admin' ? 'rgba(246, 78, 96, 0.2)' : user.role === 'support_agent' ? 'rgba(54, 153, 255, 0.2)' : 'var(--border-color)'}`
                                    }}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td style={{ padding: '25px 35px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: user.status === 'active' ? '#1bc5bd' : '#f64e60', fontSize: '14px', fontWeight: '900' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: user.status === 'active' ? '#1bc5bd' : '#f64e60', boxShadow: `0 0 10px ${user.status === 'active' ? '#1bc5bd' : '#f64e60'}40` }}></div>
                                        {user.status === 'active' ? 'Operational' : 'Suspended'}
                                    </div>
                                </td>
                                <td style={{ padding: '25px 35px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '700' }}>
                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '25px 35px', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => fetchUserProfile(user._id)}
                                        style={{ border: 'none', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#8950fc'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                    >
                                        Inspect Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
                    onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
                >
                    <div style={{ backgroundColor: 'var(--bg-card)', width: '600px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 50px 150px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', animation: 'modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <div style={{ padding: '40px 50px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Enlist New Subject</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f64e6015'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                            ><FaTimes /></button>
                        </div>
                        <form onSubmit={handleAddUser} style={{ padding: '40px 50px' }}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Identity</label>
                                    <div style={{ position: 'relative' }}>
                                        <FaUser style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="John Doe"
                                            style={{ width: '100%', padding: '16px 16px 16px 50px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                            value={addForm.name}
                                            onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject Handle</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '900' }}>@</span>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="johndoe"
                                            style={{ width: '100%', padding: '16px 16px 16px 40px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                            value={addForm.username}
                                            onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Comm Channel (Email)</label>
                                    <div style={{ position: 'relative' }}>
                                        <FaEnvelope style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="john@example.com"
                                            style={{ width: '100%', padding: '16px 16px 16px 50px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                            value={addForm.email}
                                            onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Clearance Tier (Role)</label>
                                    <div style={{ position: 'relative' }}>
                                        <FaShieldAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8950fc' }} />
                                        <select 
                                            style={{ width: '100%', padding: '16px 16px 16px 45px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', appearance: 'none', cursor: 'pointer' }}
                                            value={addForm.role}
                                            onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                                        >
                                            <option value="user">Operational User</option>
                                            <option value="support_agent">Support Executive</option>
                                            <option value="admin">System Overseer</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '40px' }}>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ width: '100%', padding: '18px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '15px', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1 }}
                                >
                                    {isSubmitting ? 'ENLISTING...' : 'ENLIST SUBJECT & SEND CREDENTIALS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfile && profileData && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
                    onClick={(e) => e.target === e.currentTarget && setShowProfile(false)}
                >
                    <div style={{ backgroundColor: 'var(--bg-card)', width: '1000px', maxHeight: '95vh', borderRadius: '40px', overflow: 'hidden', display: 'flex', boxShadow: '0 50px 150px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', animation: 'modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        {/* Sidebar in Modal */}
                        <div style={{ width: '350px', backgroundColor: 'var(--bg-main)', padding: '50px 40px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                                <div style={{ width: '140px', height: '140px', borderRadius: '45px', backgroundColor: 'var(--bg-card)', margin: '0 auto 25px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '5px solid var(--bg-card)' }}>
                                    {getProfilePic(profileData.user.profilePicture) ? (
                                        <img src={getProfilePic(profileData.user.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.name)}&background=8950fc&color=fff&size=256`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '26px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>{profileData.user.name}</h3>
                                <div style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '15px' }}>@{profileData.user.username}</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                                <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Subject Controls</div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        {profileData.user.status === 'active' ? (
                                            <button onClick={() => handleUpdateUser(profileData.user._id, { status: 'deactivated' })} style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(246, 78, 96, 0.1)', color: '#f64e60', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(246, 78, 96, 0.2)' }}><FaBan /> Suspend</button>
                                        ) : (
                                            <button onClick={() => handleUpdateUser(profileData.user._id, { status: 'active' })} style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(27, 197, 189, 0.1)', color: '#1bc5bd', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(27, 197, 189, 0.2)' }}><FaCheckCircle /> Authorize</button>
                                        )}
                                        <button 
                                            onClick={() => {
                                                setIsEditing(!isEditing);
                                                setEditForm({ name: profileData.user.name, username: profileData.user.username, email: profileData.user.email });
                                            }} 
                                            style={{ flex: 1, padding: '12px', backgroundColor: isEditing ? 'rgba(246, 78, 96, 0.1)' : 'rgba(54, 153, 255, 0.1)', color: isEditing ? '#f64e60' : '#3699ff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: `1px solid ${isEditing ? 'rgba(246, 78, 96, 0.2)' : 'rgba(54, 153, 255, 0.2)'}` }}
                                        >
                                            {isEditing ? <FaTimes /> : <FaUserEdit />} {isEditing ? 'Abort' : 'Modify'}
                                        </button>
                                    </div>
                                    <button onClick={() => handleDeleteUser(profileData.user._id)} style={{ width: '100%', marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <FaTrashAlt /> Purge Digital History
                                    </button>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Clearance Tier Override</div>
                                    <div style={{ position: 'relative' }}>
                                        <FaShieldAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8950fc' }} />
                                        <select 
                                            style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', appearance: 'none', cursor: 'pointer' }}
                                            value={profileData.user.role}
                                            onChange={(e) => handleUpdateUser(profileData.user._id, { role: e.target.value })}
                                        >
                                            <option value="user">Operational User</option>
                                            <option value="support_agent">Support Executive</option>
                                            <option value="admin">System Overseer</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content in Modal */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
                            <div style={{ padding: '40px 50px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Profile Intelligence</h2>
                                <button onClick={() => setShowProfile(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f64e6015'}
                                ><FaTimes /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '50px' }}>
                                {isEditing && (
                                    <div style={{ marginBottom: '50px', backgroundColor: 'var(--bg-main)', padding: '40px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', animation: 'slideDown 0.3s ease-out' }}>
                                        <h4 style={{ margin: '0 0 25px 0', fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Data Modification</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Identity</label>
                                                <div style={{ position: 'relative' }}>
                                                    <FaUser style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                    <input 
                                                        type="text" 
                                                        style={{ width: '100%', padding: '16px 16px 16px 50px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject Handle</label>
                                                <div style={{ position: 'relative' }}>
                                                    <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '900' }}>@</span>
                                                    <input 
                                                        type="text" 
                                                        style={{ width: '100%', padding: '16px 16px 16px 40px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                                        value={editForm.username}
                                                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Comm Channel</label>
                                                <div style={{ position: 'relative' }}>
                                                    <FaEnvelope style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                    <input 
                                                        type="email" 
                                                        style={{ width: '100%', padding: '16px 16px 16px 50px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontWeight: '700' }}
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                                            <button 
                                                onClick={() => {
                                                    handleUpdateUser(profileData.user._id, editForm);
                                                    setIsEditing(false);
                                                }}
                                                style={{ flex: 1, padding: '18px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 25px rgba(137, 80, 252, 0.3)', transition: 'all 0.2s' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            >Commit Changes</button>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                style={{ padding: '18px 30px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '18px', fontWeight: '800', cursor: 'pointer' }}
                                            >Discard</button>
                                        </div>
                                    </div>
                                )}

                                {/* Metabolic Snapshot */}
                                <div style={{ marginBottom: '50px' }}>
                                    <h4 style={{ margin: '0 0 25px 0', fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Biometric & Metabolic Snapshot</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '30px', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                            <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(137, 80, 252, 0.1)', color: '#8950fc', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><FaDumbbell size={20} /></div>
                                            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>{profileData.stats.totalWorkouts}</div>
                                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '5px' }}>Workload cycles</div>
                                        </div>
                                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '30px', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                            <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(27, 197, 189, 0.1)', color: '#1bc5bd', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><FaUtensils size={20} /></div>
                                            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>{profileData.stats.totalNutrition}</div>
                                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '5px' }}>Nutrition Matrix Logs</div>
                                        </div>
                                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '30px', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                            <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255, 168, 0, 0.1)', color: '#ffa800', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><FaWeight size={20} /></div>
                                            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>{profileData.stats.currentWeight} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{profileData.user.preferences?.units === 'imperial' ? 'Lbs' : 'Kg'}</span></div>
                                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '5px' }}>Current Body Mass</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket History */}
                                <div>
                                    <h4 style={{ margin: '0 0 25px 0', fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Support Interaction History</h4>
                                    {profileData.tickets.length === 0 ? (
                                        <div style={{ padding: '50px', backgroundColor: 'var(--bg-main)', borderRadius: '32px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', fontSize: '15px' }}>NO OPERATIONAL SUPPORT LOGS FOUND</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {profileData.tickets.map(ticket => (
                                                <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', backgroundColor: 'var(--bg-main)', borderRadius: '24px', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.01)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '17px', marginBottom: '6px' }}>{ticket.subject}</div>
                                                        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
                                                            <span style={{ color: '#8950fc' }}>#{ticket.ticketId}</span>
                                                            <span>•</span>
                                                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <span style={{ 
                                                        padding: '6px 16px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px',
                                                        backgroundColor: ticket.status === 'Resolved' ? (isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5') : (isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff'),
                                                        color: ticket.status === 'Resolved' ? '#1bc5bd' : '#3699ff',
                                                        border: `1px solid ${ticket.status === 'Resolved' ? 'rgba(27, 197, 189, 0.2)' : 'rgba(54, 153, 255, 0.2)'}`
                                                    }}>{ticket.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.9) translateY(40px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .table-row-hover:hover {
                    background-color: var(--bg-main) !important;
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;
