import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrash, FaCheck, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminContactRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/contact');
            setRequests(data);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/contact/${id}`, { status });
            toast.success(`Status updated to ${status}`);
            fetchRequests();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteRequest = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await axios.delete(`/api/contact/${id}`);
                toast.success('Request deleted');
                fetchRequests();
            } catch (error) {
                toast.error('Failed to delete request');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'reviewed': return <FaCheck style={{ color: '#39ff14' }} />;
            case 'rejected': return <FaExclamationCircle style={{ color: '#ff4444' }} />;
            default: return <FaClock style={{ color: '#ffbb33' }} />;
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Access Requests...</div>;

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '40px' }}
            >
                <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Access <span style={{ color: '#39ff14' }}>Requests</span>
                </h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Manage incoming signal transmissions from potential operatives.</p>
            </motion.div>

            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}>
                        <tr>
                            <th style={{ padding: '20px' }}>STATUS</th>
                            <th style={{ padding: '20px' }}>IDENTITY</th>
                            <th style={{ padding: '20px' }}>MESSAGE / JUSTIFICATION</th>
                            <th style={{ padding: '20px' }}>SUBMITTED</th>
                            <th style={{ padding: '20px' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#444' }}>No signals detected in the buffer.</td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request._id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = '#0d0d0d'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '800' }}>
                                            {getStatusIcon(request.status)}
                                            {request.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '700' }}>{request.name}</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>{request.email}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ maxWidth: '400px', fontSize: '14px', color: '#aaa', lineHeight: '1.5' }}>
                                            {request.message}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', fontSize: '13px', color: '#555' }}>
                                        {new Date(request.createdAt).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(request._id, 'reviewed')}
                                                        title="Mark as Reviewed"
                                                        style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid #39ff14', color: '#39ff14', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(request._id, 'rejected')}
                                                        title="Reject Request"
                                                        style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', color: '#ff4444', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        <FaExclamationCircle />
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => deleteRequest(request._id)}
                                                title="Delete Signal"
                                                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', color: '#666', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminContactRequests;
