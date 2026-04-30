import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaBell, FaCheck, FaExclamationCircle, FaCamera } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Settings = () => {
    const { user, setUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: '', username: '', email: '', dob: '', gender: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });
    const [prefForm, setPrefForm] = useState({
        units: 'metric', theme: 'light',
        notifications: { goalAchieved: true, supportReply: true, reminder: true }
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || ''
            });
            if (user.preferences) {
                setPrefForm({
                    units: user.preferences.units || 'metric',
                    theme: user.preferences.theme || 'light',
                    notifications: user.preferences.notifications || { goalAchieved: true, supportReply: true, reminder: true }
                });
            }
        }
    }, [user]);

    const showMsg = (type, msg) => {
        if (type === 'success') { setSuccess(msg); setError(''); }
        else { setError(msg); setSuccess(''); }
        setTimeout(() => { setSuccess(''); setError(''); }, 4000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('/api/auth/profile', profileForm);
            // Update context with new user data
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            showMsg('success', 'Profile updated successfully!');
        } catch (err) {
            console.error("Profile update error:", err.response?.data || err);
            showMsg('error', err.response?.data?.message || err.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        setUploadingPic(true);
        try {
            const { data } = await axios.put('/api/auth/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            showMsg('success', 'Profile picture updated successfully!');
        } catch (err) {
            console.error("Picture upload error:", err.response?.data || err);
            setUploadingPic(false);
            showMsg('error', err.response?.data?.message || err.message || 'Error updating profile');
        } finally {
            setUploadingPic(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return showMsg('error', 'New passwords do not match');
        }
        if (passwordForm.newPassword.length < 6) {
            return showMsg('error', 'Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await axios.put('/api/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMsg('success', 'Password changed successfully!');
        } catch (err) {
            showMsg('error', err.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
    };

    const handlePrefUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', { preferences: prefForm });
            showMsg('success', 'Preferences saved!');
        } catch (err) {
            showMsg('error', 'Error saving preferences');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { key: 'profile', label: 'Profile', icon: <FaUser /> },
        { key: 'password', label: 'Password', icon: <FaLock /> },
        { key: 'preferences', label: 'Preferences', icon: <FaBell /> }
    ];

    const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' };
    const fieldStyle = { marginBottom: '20px' };

    return (
        <div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>Settings</h2>

            {/* Alert Messages */}
            {success && (
                <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                    <FaCheck /> {success}
                </div>
            )}
            {error && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                    <FaExclamationCircle /> {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                {/* Sidebar Tabs */}
                <div style={{ width: '220px', flexShrink: 0, backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: activeTab === tab.key ? 'bold' : 'normal', backgroundColor: activeTab === tab.key ? 'rgba(137, 80, 252, 0.1)' : 'transparent', color: activeTab === tab.key ? '#8950fc' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div>
                            <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Personal Information</h3>
                            
                            {/* WhatsApp Style Profile Picture Section */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                                    <img 
                                        src={user?.profilePicture && user.profilePicture !== 'default-avatar.png' ? `http://localhost:5000${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=00d2ff&color=fff&size=150`}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                                    />
                                    <label style={{
                                        position: 'absolute',
                                        bottom: '5px',
                                        right: '5px',
                                        backgroundColor: '#8950fc',
                                        color: '#fff',
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <FaCamera size={16} />
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePictureUpload} disabled={uploadingPic} />
                                    </label>
                                    
                                    {uploadingPic && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8950fc' }}>Saving...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleProfileUpdate}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input style={inputStyle} value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Username</label>
                                    <input style={inputStyle} value={profileForm.username} onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Email</label>
                                    <input type="email" style={inputStyle} value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Date of Birth</label>
                                    <input type="date" style={inputStyle} value={profileForm.dob} onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Gender</label>
                                    <select style={inputStyle} value={profileForm.gender} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            </form>
                        </div>
                    )}

                    {/* PASSWORD TAB */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange}>
                            <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Change Password</h3>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Current Password</label>
                                <input type="password" required style={inputStyle} value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>New Password</label>
                                <input type="password" required style={inputStyle} value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Confirm New Password</label>
                                <input type="password" required style={inputStyle} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} style={{ backgroundColor: '#f64e60', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <form onSubmit={handlePrefUpdate}>
                            <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>App Preferences</h3>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Units System</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['metric', 'imperial'].map(u => (
                                        <button key={u} type="button" onClick={() => setPrefForm({ ...prefForm, units: u })}
                                            style={{ padding: '10px 24px', borderRadius: '8px', border: '2px solid', fontWeight: 'bold', cursor: 'pointer', borderColor: prefForm.units === u ? '#8950fc' : 'var(--border-color)', backgroundColor: prefForm.units === u ? 'rgba(137, 80, 252, 0.1)' : 'transparent', color: prefForm.units === u ? '#8950fc' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
                                            {u === 'metric' ? '🌍 Metric (kg/cm)' : '🇺🇸 Imperial (lbs/in)'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ ...fieldStyle, marginTop: '20px' }}>
                                <label style={labelStyle}>Notification Preferences</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { key: 'goalAchieved', label: 'Goal Achieved notifications' },
                                        { key: 'supportReply', label: 'Support ticket reply notifications' },
                                        { key: 'reminder', label: 'Workout & nutrition reminders' }
                                    ].map(item => (
                                        <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>
                                            <input type="checkbox" checked={prefForm.notifications[item.key]}
                                                onChange={e => setPrefForm({ ...prefForm, notifications: { ...prefForm.notifications, [item.key]: e.target.checked } })}
                                                style={{ width: '18px', height: '18px', accentColor: '#8950fc' }} />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '20px' }}>
                                {loading ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
