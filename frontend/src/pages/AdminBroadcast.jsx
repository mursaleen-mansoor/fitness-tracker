import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBullhorn, FaHistory, FaUser, FaUsers, FaUserTie, FaPaperPlane } from 'react-icons/fa';

const AdminBroadcast = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        target: 'All Users',
        targetUserId: '',
        message: ''
    });

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/admin/broadcast/history');
            setHistory(data);
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return toast.error('Please enter a message');
        
        setSending(true);
        try {
            await axios.post('/api/admin/broadcast', formData);
            toast.success('Broadcast sent successfully');
            setFormData({ ...formData, message: '', targetUserId: '' });
            fetchHistory();
        } catch (error) {
            toast.error('Failed to send broadcast');
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '35px' }}>
            {/* Send Broadcast Section */}
            <div>
                <div style={{ marginBottom: '35px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#181c32', margin: 0 }}>System Broadcast</h1>
                    <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Send urgent announcements or system updates</p>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#3f4254', marginBottom: '10px', textTransform: 'uppercase' }}>Target Audience</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {[
                                    { id: 'All Users', icon: <FaUsers /> },
                                    { id: 'All Agents', icon: <FaUserTie /> },
                                    { id: 'Specific User', icon: <FaUser /> }
                                ].map((t) => (
                                    <div 
                                        key={t.id}
                                        onClick={() => setFormData({...formData, target: t.id})}
                                        style={{ 
                                            padding: '15px 10px', 
                                            borderRadius: '12px', 
                                            border: `2px solid ${formData.target === t.id ? '#8950fc' : '#f3f6f9'}`,
                                            backgroundColor: formData.target === t.id ? '#8950fc0a' : '#fff',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ color: formData.target === t.id ? '#8950fc' : '#b5b5c3', marginBottom: '8px', fontSize: '18px' }}>{t.icon}</div>
                                        <div style={{ fontSize: '11px', fontWeight: '800', color: formData.target === t.id ? '#8950fc' : '#7e8299' }}>{t.id}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {formData.target === 'Specific User' && (
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#3f4254', marginBottom: '10px', textTransform: 'uppercase' }}>User ID</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter MongoDB User ID..."
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box' }}
                                    value={formData.targetUserId}
                                    onChange={(e) => setFormData({...formData, targetUserId: e.target.value})}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#3f4254', marginBottom: '10px', textTransform: 'uppercase' }}>Broadcast Message</label>
                            <textarea 
                                placeholder="Type your announcement here..."
                                style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '14px', fontWeight: '600', height: '150px', resize: 'none', boxSizing: 'border-box', lineHeight: '1.6' }}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            />
                        </div>

                        <button 
                            disabled={sending}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: '#8950fc', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '15px', 
                                fontWeight: '900', 
                                fontSize: '15px', 
                                cursor: sending ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)'
                            }}
                        >
                            {sending ? 'SENDING...' : <><FaPaperPlane /> BROADCAST NOW</>}
                        </button>
                    </form>
                </div>
            </div>

            {/* Broadcast History */}
            <div>
                <div style={{ marginBottom: '35px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#181c32', margin: 0 }}>Transmission History</h2>
                    <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Review previously sent announcements</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loading ? (
                        <div style={{ color: '#b5b5c3' }}>Loading logs...</div>
                    ) : history.length === 0 ? (
                        <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', textAlign: 'center', color: '#b5b5c3', fontWeight: '800' }}>NO PREVIOUS BROADCASTS</div>
                    ) : history.map((log) => (
                        <div key={log._id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ 
                                    padding: '5px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase',
                                    backgroundColor: log.target === 'All Users' ? '#eee5ff' : log.target === 'All Agents' ? '#e1f0ff' : '#f3f6f9',
                                    color: log.target === 'All Users' ? '#8950fc' : log.target === 'All Agents' ? '#3699ff' : '#7e8299'
                                }}>{log.target}</span>
                                <span style={{ fontSize: '12px', color: '#b5b5c3', fontWeight: '700' }}>{new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#3f4254', fontWeight: '600', lineHeight: '1.5' }}>{log.message}</p>
                            <div style={{ borderTop: '1px solid #f3f6f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#b5b5c3', fontWeight: '700' }}>By: <span style={{ color: '#181c32' }}>{log.senderId?.name}</span></div>
                                <div style={{ fontSize: '12px', color: '#1bc5bd', fontWeight: '900' }}>{log.recipientCount} Recipients</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminBroadcast;
