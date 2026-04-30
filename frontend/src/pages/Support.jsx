import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaPaperPlane, FaStar, FaTicketAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const statusColors = {
    'Open': { bg: '#fff3cd', text: '#856404' },
    'In Progress': { bg: '#cce5ff', text: '#004085' },
    'Resolved': { bg: '#d4edda', text: '#155724' },
    'Closed': { bg: '#e2e3e5', text: '#383d41' }
};

const priorityColors = {
    'Low': '#1bc5bd',
    'Medium': '#f6a600',
    'High': '#f64e60'
};

const Support = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'new' | 'thread'
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [csatRating, setCsatRating] = useState(0);
    const [formData, setFormData] = useState({
        subject: '',
        category: 'General',
        priority: 'Medium',
        firstMessage: ''
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await axios.get('/api/tickets');
            setTickets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tickets', formData);
            setFormData({ subject: '', category: 'General', priority: 'Medium', firstMessage: '' });
            setView('list');
            fetchTickets();
        } catch (error) {
            alert('Error creating ticket');
        }
    };

    const handleOpenThread = async (ticket) => {
        try {
            const { data } = await axios.get(`/api/tickets/${ticket._id}`);
            setActiveTicket(data.ticket);
            setMessages(data.messages);
            setCsatRating(data.ticket.csatRating || 0);
            setView('thread');
        } catch (error) {
            alert('Error loading ticket');
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            const { data } = await axios.post(`/api/tickets/${activeTicket._id}/messages`, { message: replyText });
            setMessages(prev => [...prev, data]);
            setReplyText('');
        } catch (error) {
            alert('Error sending reply');
        }
    };

    const handleRate = async (rating) => {
        try {
            const { data } = await axios.put(`/api/tickets/${activeTicket._id}/rate`, { rating });
            setCsatRating(rating);
            setActiveTicket(data);
            fetchTickets();
        } catch (error) {
            alert('Error rating ticket');
        }
    };

    const handleClose = async () => {
        try {
            const { data } = await axios.put(`/api/tickets/${activeTicket._id}/close`);
            setActiveTicket(data);
            fetchTickets();
        } catch (error) {
            alert('Error closing ticket');
        }
    };

    // ── LIST VIEW ──
    if (view === 'list') return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#181c32', margin: 0 }}>Support Tickets</h2>
                <button onClick={() => setView('new')} style={{ backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <FaPlus /> New Ticket
                </button>
            </div>

            {loading ? <p>Loading...</p> : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#b5b5c3' }}>
                    <FaTicketAlt size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <h3 style={{ color: '#b5b5c3' }}>No tickets yet</h3>
                    <p>Submit a new support ticket if you need help.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tickets.map(ticket => (
                        <div key={ticket._id} onClick={() => handleOpenThread(ticket)}
                            style={{ backgroundColor: '#fff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', border: '1px solid transparent' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'}
                        >
                            <div>
                                <div style={{ fontWeight: 'bold', color: '#3f4254', fontSize: '15px', marginBottom: '4px' }}>{ticket.subject}</div>
                                <div style={{ fontSize: '13px', color: '#b5b5c3' }}>{ticket.category} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: priorityColors[ticket.priority] }}>{ticket.priority}</span>
                                <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', backgroundColor: statusColors[ticket.status]?.bg, color: statusColors[ticket.status]?.text, fontWeight: 'bold' }}>
                                    {ticket.status}
                                </span>
                                {ticket.csatRating && <span style={{ color: '#f6a600', fontSize: '12px' }}>{'★'.repeat(ticket.csatRating)}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // ── NEW TICKET FORM ──
    if (view === 'new') return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#7e8299', cursor: 'pointer', fontSize: '20px' }}>←</button>
                <h2 style={{ color: '#181c32', margin: 0 }}>New Support Ticket</h2>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', maxWidth: '700px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <form onSubmit={handleCreateTicket}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#3f4254', marginBottom: '8px' }}>Subject</label>
                        <input type="text" required placeholder="Brief summary of your issue"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e1e1e1', fontSize: '14px' }}
                            value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#3f4254', marginBottom: '8px' }}>Category</label>
                            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e1e1e1' }}
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option>General</option>
                                <option>Technical</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                                <option>Billing</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#3f4254', marginBottom: '8px' }}>Priority</label>
                            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e1e1e1' }}
                                value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#3f4254', marginBottom: '8px' }}>Describe your issue</label>
                        <textarea required rows={6} placeholder="Please describe your issue in detail..."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e1e1e1', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit' }}
                            value={formData.firstMessage} onChange={e => setFormData({ ...formData, firstMessage: e.target.value })} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ flex: 1, backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>Submit Ticket</button>
                        <button type="button" onClick={() => setView('list')} style={{ flex: 1, backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

    // ── THREAD VIEW ──
    if (view === 'thread') return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
            {/* Thread Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => { setView('list'); setActiveTicket(null); }} style={{ background: 'none', border: 'none', color: '#7e8299', cursor: 'pointer', fontSize: '20px' }}>←</button>
                    <div>
                        <h2 style={{ color: '#181c32', margin: 0, fontSize: '18px' }}>{activeTicket?.subject}</h2>
                        <div style={{ fontSize: '13px', color: '#b5b5c3', marginTop: '4px' }}>{activeTicket?.category} • Priority: <span style={{ color: priorityColors[activeTicket?.priority] }}>{activeTicket?.priority}</span></div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ padding: '5px 14px', borderRadius: '20px', backgroundColor: statusColors[activeTicket?.status]?.bg, color: statusColors[activeTicket?.status]?.text, fontWeight: 'bold', fontSize: '13px' }}>
                        {activeTicket?.status}
                    </span>
                    {activeTicket?.status !== 'Closed' && (
                        <button onClick={handleClose} style={{ backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                            Close Ticket
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
                {messages.map(msg => {
                    const isUser = msg.senderRole === 'user';
                    return (
                        <div key={msg._id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '70%',
                                padding: '14px 18px',
                                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                backgroundColor: isUser ? '#8950fc' : '#fff',
                                color: isUser ? '#fff' : '#3f4254',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.message}</div>
                                <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7, textAlign: 'right' }}>{new Date(msg.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CSAT Rating - show when closed or resolved */}
            {(activeTicket?.status === 'Resolved' || activeTicket?.status === 'Closed') && (
                <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', marginBottom: '12px', textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ margin: '0 0 10px', fontWeight: 'bold', color: '#3f4254' }}>Rate your support experience</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <FaStar key={star} size={28} onClick={() => handleRate(star)}
                                style={{ cursor: 'pointer', color: star <= csatRating ? '#f6a600' : '#e1e1e1', transition: 'color 0.2s' }} />
                        ))}
                    </div>
                    {csatRating > 0 && <p style={{ color: '#1bc5bd', marginTop: '8px', fontWeight: 'bold' }}>Thank you for your feedback! ★ {csatRating}/5</p>}
                </div>
            )}

            {/* Reply Box */}
            {activeTicket?.status !== 'Closed' && (
                <form onSubmit={handleReply} style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        style={{ flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #e1e1e1', fontSize: '14px', outline: 'none' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '0 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>
                        <FaPaperPlane />
                    </button>
                </form>
            )}
        </div>
    );
};

export default Support;
