import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaAppleAlt, FaEdit } from 'react-icons/fa';

const Nutrition = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        mealType: 'Breakfast',
        foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1 }]
    });

    const fetchLogs = async () => {
        try {
            const { data } = await axios.get('/api/nutrition');
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleEdit = (log) => {
        setEditingId(log._id);
        setFormData({
            mealType: log.mealType,
            foodItems: log.foodItems.map(item => ({
                name: item.name,
                calories: item.calories,
                protein: item.protein || '',
                carbs: item.carbs || '',
                fats: item.fats || '',
                quantity: item.quantity || 1
            }))
        });
        setShowModal(true);
    };

    const handleAddFood = () => {
        setFormData({
            ...formData,
            foodItems: [...formData.foodItems, { name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1 }]
        });
    };

    const handleFoodChange = (index, e) => {
        const newFoodItems = [...formData.foodItems];
        newFoodItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, foodItems: newFoodItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // We need to add PUT route for nutrition if not exist
                await axios.put(`/api/nutrition/${editingId}`, formData);
            } else {
                await axios.post('/api/nutrition', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ mealType: 'Breakfast', foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1 }] });
            fetchLogs();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving nutrition');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this log?')) {
            try {
                await axios.delete(`/api/nutrition/${id}`);
                fetchLogs();
            } catch (error) {
                alert('Error deleting log');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: 'var(--text-primary)' }}>Nutrition Log</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ backgroundColor: '#1bc5bd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                    <FaPlus /> Log Meal
                </button>
            </div>

            {loading ? (
                <p>Loading nutrition logs...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {logs.map(log => (
                        <div key={log._id} style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{log.mealType}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(log.date).toLocaleDateString()} • {log.totalCalories} kcal</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleEdit(log)} style={{ background: 'none', border: 'none', color: '#3699ff', cursor: 'pointer' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete(log._id)} style={{ background: 'none', border: 'none', color: '#f64e60', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #f3f6f9', paddingTop: '15px' }}>
                                {log.foodItems.map((item, i) => (
                                    <div key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: i === log.foodItems.length - 1 ? 'none' : '1px dashed var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</span>
                                            <span style={{ color: '#1bc5bd' }}>{item.calories} kcal</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '15px' }}>
                                            <span>P: {item.protein}g</span>
                                            <span>C: {item.carbs}g</span>
                                            <span>F: {item.fats}g</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Nutrition Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>{editingId ? 'Edit Meal' : 'Log New Meal'}</h3>
                        <form onSubmit={handleSubmit}>
                            <select 
                                style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                                value={formData.mealType} onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                            >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
                                <option value="Post-Workout">Post-Workout</option>
                            </select>

                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Food Items</h4>
                            {formData.foodItems.map((food, index) => (
                                <div key={index} style={{ backgroundColor: 'var(--bg-main)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
                                    <input name="name" placeholder="Food Name (e.g. Oats)" required value={food.name} onChange={(e) => handleFoodChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box', marginBottom: '10px' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                        <div>
                                            <label style={{ fontSize: '10px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Calories</label>
                                            <input name="calories" placeholder="kcal" type="number" required value={food.calories} onChange={(e) => handleFoodChange(index, e)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Protein</label>
                                            <input name="protein" placeholder="g" type="number" value={food.protein} onChange={(e) => handleFoodChange(index, e)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Carbs</label>
                                            <input name="carbs" placeholder="g" type="number" value={food.carbs} onChange={(e) => handleFoodChange(index, e)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Fats</label>
                                            <input name="fats" placeholder="g" type="number" value={food.fats} onChange={(e) => handleFoodChange(index, e)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddFood} style={{ marginBottom: '25px', background: 'none', border: '1px dashed var(--border-color)', color: 'var(--text-primary)', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add More Food</button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, backgroundColor: '#1bc5bd', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Update Meal' : 'Save Meal'}</button>
                                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setFormData({ mealType: 'Breakfast', foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1 }] }); }} style={{ flex: 1, backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nutrition;
