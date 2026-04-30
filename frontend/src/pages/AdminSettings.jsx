import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
    const { user, setUser } = useAuth();
    const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' });
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', username: '', password: '' });
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingPic, setUploadingPic] = useState(false);

    const fetchAdmins = async () => {
        try {
            const { data } = await axios.get('/api/admin/users?role=admin');
            setAdmins(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwdData.new !== pwdData.confirm) return toast.error('Passwords do not match');
        try {
            await axios.put('/api/auth/change-password', { 
                currentPassword: pwdData.current, 
                newPassword: pwdData.new 
            });
            toast.success('Password updated successfully');
            setPwdData({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', { ...newAdmin, role: 'admin' });
            toast.success('New Administrator account created');
            setNewAdmin({ name: '', email: '', username: '', password: '' });
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Creation failed');
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
            toast.success('Profile picture updated successfully!');
        } catch (err) {
            console.error("Picture upload error:", err.response?.data || err);
            toast.error(err.response?.data?.message || 'Error updating profile picture');
        } finally {
            setUploadingPic(false);
        }
    };

    return (
        <div>
            {/* Profile Picture Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Profile Picture</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Update your administrative avatar</p>
                </div>
                
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                        <img 
                            src={user?.profilePicture && user.profilePicture !== 'default-avatar.png' ? `http://localhost:5000${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=8950fc&color=fff&size=150`}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)' }}
                        />
                        <label style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                            backgroundColor: '#8950fc',
                            color: '#fff',
                            width: '32px',
                            height: '32px',
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
                            <FaCamera size={14} />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePictureUpload} disabled={uploadingPic} />
                        </label>
                        {uploadingPic && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#8950fc' }}>...</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)', fontSize: '18px' }}>{user?.name}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
                {/* Password Change */}
                <div>
                    <div style={{ marginBottom: '35px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Security Settings</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Update your administrative credentials</p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <form onSubmit={handlePasswordChange}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>Current Password</label>
                                <input 
                                    type="password" required
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)' }}
                                    value={pwdData.current}
                                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>New Password</label>
                                <input 
                                    type="password" required
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)' }}
                                    value={pwdData.new}
                                    onChange={(e) => setPwdData({...pwdData, new: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>Confirm Password</label>
                                <input 
                                    type="password" required
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)' }}
                                    value={pwdData.confirm}
                                    onChange={(e) => setPwdData({...pwdData, confirm: e.target.value})}
                                />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Update Password</button>
                        </form>
                    </div>
                </div>

                {/* Add Admin */}
                <div>
                    <div style={{ marginBottom: '35px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Provision Admin</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Create a new system administrator account</p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <form onSubmit={handleCreateAdmin}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Full Name</label>
                                    <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }} value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Username</label>
                                    <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }} value={newAdmin.username} onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Email Address</label>
                                <input type="email" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }} value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Temp Password</label>
                                <input type="password" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }} value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)' }}>Create Admin Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
