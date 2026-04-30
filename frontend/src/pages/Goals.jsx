import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCheckCircle, FaBullseye } from 'react-icons/fa';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Weight',
        targetValue: '',
        deadline: ''
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const { data } = await axios.get('/api/goals');
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/goals', formData);
            setShowModal(false);
            setFormData({ title: '', type: 'Weight', targetValue: '', deadline: '' });
            fetchGoals();
        } catch (error) {
            alert('Error creating goal');
        }
    };

    const handleUpdateProgress = async (id, currentValue) => {
        console.log("Updating goal ID:", id, "New Value:", currentValue);
        try {
            await axios.put(`/api/goals/${id}`, { currentValue: Number(currentValue) });
            fetchGoals();
        } catch (error) {
            console.error("Update Goal Error:", error);
            alert('Error updating progress');
        }
    };

    const handleDelete = async (id) => {
        console.log("Deleting goal ID:", id);
        try {
            await axios.delete(`/api/goals/${id}`);
            fetchGoals();
        } catch (error) {
            console.error("Delete Goal Error:", error);
            alert('Error deleting goal');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#181c32' }}>Fitness Goals</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ backgroundColor: '#3699ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                    <FaPlus /> New Goal
                </button>
            </div>

            {loading ? (
                <p>Loading goals...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {goals.map(goal => {
                        const progressPercent = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
                        
                        return (
                            <div key={goal._id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#3f4254', fontSize: '18px' }}>{goal.title}</h3>
                                        <span style={{ fontSize: '12px', color: '#b5b5c3' }}>{goal.type} Goal • Target: {goal.targetValue}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleDelete(goal._id)} style={{ background: 'none', border: 'none', color: '#f64e60', cursor: 'pointer' }}><FaTrash /></button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>
                                        <span>Progress</span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#f3f6f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: goal.status === 'Achieved' ? '#1bc5bd' : '#3699ff', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input 
                                        type="number" 
                                        defaultValue={goal.currentValue}
                                        onBlur={(e) => handleUpdateProgress(goal._id, e.target.value)}
                                        style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #e1e1e1', fontSize: '14px' }}
                                    />
                                    <span style={{ fontSize: '14px', color: '#b5b5c3' }}>Current Value</span>
                                    {goal.status === 'Achieved' && <FaCheckCircle color="#1bc5bd" style={{ marginLeft: 'auto' }} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Goal Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '450px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Set New Goal</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Goal Title</label>
                                <input 
                                    type="text" placeholder="e.g. Lose 5kg" required 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Type</label>
                                    <select 
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="Weight">Weight</option>
                                        <option value="Workouts">Workouts</option>
                                        <option value="Calories">Calories</option>
                                        <option value="Water">Water</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Target</label>
                                    <input 
                                        type="number" required 
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                        value={formData.targetValue} onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#7e8299', marginBottom: '8px' }}>Deadline</label>
                                <input 
                                    type="date" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e1e1e1' }}
                                    value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, backgroundColor: '#3699ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Create Goal</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
