import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaTicketAlt, FaSearch, FaFilter, FaExchangeAlt, 
    FaTrashAlt, FaExclamationTriangle, FaUserAlt, FaCheckCircle, FaClock, FaChevronRight
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminTickets = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [escalated, setEscalated] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [showReassign, setShowReassign] = useState(null);

    const fetchData = async () => {
        try {
            const [allRes, escRes, agentsRes] = await Promise.all([
                axios.get(`/api/admin/tickets?search=${search}`),
                axios.get('/api/admin/tickets/escalated'),
                axios.get('/api/admin/stats/support-team')
            ]);
            setTickets(allRes.data);
            setEscalated(escRes.data);
            setAgents(agentsRes.data);
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const handleReassign = async (ticketId, agentId) => {
        try {
            await axios.put(`/api/admin/tickets/${ticketId}/reassign`, { agentId });
            toast.success('Ticket successfully reassigned');
            setShowReassign(null);
            fetchData();
        } catch (error) {
            toast.error('Reassignment failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY purge this ticket?')) return;
        try {
            await axios.delete(`/api/admin/tickets/${id}`);
            toast.success('Ticket purged from system');
            fetchData();
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const getProfilePic = (pic) => {
        if (!pic || pic === 'default-avatar.png') return null;
        if (pic.startsWith('http')) return pic;
        return `http://localhost:5000${pic.startsWith('/') ? '' : '/'}${pic}`;
    };

    const TicketTable = ({ data }) => (
        <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderRadius: '32px', 
            boxShadow: 'var(--shadow-md)', 
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-main)' }}>
                            <th style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject & Identity</th>
                            <th style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Entity</th>
                            <th style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Operations Assignment</th>
                            <th style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Status</th>
                            <th style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>NO RECORDS FOUND IN THIS CATEGORY</td></tr>
                        ) : data.map((ticket) => (
                            <tr key={ticket._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="table-row-hover">
                                <td style={{ padding: '25px 30px' }}>
                                    <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '6px' }}>{ticket.subject}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#8950fc' }}>#{ticket.ticketId}</span>
                                        <span>•</span>
                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '25px 30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            borderRadius: '10px', 
                                            backgroundColor: 'var(--bg-main)', 
                                            overflow: 'hidden',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            {getProfilePic(ticket.userId?.profilePicture) ? (
                                                <img src={getProfilePic(ticket.userId?.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: '900', fontSize: '14px' }}>
                                                    {ticket.userId?.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{ticket.userId?.name}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '25px 30px' }}>
                                    {showReassign === ticket._id ? (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <select 
                                                autoFocus
                                                onBlur={(e) => {
                                                    // Only close if we didn't click inside the select
                                                    if (!e.currentTarget.contains(e.relatedTarget)) setShowReassign(null);
                                                }}
                                                onChange={(e) => handleReassign(ticket._id, e.target.value)}
                                                style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #8950fc', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', outline: 'none' }}
                                            >
                                                <option value="">Select Operative</option>
                                                {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                            </select>
                                            <button onClick={() => setShowReassign(null)} style={{ border: 'none', background: 'none', color: '#f64e60', cursor: 'pointer' }}><FaTimes /></button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ 
                                                fontSize: '13px', 
                                                color: ticket.assignedTo ? 'var(--text-primary)' : '#f64e60', 
                                                fontWeight: '800',
                                                backgroundColor: ticket.assignedTo ? 'transparent' : (isDarkMode ? 'rgba(246, 78, 96, 0.1)' : '#ffe2e5'),
                                                padding: ticket.assignedTo ? '0' : '4px 10px',
                                                borderRadius: '8px'
                                            }}>
                                                {ticket.assignedTo?.name || 'UNASSIGNED'}
                                            </span>
                                            <button 
                                                onClick={() => setShowReassign(ticket._id)} 
                                                style={{ border: 'none', background: 'var(--bg-main)', color: '#8950fc', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#8950fc20'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                            >
                                                <FaExchangeAlt size={12}/>
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '25px 30px' }}>
                                    <span style={{ 
                                        padding: '8px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px',
                                        backgroundColor: ticket.status === 'Resolved' ? (isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5') : ticket.status === 'In Progress' ? (isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff') : 'var(--bg-main)',
                                        color: ticket.status === 'Resolved' ? '#1bc5bd' : ticket.status === 'In Progress' ? '#3699ff' : 'var(--text-secondary)',
                                        border: `1px solid ${ticket.status === 'Resolved' ? 'rgba(27, 197, 189, 0.2)' : ticket.status === 'In Progress' ? 'rgba(54, 153, 255, 0.2)' : 'var(--border-color)'}`
                                    }}>{ticket.status}</span>
                                </td>
                                <td style={{ padding: '25px 30px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        <button 
                                            onClick={() => navigate(`/admin/ticket/${ticket._id}`)} 
                                            style={{ border: 'none', backgroundColor: 'var(--bg-main)', color: '#3699ff', padding: '12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
                                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#3699ff20'}
                                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                        >
                                            <FaChevronRight size={14}/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(ticket._id)} 
                                            style={{ border: 'none', backgroundColor: 'var(--bg-main)', color: '#f64e60', padding: '12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
                                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f64e6020'}
                                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                        >
                                            <FaTrashAlt size={14}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1px' }}>Command Operations</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '500' }}>Master oversight of all communication channels and subject escalations</p>
                </div>
            </div>

            {/* Navigation & Search Container */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '35px', borderRadius: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            onClick={() => setTab('all')}
                            style={{ 
                                padding: '14px 25px', 
                                borderRadius: '16px',
                                border: 'none', 
                                backgroundColor: tab === 'all' ? '#8950fc' : 'var(--bg-main)', 
                                color: tab === 'all' ? '#fff' : 'var(--text-secondary)', 
                                fontWeight: '900', 
                                fontSize: '13px',
                                cursor: 'pointer', 
                                transition: 'all 0.3s',
                                boxShadow: tab === 'all' ? '0 8px 20px rgba(137, 80, 252, 0.25)' : 'none'
                            }}
                        >
                            ALL CHANNELS ({tickets.length})
                        </button>
                        <button 
                            onClick={() => setTab('escalated')}
                            style={{ 
                                padding: '14px 25px', 
                                borderRadius: '16px',
                                border: 'none', 
                                backgroundColor: tab === 'escalated' ? '#f64e60' : 'var(--bg-main)', 
                                color: tab === 'escalated' ? '#fff' : 'var(--text-secondary)', 
                                fontWeight: '900', 
                                fontSize: '13px',
                                cursor: 'pointer', 
                                transition: 'all 0.3s',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                boxShadow: tab === 'escalated' ? '0 8px 20px rgba(246, 78, 96, 0.25)' : 'none'
                            }}
                        >
                            <FaExclamationTriangle /> CRITICAL ESCALATIONS ({escalated.length})
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <FaSearch style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '18px' }} />
                        <input 
                            type="text" 
                            placeholder="Identify records by subject or footprint..." 
                            style={{ width: '100%', padding: '16px 20px 16px 55px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#8950fc', fontWeight: '900', letterSpacing: '2px' }}>SYNCHRONIZING OPERATIONAL DATA...</div>
            ) : (
                <TicketTable data={tab === 'all' ? tickets : escalated} />
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .table-row-hover:hover {
                    background-color: var(--bg-main) !important;
                }
            `}</style>
        </div>
    );
};

export default AdminTickets;
