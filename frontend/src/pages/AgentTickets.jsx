import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaClock, FaChevronRight, FaTicketAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AgentTickets = () => {
    const { isDarkMode } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(filters).toString();
                const { data } = await axios.get(`/api/agent/tickets?${queryParams}`);
                setTickets(data.tickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [filters]);

    const getStatusStyle = (status) => {
        const map = {
            'Open': { bg: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff', color: '#3699ff' },
            'In Progress': { bg: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', color: '#8950fc' },
            'Awaiting User Reply': { bg: isDarkMode ? 'rgba(255, 168, 0, 0.15)' : '#fff4de', color: '#ffa800' },
            'Resolved': { bg: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5', color: '#1bc5bd' },
            'Closed': { bg: 'var(--bg-main)', color: 'var(--text-muted)' }
        };
        return map[status] || { bg: 'var(--bg-main)', color: 'var(--text-secondary)' };
    };

    const getPriorityStyle = (priority) => {
        const map = {
            'Critical': { color: '#f64e60', bg: isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5' },
            'High': { color: '#ffa800', bg: isDarkMode ? 'rgba(255, 168, 0, 0.15)' : '#fff4de' },
            'Medium': { color: '#3699ff', bg: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff' },
            'Low': { color: '#1bc5bd', bg: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5' }
        };
        return map[priority] || { color: 'var(--text-muted)', bg: 'var(--bg-main)' };
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
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1px' }}>Operations Queue</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '500' }}>Executive management of incoming operational interactions and service requests</p>
                </div>
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
                        placeholder="Search operations by ID or subject footprint..." 
                        style={{ width: '100%', padding: '16px 20px 16px 55px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s' }}
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '300px' }}>
                    <select 
                        style={{ flex: 1, padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontWeight: '700', appearance: 'none', cursor: 'pointer' }}
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">Status Spectrum</option>
                        <option value="Open">Active/Open</option>
                        <option value="In Progress">Under Review</option>
                        <option value="Resolved">Synchronized/Resolved</option>
                        <option value="Closed">Archived</option>
                    </select>

                    <select 
                        style={{ flex: 1, padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', fontWeight: '700', appearance: 'none', cursor: 'pointer' }}
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    >
                        <option value="">Priority Tier</option>
                        <option value="Critical">Immediate/Critical</option>
                        <option value="High">Priority/High</option>
                        <option value="Medium">Standard/Medium</option>
                        <option value="Low">Maintenance/Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets Table */}
            <div style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '32px', 
                boxShadow: 'var(--shadow-md)', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-main)' }}>
                                <th style={{ textAlign: 'left', padding: '25px 30px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Subject Intelligence</th>
                                <th style={{ textAlign: 'left', padding: '25px 30px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Subject Identity</th>
                                <th style={{ textAlign: 'left', padding: '25px 30px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Severity Matrix</th>
                                <th style={{ textAlign: 'left', padding: '25px 30px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Operational Status</th>
                                <th style={{ textAlign: 'left', padding: '25px 30px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Submission</th>
                                <th style={{ padding: '25px 30px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: '100px', textAlign: 'center', color: '#8950fc', fontWeight: '900', letterSpacing: '2px' }}>
                                    SYNCHRONIZING SECURE QUEUE...
                                </td></tr>
                            ) : tickets.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '700' }}>NO OPERATIONS MATCHING SPECIFIED CRITERIA</td></tr>
                            ) : tickets.map((ticket) => (
                                <tr 
                                    key={ticket._id} 
                                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
                                    className="table-row-hover"
                                    onClick={() => navigate(`/agent/ticket/${ticket._id}`)}
                                >
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>{ticket.subject}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '900', color: '#8950fc', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', padding: '4px 10px', borderRadius: '8px', letterSpacing: '0.5px' }}>#{ticket.ticketId}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{ticket.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ 
                                                width: '42px', 
                                                height: '42px', 
                                                borderRadius: '14px', 
                                                backgroundColor: 'var(--bg-main)', 
                                                overflow: 'hidden', 
                                                flexShrink: 0,
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                {getProfilePic(ticket.userId?.profilePicture) ? (
                                                    <img src={getProfilePic(ticket.userId?.profilePicture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '16px', fontWeight: '900' }}>{ticket.userId?.name?.[0]}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>{ticket.userId?.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{ticket.userId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px' }}>
                                        <span style={{ 
                                            padding: '8px 16px', 
                                            borderRadius: '12px', 
                                            fontSize: '11px', 
                                            fontWeight: '900', 
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: getPriorityStyle(ticket.priority).bg,
                                            color: getPriorityStyle(ticket.priority).color,
                                            border: `1px solid ${getPriorityStyle(ticket.priority).color}30`
                                        }}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ 
                                                padding: '8px 16px', 
                                                borderRadius: '12px', 
                                                fontSize: '11px', 
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                backgroundColor: getStatusStyle(ticket.status).bg,
                                                color: getStatusStyle(ticket.status).color,
                                                border: `1px solid ${getStatusStyle(ticket.status).color}30`
                                            }}>
                                                {ticket.status}
                                            </span>
                                            {ticket.isOverdue && <span style={{ color: '#f64e60', filter: 'drop-shadow(0 0 5px #f64e6040)' }} title="Critical Timeout Breach"><FaExclamationTriangle size={14} /></span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ padding: '25px 30px', textAlign: 'right' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}>
                                            <FaChevronRight size={14} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .table-row-hover:hover {
                    background-color: var(--bg-main) !important;
                }
                .table-row-hover:hover td:last-child div {
                    background-color: #8950fc !important;
                    color: #fff !important;
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
};

export default AgentTickets;
