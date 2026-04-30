import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaPlus, FaTrash, FaChartLine } from 'react-icons/fa';

const Progress = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchLogs = async () => {
        try {
            const { data } = await axios.get('/api/progress');
            setLogs(data);
        } catch (error) {
            console.error('Error fetching progress logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/progress', formData);
            setShowModal(false);
            setFormData({ weight: '', date: new Date().toISOString().split('T')[0] });
            fetchLogs();
        } catch (error) {
            alert('Error logging progress');
        }
    };

    const handleDelete = async (id) => {
        console.log("Delete button clicked for ID:", id);
        try {
            const response = await axios.delete(`/api/progress/${id}`);
            console.log("Delete Response:", response.data);
            fetchLogs();
        } catch (error) {
            console.error("Delete Error:", error);
            alert('Error deleting log: ' + (error.response?.data?.message || error.message));
        }
    };

    const chartData = logs.map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        weight: log.weight
    }));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#181c32' }}>Progress Tracker</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                    <FaPlus /> Log Weight
                </button>
            </div>

            {loading ? (
                <p>Loading progress...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Chart Card */}
                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: '400px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#3f4254' }}>Weight Trend</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f6f9" />
                                <XAxis dataKey="date" stroke="#b5b5c3" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#b5b5c3" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="weight" stroke="#8950fc" strokeWidth={3} dot={{ r: 6, fill: '#8950fc' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Logs Table Card */}
                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#3f4254' }}>Recent Logs</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f3f6f9' }}>
                                    <th style={{ padding: '15px', color: '#b5b5c3' }}>Date</th>
                                    <th style={{ padding: '15px', color: '#b5b5c3' }}>Weight</th>
                                    <th style={{ padding: '15px', color: '#b5b5c3' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid #f3f6f9' }}>
                                        <td style={{ padding: '15px' }}>{new Date(log.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.weight} kg</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => handleDelete(log._id)} style={{ background: 'none', border: 'none', color: '#f64e60', cursor: 'pointer' }}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Log Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Log New Weight</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Weight (kg)</label>
                                <input 
                                    type="number" step="0.1" required 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                    value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Date</label>
                                <input 
                                    type="date" required 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, backgroundColor: '#8950fc', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Log</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Progress;
