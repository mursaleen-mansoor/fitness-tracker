import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaUser, FaPaperPlane, FaClock, FaCheckCircle, FaChevronLeft,
    FaEnvelope, FaCalendarAlt, FaDumbbell, FaUtensils, FaTrashAlt,
    FaExclamationTriangle, FaShieldAlt, FaHistory
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [templates, setTemplates] = useState([]);
    const chatEndRef = useRef(null);

    const fetchData = async () => {
        try {
            const [ticketRes, templateRes] = await Promise.all([
                axios.get(`/api/admin/tickets/${id}`),
                axios.get('/api/admin/templates')
            ]);
            setData(ticketRes.data);
            setTemplates(templateRes.data);
        } catch (error) {
            console.error('Error fetching ticket data:', error);
            toast.error('ACCESS DENIED: TARGET NOT FOUND');
            navigate('/admin/tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data?.messages]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            const { data: newMsg } = await axios.post(`/api/admin/tickets/${id}/reply`, { message: reply });
            setData(prev => ({
                ...prev,
                messages: [...prev.messages, newMsg],
                ticket: { ...prev.ticket, status: 'In Progress' }
            }));
            setReply('');
            toast.success('ADMIN OVERRIDE TRANSMITTED');
        } catch (error) {
            toast.error('TRANSMISSION FAILURE');
        }
    };

    const updateTicketStatus = async (status) => {
        try {
            const { data: updated } = await axios.put(`/api/admin/tickets/${id}/status`, { status });
            setData(prev => ({ ...prev, ticket: { ...prev.ticket, status: updated.status } }));
            toast.success(`SYSTEM STATE: ${status.toUpperCase()}`);
        } catch (error) {
            toast.error('STATE UPDATE FAILED');
        }
    };

    const updatePriority = async (priority) => {
        try {
            const { data: updated } = await axios.put(`/api/admin/tickets/${id}/status`, { priority });
            setData(prev => ({ ...prev, ticket: { ...prev.ticket, priority: updated.priority } }));
            toast.success(`SEVERITY LEVEL: ${priority.toUpperCase()}`);
        } catch (error) {
            toast.error('LEVEL ADJUSTMENT FAILED');
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('CONFIRM PERMANENT PURGE OF THIS RECORD?')) return;
        try {
            await axios.delete(`/api/admin/tickets/${id}`);
            toast.success('DATA PURGED SUCCESSFULLY');
            navigate('/admin/tickets');
        } catch (error) {
            toast.error('PURGE SEQUENCE FAILED');
        }
    };

    const getProfilePic = (pic) => {
        if (!pic || pic === 'default-avatar.png') return null;
        if (pic.startsWith('http')) return pic;
        return `http://localhost:5000${pic.startsWith('/') ? '' : '/'}${pic}`;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8950fc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="admin-pulse" style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px' }}>ACCESSING COMMAND CORE...</div>
            </div>
        </div>
    );
    if (!data) return null;

    const { ticket, messages, userActivity } = data;

    return (
        <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', animation: 'adminFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            {/* Command Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '30px', 
                backgroundColor: 'var(--bg-card)', 
                padding: '30px 40px', 
                borderRadius: '32px', 
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#f64e60' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <button 
                        onClick={() => navigate('/admin/tickets')} 
                        style={{ border: 'none', background: 'var(--bg-main)', width: '52px', height: '52px', borderRadius: '18px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', border: '1px solid var(--border-color)' }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#181c32'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    >
                        <FaChevronLeft />
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#8950fc', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', padding: '5px 15px', borderRadius: '10px', letterSpacing: '1px' }}>ID: {ticket.ticketId}</span>
                            <h2 style={{ margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-1px' }}>{ticket.subject}</h2>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{ticket.category} • INITIALIZED: {new Date(ticket.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                        padding: '12px 24px', 
                        borderRadius: '16px', 
                        fontSize: '12px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        backgroundColor: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff', 
                        color: '#3699ff',
                        border: '1px solid rgba(54, 153, 255, 0.2)'
                    }}>
                        {ticket.status}
                    </div>
                    <button 
                        onClick={handleDeleteTicket} 
                        style={{ width: '52px', height: '52px', borderRadius: '18px', backgroundColor: isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5', color: '#f64e60', border: '1px solid rgba(246, 78, 96, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.3s' }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f64e60'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5'; e.currentTarget.style.color = '#f64e60'; }}
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 380px', gap: '30px', flex: 1, overflow: 'hidden' }}>
                
                {/* Left Panel: Target Intelligence Profile */}
                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', overflowY: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '40px', 
                            backgroundColor: 'var(--bg-main)', 
                            margin: '0 auto 25px', 
                            overflow: 'hidden', 
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)', 
                            border: '4px solid var(--bg-card)',
                            position: 'relative'
                        }}>
                            {getProfilePic(ticket.userId?.profilePicture) ? (
                                <img src={getProfilePic(ticket.userId?.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '42px', fontWeight: '900' }}>
                                    {ticket.userId?.name?.[0]}
                                </div>
                            )}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>{ticket.userId?.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px', fontWeight: '700' }}>
                            <FaEnvelope size={14} style={{ color: '#8950fc' }} /> {ticket.userId?.email}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '35px' }}>
                        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px', fontWeight: '900' }}>CORE ANALYTICS</h4>
                        
                        <div style={{ marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: isDarkMode ? 'rgba(54, 153, 255, 0.1)' : '#e1f0ff', color: '#3699ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(54, 153, 255, 0.1)' }}><FaCalendarAlt size={18} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>MEMBER SINCE</div>
                                <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>{new Date(ticket.userId?.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.1)' : '#eee5ff', color: '#8950fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(137, 80, 252, 0.1)' }}><FaDumbbell size={18} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>LAST OPERATION</div>
                                <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>{userActivity.lastWorkout ? userActivity.lastWorkout.name : 'NO DATA'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: isDarkMode ? 'rgba(255, 168, 0, 0.1)' : '#fff4de', color: '#ffa800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255, 168, 0, 0.1)' }}><FaUtensils size={18} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>LAST INTAKE</div>
                                <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>{userActivity.lastNutrition ? userActivity.lastNutrition.mealType : 'NO DATA'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel: Command Log (Chat) */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ 
                        flex: 1, 
                        backgroundColor: 'var(--bg-main)', 
                        borderRadius: '32px 32px 0 0', 
                        padding: '40px', 
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        borderBottom: 'none'
                    }}>
                        {messages.map((msg, idx) => {
                            const isSenderAdmin = msg.senderRole === 'admin';
                            const isSenderAgent = msg.senderRole === 'support';
                            const isAdminOrAgent = isSenderAdmin || isSenderAgent;
                            
                            return (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    justifyContent: isAdminOrAgent ? 'flex-end' : 'flex-start',
                                    marginBottom: '35px',
                                    animation: 'adminFadeIn 0.4s ease-out'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAdminOrAgent ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                        <div style={{ 
                                            padding: '20px 28px', 
                                            borderRadius: isAdminOrAgent ? '28px 28px 6px 28px' : '28px 28px 28px 6px',
                                            backgroundColor: isSenderAdmin ? (isDarkMode ? '#fff' : '#181c32') : isSenderAgent ? '#8950fc' : 'var(--bg-card)',
                                            color: isSenderAdmin ? (isDarkMode ? '#181c32' : '#fff') : isAdminOrAgent ? '#fff' : 'var(--text-primary)',
                                            boxShadow: isAdminOrAgent ? '0 15px 35px rgba(0,0,0,0.15)' : 'var(--shadow-sm)',
                                            fontSize: '16px',
                                            lineHeight: '1.7',
                                            fontWeight: '500',
                                            border: isAdminOrAgent ? 'none' : '1px solid var(--border-color)'
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {isSenderAdmin ? 'SYSTEM OVERRIDE' : isSenderAgent ? 'AGENT RESPONSE' : 'USER TRANSMISSION'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '35px 40px', 
                        borderRadius: '0 0 32px 32px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <select 
                                style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '800', outline: 'none', cursor: 'pointer' }}
                                onChange={(e) => setReply(e.target.value)}
                            >
                                <option value="">COMMAND TEMPLATES</option>
                                {templates.map(t => <option key={t._id} value={t.body}>{t.title}</option>)}
                            </select>
                        </div>
                        <form onSubmit={handleReply} style={{ display: 'flex', gap: '20px' }}>
                            <textarea 
                                placeholder="INITIALIZE ADMIN OVERRIDE..." 
                                style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', resize: 'none', height: '80px', fontSize: '16px', fontWeight: '600', transition: 'all 0.3s' }}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#8950fc'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                            <button type="submit" style={{ width: '80px', height: '80px', backgroundColor: (isDarkMode ? '#fff' : '#181c32'), color: (isDarkMode ? '#181c32' : '#fff'), border: 'none', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', transition: 'all 0.3s', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel: Command Console */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
                    
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '35px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <FaShieldAlt style={{ color: '#1bc5bd', fontSize: '18px' }} />
                            <h4 style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>COMMAND CONSOLE</h4>
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '900', marginBottom: '15px', letterSpacing: '1px' }}>SYSTEM STATE</label>
                            <select 
                                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontWeight: '800', outline: 'none', cursor: 'pointer' }}
                                value={ticket.status}
                                onChange={(e) => updateTicketStatus(e.target.value)}
                            >
                                <option value="Open">OPEN / ACTIVE</option>
                                <option value="In Progress">UNDER REVIEW</option>
                                <option value="Awaiting User Reply">PENDING RESPONSE</option>
                                <option value="Resolved">SYNCHRONIZED</option>
                                <option value="Closed">ARCHIVED</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '900', marginBottom: '18px', letterSpacing: '1px' }}>SEVERITY MATRIX</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {['Critical', 'High', 'Medium', 'Low'].map(p => (
                                    <button 
                                        key={p}
                                        style={{ 
                                            padding: '14px', 
                                            borderRadius: '14px', 
                                            border: '1px solid var(--border-color)', 
                                            fontSize: '11px', 
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            backgroundColor: ticket.priority === p ? '#f64e60' : 'var(--bg-main)',
                                            color: ticket.priority === p ? '#fff' : 'var(--text-secondary)',
                                            transition: 'all 0.3s',
                                            boxShadow: ticket.priority === p ? '0 10px 20px rgba(246, 78, 96, 0.3)' : 'none'
                                        }}
                                        onClick={() => updatePriority(p)}
                                    >
                                        {p.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Suite */}
                    <div style={{ backgroundColor: (isDarkMode ? '#1a1a2e' : '#181c32'), borderRadius: '32px', padding: '35px', color: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}></div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <FaHistory style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} />
                            <h4 style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>METADATA STREAM</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>ASSIGNED UNIT</span>
                                <span style={{ fontSize: '13px', fontWeight: '900' }}>{ticket.assignedTo?.name.toUpperCase() || 'AUTO-QUEUE'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>LAST UPDATED</span>
                                <span style={{ fontSize: '13px', fontWeight: '900' }}>{new Date(ticket.updatedAt).toLocaleTimeString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>ESCALATION</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ticket.isEscalated ? '#f64e60' : '#1bc5bd' }}></div>
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: ticket.isEscalated ? '#f64e60' : '#1bc5bd' }}>{ticket.isEscalated ? 'CRITICAL' : 'STABLE'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes adminFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .admin-pulse {
                    animation: pulseAdmin 2s infinite;
                }
                @keyframes pulseAdmin {
                    0% { opacity: 0.4; filter: blur(2px); }
                    50% { opacity: 1; filter: blur(0); }
                    100% { opacity: 0.4; filter: blur(2px); }
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 20px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default AdminTicketDetail;
