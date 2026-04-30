import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaHistory, FaFilter, FaUser, FaTicketAlt, 
    FaExclamationCircle, FaShieldAlt, FaKey, FaCogs,
    FaSyncAlt, FaArrowRight, FaCommentDots
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminLogs = () => {
    const { isDarkMode } = useTheme();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/admin/logs?type=${typeFilter}`);
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [typeFilter]);

    const getLogIcon = (type) => {
        switch (type) {
            case 'creation': return <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(54, 153, 255, 0.15)' : '#e1f0ff', color: '#3699ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTicketAlt size={14} /></div>;
            case 'escalation': return <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(246, 78, 96, 0.15)' : '#ffe2e5', color: '#f64e60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaExclamationCircle size={14} /></div>;
            case 'reply': return <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(27, 197, 189, 0.15)' : '#c9f7f5', color: '#1bc5bd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaCommentDots size={14} /></div>;
            case 'status_change': return <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', color: '#8950fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaSyncAlt size={14} /></div>;
            default: return <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}><FaHistory size={14} /></div>;
        }
    };

    return (
        <div style={{ animation: 'logsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-1px' }}>System Audit Intelligence</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '10px 0 0 0', fontSize: '16px', fontWeight: '600' }}>Comprehensive security logs and operational event monitoring</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'var(--bg-card)', padding: '12px 25px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <FaFilter color="var(--text-muted)" size={14} />
                    <select 
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', cursor: 'pointer' }}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">ALL SECURITY EVENTS</option>
                        <option value="creation">CORE INITIALIZATION</option>
                        <option value="reply">COMMUNICATION UPLINK</option>
                        <option value="escalation">CRITICAL ESCALATION</option>
                        <option value="status_change">STATE TRANSITION</option>
                        <option value="note">INTERNAL PROTOCOL</option>
                    </select>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f9f9fb' }}>
                                <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)' }}>TIMESTAMP</th>
                                <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)' }}>ACTION TYPE</th>
                                <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)' }}>OPERATIONAL UNIT</th>
                                <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)' }}>EVENT DATA</th>
                                <th style={{ padding: '25px 35px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)' }}>REFERENCE ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '100px', textAlign: 'center' }}>
                                        <div className="logs-loader" style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(137, 80, 252, 0.1)', borderTopColor: '#8950fc', borderRadius: '50%', animation: 'logsSpin 1s linear infinite' }}></div>
                                        <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: '800', color: '#8950fc', letterSpacing: '2px' }}>ACCESSING ARCHIVES...</div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px', fontWeight: '700' }}>NO AUDIT RECORDS DETECTED IN THIS SECTOR</td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log._id} className="log-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.3s' }}>
                                    <td style={{ padding: '25px 35px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '800' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(log.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 35px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {getLogIcon(log.type)}
                                            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{log.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 35px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ 
                                                width: '38px', 
                                                height: '38px', 
                                                borderRadius: '12px', 
                                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f6f9', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                fontSize: '14px', 
                                                color: 'var(--text-primary)', 
                                                fontWeight: '900',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                {log.userId?.name?.[0] || 'S'}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{log.userId?.name || 'SYSTEM CORE'}</span>
                                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#8950fc', textTransform: 'uppercase' }}>{log.userId?.role || 'KERNEL'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 35px', fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '600', maxWidth: '300px', lineHeight: '1.6' }}>
                                        {log.action}
                                    </td>
                                    <td style={{ padding: '25px 35px' }}>
                                        {log.ticketId ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ 
                                                    fontSize: '12px', 
                                                    color: '#8950fc', 
                                                    fontWeight: '900', 
                                                    backgroundColor: isDarkMode ? 'rgba(137, 80, 252, 0.15)' : '#eee5ff', 
                                                    padding: '6px 15px', 
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(137, 80, 252, 0.2)'
                                                }}>
                                                    #{log.ticketId.ticketId}
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '900' }}>---</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes logsFadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes logsSpin {
                    to { transform: rotate(360deg); }
                }
                .log-row:hover {
                    background-color: ${isDarkMode ? 'rgba(255,255,255,0.02)' : '#f9f9fb'};
                }
                .log-row:last-child {
                    border-bottom: none;
                }
            `}</style>
        </div>
    );
};

export default AdminLogs;
