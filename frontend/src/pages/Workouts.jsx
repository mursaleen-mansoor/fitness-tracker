import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaDumbbell } from 'react-icons/fa';

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Strength',
        notes: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }]
    });

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const { data } = await axios.get('/api/workouts');
            setWorkouts(data);
        } catch (error) {
            console.error('Error fetching workouts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (workout) => {
        setEditingId(workout._id);
        setFormData({
            name: workout.name,
            category: workout.category,
            notes: workout.notes || '',
            exercises: workout.exercises.map(ex => ({
                name: ex.name,
                sets: ex.sets || '',
                reps: ex.reps || '',
                weight: ex.weight || ''
            }))
        });
        setShowModal(true);
    };

    const handleAddExercise = () => {
        setFormData({
            ...formData,
            exercises: [...formData.exercises, { name: '', sets: '', reps: '', weight: '' }]
        });
    };

    const handleExerciseChange = (index, e) => {
        const newExercises = [...formData.exercises];
        newExercises[index][e.target.name] = e.target.value;
        setFormData({ ...formData, exercises: newExercises });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/workouts/${editingId}`, formData);
            } else {
                await axios.post('/api/workouts', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', category: 'Strength', notes: '', exercises: [{ name: '', sets: '', reps: '', weight: '' }] });
            fetchWorkouts();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving workout');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await axios.delete(`/api/workouts/${id}`);
                fetchWorkouts();
            } catch (error) {
                alert('Error deleting workout');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: 'var(--text-primary)' }}>My Workouts</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ backgroundColor: '#00d2ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                    <FaPlus /> Add Workout
                </button>
            </div>

            {loading ? (
                <p>Loading workouts...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {workouts.map(workout => (
                        <div key={workout._id} style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{workout.name}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(workout.date).toLocaleDateString()} • {workout.category}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleEdit(workout)} style={{ background: 'none', border: 'none', color: '#3699ff', cursor: 'pointer' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete(workout._id)} style={{ background: 'none', border: 'none', color: '#f64e60', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #f3f6f9', paddingTop: '15px' }}>
                                {workout.exercises.map((ex, i) => (
                                    <div key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{ex.name}</span>
                                        <span style={{ fontWeight: 'bold' }}>{ex.sets} x {ex.reps} • {ex.weight}kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simple Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>{editingId ? 'Edit Workout' : 'Log New Workout'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" placeholder="Workout Name" required 
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <select 
                                style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Strength">Strength</option>
                                <option value="Cardio">Cardio</option>
                                <option value="HIIT">HIIT</option>
                                <option value="Flexibility">Flexibility</option>
                            </select>

                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Exercises</h4>
                            {formData.exercises.map((ex, index) => (
                                <div key={index} style={{ backgroundColor: 'var(--bg-main)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
                                    <input name="name" placeholder="Exercise Name" required value={ex.name} onChange={(e) => handleExerciseChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box', marginBottom: '10px' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                        <div>
                                            <label style={{ fontSize: '11px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Sets</label>
                                            <input name="sets" placeholder="3" type="number" required value={ex.sets} onChange={(e) => handleExerciseChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Reps</label>
                                            <input name="reps" placeholder="10" type="number" required value={ex.reps} onChange={(e) => handleExerciseChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11px', display: 'block', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Weight (kg)</label>
                                            <input name="weight" placeholder="0" type="number" required value={ex.weight} onChange={(e) => handleExerciseChange(index, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddExercise} style={{ marginBottom: '25px', background: 'none', border: '1px dashed var(--border-color)', color: 'var(--text-primary)', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Another Exercise</button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, backgroundColor: '#00d2ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Update Workout' : 'Save Workout'}</button>
                                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setFormData({ name: '', category: 'Strength', notes: '', exercises: [{ name: '', sets: '', reps: '', weight: '' }] }); }} style={{ flex: 1, backgroundColor: '#f3f6f9', color: '#7e8299', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workouts;
