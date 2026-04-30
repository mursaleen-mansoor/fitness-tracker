import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaQuoteLeft, FaTimes, FaLayerGroup } from 'react-icons/fa';

const AgentTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({ title: '', body: '', category: 'General' });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data } = await axios.get('/api/agent/templates');
            setTemplates(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/agent/templates/${current._id}`, current);
            } else {
                await axios.post('/api/agent/templates', current);
            }
            setShowModal(false);
            fetchTemplates();
        } catch (e) { alert('Error saving template'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await axios.delete(`/api/agent/templates/${id}`);
            fetchTemplates();
        } catch (e) { alert('Error deleting'); }
    };

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#181c32', margin: 0, letterSpacing: '-0.5px' }}>Response Templates</h1>
                    <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px' }}>Standardize your communication with pre-written smart replies</p>
                </div>
                <button 
                    onClick={() => { setCurrent({ title: '', body: '', category: 'General' }); setIsEditing(false); setShowModal(true); }}
                    style={{ padding: '14px 28px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)' }}
                >
                    <FaPlus /> New Template
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#8950fc' }}>Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#b5b5c3' }}>No templates created yet.</div>
                ) : templates.map(t => (
                    <div key={t._id} style={{ 
                        backgroundColor: '#fff', 
                        padding: '30px', 
                        borderRadius: '24px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s',
                        border: '1px solid transparent'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#8950fc22';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#3699ff', backgroundColor: '#e1f0ff', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase' }}>{t.category}</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => { setCurrent(t); setIsEditing(true); setShowModal(true); }} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#f3f6f9', color: '#3699ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaEdit size={12} /></button>
                                <button onClick={() => handleDelete(t._id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#ffe2e5', color: '#f64e60', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTrash size={12} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ color: '#eee', fontSize: '24px' }}><FaQuoteLeft /></div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 12px 0', color: '#181c32', fontSize: '18px', fontWeight: '800' }}>{t.title}</h4>
                                <p style={{ fontSize: '14px', color: '#7e8299', lineHeight: '1.6', height: '84px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{t.body}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(24, 28, 50, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '28px', width: '550px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ padding: '12px', backgroundColor: '#eee5ff', color: '#8950fc', borderRadius: '12px' }}><FaLayerGroup size={20} /></div>
                                <h3 style={{ margin: 0, color: '#181c32', fontSize: '24px', fontWeight: '800' }}>{isEditing ? 'Edit Template' : 'New Template'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', color: '#b5b5c3', cursor: 'pointer', fontSize: '20px' }}><FaTimes /></button>
                        </div>
                        
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Template Title</label>
                                <input 
                                    type="text" placeholder="e.g. Account Verification Issue" required 
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '500', boxSizing: 'border-box' }}
                                    value={current.title} onChange={(e) => setCurrent({...current, title: e.target.value})}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Category</label>
                                <select 
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '600', color: '#3f4254' }}
                                    value={current.category} onChange={(e) => setCurrent({...current, category: e.target.value})}
                                >
                                    <option>General</option>
                                    <option>Account</option>
                                    <option>Workouts</option>
                                    <option>Nutrition</option>
                                    <option>Progress</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Response Message</label>
                                <textarea 
                                    placeholder="Write the standard response here..." required 
                                    style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '500', height: '180px', resize: 'none', boxSizing: 'border-box', lineHeight: '1.6' }}
                                    value={current.body} onChange={(e) => setCurrent({...current, body: e.target.value})}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '800', color: '#7e8299' }}>Discard</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#8950fc', color: '#fff', cursor: 'pointer', fontWeight: '800', boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)' }}>Save Template</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentTemplates;
