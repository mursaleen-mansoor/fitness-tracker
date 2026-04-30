import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaUser, FaPaperPlane, FaStickyNote, FaLevelUpAlt, 
    FaInfoCircle, FaClock, FaCheckCircle, FaChevronLeft,
    FaEnvelope, FaCalendarAlt, FaDumbbell, FaUtensils, FaTimes
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AgentTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [note, setNote] = useState('');
    const [templates, setTemplates] = useState([]);
    const [showEscalate, setShowEscalate] = useState(false);
    const [escalationReason, setEscalationReason] = useState('');
    const chatEndRef = useRef(null);

    const fetchData = async () => {
        try {
            const [ticketRes, templateRes] = await Promise.all([
                axios.get(`/api/agent/tickets/${id}`),
                axios.get('/api/agent/templates')
            ]);
            setData(ticketRes.data);
            setTemplates(templateRes.data);
        } catch (error) {
            console.error('Error fetching ticket data:', error);
            toast.error('Unable to retrieve operative intelligence');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data?.messages]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            const { data: newMsg } = await axios.post(`/api/agent/tickets/${id}/reply`, { message: reply });
            setData(prev => ({
                ...prev,
                messages: [...prev.messages, newMsg],
                ticket: { ...prev.ticket, status: 'In Progress' }
            }));
            setReply('');
            toast.success('Transmission successful');
        } catch (error) {
            toast.error('Transmission failure');
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        try {
            const { data: newNote } = await axios.post(`/api/agent/tickets/${id}/notes`, { content: note });
            setData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
            setNote('');
            toast.success('Internal briefing updated');
        } catch (error) {
            toast.error('Briefing update failed');
        }
    };

    const updateTicketStatus = async (status) => {
        try {
            const { data: updated } = await axios.put(`/api/agent/tickets/${id}`, { status });
            setData(prev => ({ ...prev, ticket: { ...prev.ticket, status: updated.status } }));
            toast.success(`Protocol set to ${status}`);
        } catch (error) {
            toast.error('Protocol update failed');
        }
    };

    const handleEscalate = async () => {
        if (!escalationReason.trim()) return;
        try {
            await axios.post(`/api/agent/tickets/${id}/escalate`, { reason: escalationReason, toAdmin: true });
            toast.success('Intelligence escalated to High Command');
            setShowEscalate(false);
            setEscalationReason('');
            fetchData();
        } catch (error) {
            toast.error('Escalation sequence failed');
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
                <div className="pulse-animation" style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '2px' }}>ESTABLISHING SECURE CONNECTION...</div>
            </div>
        </div>
    );
    if (!data) return <div style={{ textAlign: 'center', padding: '100px', color: '#f64e60', fontWeight: '800' }}>IDENTIFICATION ERROR: TARGET NOT FOUND</div>;

    const { ticket, messages, notes, userActivity } = data;

    return (
        <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '30px', 
                backgroundColor: 'var(--bg-card)', 
                padding: '25px 40px', 
                borderRadius: '32px', 
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <button 
                        onClick={() => navigate('/agent/tickets')} 
                        style={{ border: 'none', background: 'var(--bg-main)', width: '48px', height: '48px', borderRadius: '16px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#8950fc10'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                    >
                        <FaChevronLeft />
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#8950fc', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', padding: '4px 12px', borderRadius: '8px', letterSpacing: '1px' }}>#{ticket.ticketId}</span>
                            <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>{ticket.subject}</h2>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '600' }}>{ticket.category} • INITIALIZED {new Date(ticket.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <span style={{ 
                        padding: '10px 20px', 
                        borderRadius: '14px', 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        backgroundColor: ticket.status === 'Resolved' ? (isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5') : (isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff'), 
                        color: ticket.status === 'Resolved' ? '#1bc5bd' : '#3699ff',
                        border: `1px solid ${ticket.status === 'Resolved' ? 'rgba(27, 197, 189, 0.2)' : 'rgba(54, 153, 255, 0.2)'}`
                    }}>
                        {ticket.status}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 350px', gap: '30px', flex: 1, overflow: 'hidden' }}>
                
                {/* Left Panel: Target Intelligence */}
                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '35px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', overflowY: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '30px', 
                            backgroundColor: 'var(--bg-main)', 
                            margin: '0 auto 20px', 
                            overflow: 'hidden', 
                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border-color)'
                        }}>
                            {getProfilePic(ticket.userId?.profilePicture) ? (
                                <img src={getProfilePic(ticket.userId?.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '32px', fontWeight: '900' }}>
                                    {ticket.userId?.name?.[0]}
                                </div>
                            )}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)', fontWeight: '900' }}>{ticket.userId?.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px', fontWeight: '600' }}>
                            <FaEnvelope size={12} style={{ color: '#8950fc' }} /> {ticket.userId?.email}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px', fontWeight: '900' }}>ENTITY INSIGHTS</h4>
                        
                        <div style={{ marginBottom: '22px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: (isDarkMode ? 'rgba(54, 153, 255, 0.1)' : '#e1f0ff'), color: '#3699ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(54, 153, 255, 0.1)' }}><FaCalendarAlt size={16} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '0.5px' }}>ACTIVATION DATE</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '800' }}>{new Date(ticket.userId?.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '22px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: (isDarkMode ? 'rgba(137, 80, 252, 0.1)' : '#eee5ff'), color: '#8950fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(137, 80, 252, 0.1)' }}><FaDumbbell size={16} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '0.5px' }}>LAST OPERATION</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '800' }}>{userActivity.lastWorkout ? userActivity.lastWorkout.name : 'NO DATA'}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '22px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: (isDarkMode ? 'rgba(255, 168, 0, 0.1)' : '#fff4de'), color: '#ffa800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255, 168, 0, 0.1)' }}><FaUtensils size={16} /></div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '0.5px' }}>LAST INTAKE</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '800' }}>{userActivity.lastNutrition ? userActivity.lastNutrition.mealType : 'NO DATA'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel: Encrypted Stream */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ 
                        flex: 1, 
                        backgroundColor: 'var(--bg-main)', 
                        borderRadius: '32px 32px 0 0', 
                        padding: '30px 40px', 
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        borderBottom: 'none'
                    }}>
                        {messages.map((msg, idx) => {
                            const isAgent = msg.senderRole === 'support';
                            return (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    justifyContent: isAgent ? 'flex-end' : 'flex-start',
                                    marginBottom: '30px',
                                    animation: 'fadeIn 0.3s ease-out'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAgent ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                        <div style={{ 
                                            padding: '18px 24px', 
                                            borderRadius: isAgent ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                            backgroundColor: isAgent ? '#8950fc' : 'var(--bg-card)',
                                            color: isAgent ? '#fff' : 'var(--text-primary)',
                                            boxShadow: isAgent ? '0 12px 30px rgba(137, 80, 252, 0.3)' : 'var(--shadow-sm)',
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            fontWeight: '500',
                                            border: isAgent ? 'none' : '1px solid var(--border-color)'
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {isAgent ? 'YOU' : msg.senderId?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        padding: '30px 40px', 
                        borderRadius: '0 0 32px 32px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <select 
                                style={{ padding: '10px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '800', outline: 'none', cursor: 'pointer' }}
                                onChange={(e) => applyTemplate(e.target.value)}
                            >
                                <option value="">OPERATIVE TEMPLATES</option>
                                {templates.map(t => <option key={t._id} value={t.body}>{t.title}</option>)}
                            </select>
                        </div>
                        <form onSubmit={handleReply} style={{ display: 'flex', gap: '20px' }}>
                            <textarea 
                                placeholder="INITIALIZE TRANSMISSION..." 
                                style={{ flex: 1, padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', resize: 'none', height: '80px', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s' }}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#8950fc'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                            <button type="submit" style={{ width: '80px', height: '80px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', transition: 'all 0.2s', boxShadow: '0 10px 25px rgba(137, 80, 252, 0.4)' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel: Protocol & Briefing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
                    
                    {/* Management Protocol Card */}
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px', fontWeight: '900' }}>CONTROL PROTOCOL</h4>
                        
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '900', marginBottom: '12px', letterSpacing: '0.5px' }}>EXECUTION STATUS</label>
                            <select 
                                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontWeight: '800', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                                value={ticket.status}
                                onChange={(e) => updateTicketStatus(e.target.value)}
                            >
                                <option value="Open">ACTIVE / OPEN</option>
                                <option value="In Progress">UNDER REVIEW</option>
                                <option value="Awaiting User Reply">PENDING RESPONSE</option>
                                <option value="Resolved">SYNCHRONIZED</option>
                                <option value="Closed">ARCHIVED</option>
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '900', marginBottom: '15px', letterSpacing: '0.5px' }}>SEVERITY TIER</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {['Critical', 'High', 'Medium', 'Low'].map(p => (
                                    <button 
                                        key={p}
                                        style={{ 
                                            padding: '12px', 
                                            borderRadius: '12px', 
                                            border: '1px solid var(--border-color)', 
                                            fontSize: '11px', 
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            backgroundColor: ticket.priority === p ? '#8950fc' : 'var(--bg-main)',
                                            color: ticket.priority === p ? '#fff' : 'var(--text-secondary)',
                                            transition: 'all 0.2s',
                                            boxShadow: ticket.priority === p ? '0 8px 15px rgba(137, 80, 252, 0.25)' : 'none'
                                        }}
                                        onClick={async () => {
                                            try { await axios.put(`/api/agent/tickets/${id}`, { priority: p }); setData(prev => ({ ...prev, ticket: { ...prev.ticket, priority: p } })); toast.success(`Severity adjusted to ${p}`); } catch(e) {}
                                        }}
                                    >
                                        {p.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowEscalate(true)}
                            style={{ width: '100%', padding: '16px', backgroundColor: (isDarkMode ? 'rgba(246, 78, 96, 0.1)' : '#ffe2e5'), color: '#f64e60', border: '1px solid rgba(246, 78, 96, 0.2)', borderRadius: '16px', cursor: 'pointer', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f64e6020'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = (isDarkMode ? 'rgba(246, 78, 96, 0.1)' : '#ffe2e5')}
                        >
                            <FaLevelUpAlt /> ESCALATE TO COMMAND
                        </button>
                    </div>

                    {/* Internal Intelligence Briefing */}
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaStickyNote style={{ color: '#ffa800' }} />
                                <h4 style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>INTERNAL BRIEFING</h4>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '25px' }}>
                            <textarea 
                                placeholder="ADD CLASSIFIED INTEL..." 
                                style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', resize: 'none', height: '100px', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s' }}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#ffa800'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                            <button onClick={handleAddNote} style={{ marginTop: '15px', width: '100%', padding: '14px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                                LOG BRIEFING
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                            {notes.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '30px', fontWeight: '700', border: '2px dashed var(--border-color)', borderRadius: '16px' }}>NO CLASSIFIED DATA LOGGED</div>
                            ) : notes.map((n, idx) => (
                                <div key={idx} style={{ padding: '18px', backgroundColor: (isDarkMode ? 'rgba(255, 168, 0, 0.05)' : '#fff8e1'), borderRadius: '18px', marginBottom: '15px', border: '1px solid (isDarkMode ? rgba(255, 168, 0, 0.1) : #ffe0b2)' }}>
                                    <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{n.agentId?.name.toUpperCase()}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>{n.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Escalation Matrix Modal */}
            {showEscalate && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '45px', borderRadius: '40px', width: '500px', boxShadow: '0 30px 100px rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', animation: 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px' }}>Escalation Protocol</h3>
                            <button onClick={() => setShowEscalate(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}><FaTimes /></button>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.7', fontWeight: '500' }}>Marking this interaction for specialized executive review. Provide critical justification for the escalation sequence.</p>
                        <textarea 
                            style={{ width: '100%', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', resize: 'none', height: '140px', boxSizing: 'border-box', marginBottom: '30px', fontSize: '15px', fontWeight: '600' }}
                            placeholder="OPERATIONAL JUSTIFICATION..."
                            value={escalationReason}
                            onChange={(e) => setEscalationReason(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button onClick={() => setShowEscalate(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', cursor: 'pointer', fontWeight: '900', color: 'var(--text-secondary)', fontSize: '14px' }}>CANCEL</button>
                            <button onClick={handleEscalate} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f64e60', color: '#fff', cursor: 'pointer', fontWeight: '900', fontSize: '14px', boxShadow: '0 12px 25px rgba(246, 78, 96, 0.3)' }}>INITIALIZE ESCALATION</button>
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
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default AgentTicketDetail;
