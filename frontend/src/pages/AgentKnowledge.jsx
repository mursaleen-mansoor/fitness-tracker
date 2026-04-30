import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaPlus, FaEdit, FaTrash, FaSearch, FaStar, 
    FaExclamationCircle, FaBook, FaFilter, FaTimes 
} from 'react-icons/fa';

const AgentKnowledge = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '' });
    const [showModal, setShowModal] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({ title: '', category: 'Other', content: '', tags: '' });
    const [isEditing, setIsEditing] = useState(false);

    const categories = ['Workout Tracking', 'Nutrition Log', 'Progress Tracking', 'Account / Profile Issue', 'Notification Problem', 'Export / Report Issue', 'Other'];

    useEffect(() => {
        fetchArticles();
    }, [filters]);

    const fetchArticles = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const { data } = await axios.get(`/api/agent/knowledge?${queryParams}`);
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                ...currentArticle, 
                tags: typeof currentArticle.tags === 'string' ? currentArticle.tags.split(',').map(t => t.trim()) : currentArticle.tags 
            };
            if (isEditing) {
                await axios.put(`/api/agent/knowledge/${currentArticle._id}`, payload);
            } else {
                await axios.post('/api/agent/knowledge', payload);
            }
            setShowModal(false);
            setCurrentArticle({ title: '', category: 'Other', content: '', tags: '' });
            fetchArticles();
        } catch (error) {
            alert('Error saving article');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await axios.delete(`/api/agent/knowledge/${id}`);
            fetchArticles();
        } catch (error) {
            alert('Error deleting article');
        }
    };

    const openEdit = (article) => {
        setCurrentArticle({ ...article, tags: article.tags.join(', ') });
        setIsEditing(true);
        setShowModal(true);
    };

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#181c32', margin: 0, letterSpacing: '-0.5px' }}>Knowledge Repository</h1>
                    <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px' }}>Publish and manage help articles for the fitness community</p>
                </div>
                <button 
                    onClick={() => { setCurrentArticle({ title: '', category: 'Other', content: '', tags: '' }); setIsEditing(false); setShowModal(true); }}
                    style={{ padding: '14px 28px', backgroundColor: '#8950fc', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)', transition: 'all 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <FaPlus /> Create New Article
                </button>
            </div>

            {/* Filters Bar */}
            <div style={{ 
                backgroundColor: '#fff', 
                padding: '25px', 
                borderRadius: '20px', 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                alignItems: 'center'
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <FaSearch style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#a1a5b7' }} />
                    <input 
                        type="text" 
                        placeholder="Search by keyword, title or tags..." 
                        style={{ width: '100%', padding: '14px 18px 14px 48px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '14px', transition: 'all 0.3s' }}
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#b5b5c3' }}><FaFilter /></div>
                    <select 
                        style={{ padding: '14px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', color: '#3f4254', minWidth: '220px', fontSize: '14px', fontWeight: '600' }}
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Articles List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#8950fc', fontWeight: '800' }}>
                    <div className="animate-pulse">Accessing knowledge base...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
                    {articles.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#b5b5c3' }}>No articles found for your criteria.</div>
                    ) : articles.map(article => (
                        <div key={article._id} style={{ 
                            backgroundColor: '#fff', 
                            padding: '30px', 
                            borderRadius: '24px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: '#8950fc', backgroundColor: '#eee5ff', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{article.category}</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => openEdit(article)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#e1f0ff', color: '#3699ff', cursor: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3699ff' + '22'}><FaEdit size={12} /></button>
                                    <button onClick={() => handleDelete(article._id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#ffe2e5', color: '#f64e60', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><FaTrash size={12} /></button>
                                </div>
                            </div>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#181c32', fontWeight: '800', lineHeight: '1.3' }}>{article.title}</h3>
                            <p style={{ fontSize: '15px', color: '#7e8299', lineHeight: '1.6', height: '72px', overflow: 'hidden', marginBottom: '20px' }}>{article.content}</p>
                            
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f6f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#ffa800', fontWeight: '900' }}>
                                        <FaStar /> {article.averageRating.toFixed(1)}
                                    </div>
                                    {article.averageRating < 3 && article.averageRating > 0 && <span style={{ color: '#f64e60' }} title="Needs Review"><FaExclamationCircle size={14} /></span>}
                                </div>
                                <div style={{ fontSize: '12px', color: '#b5b5c3', fontWeight: '700', backgroundColor: '#f9f9fb', padding: '4px 10px', borderRadius: '6px' }}>
                                    {article.helpfulCount} helpful responses
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(24, 28, 50, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '28px', width: '650px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ padding: '12px', backgroundColor: '#eee5ff', color: '#8950fc', borderRadius: '12px' }}><FaBook size={20} /></div>
                                <h3 style={{ margin: 0, color: '#181c32', fontSize: '24px', fontWeight: '800' }}>{isEditing ? 'Edit Article' : 'New Publication'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', color: '#b5b5c3', cursor: 'pointer', fontSize: '20px' }}><FaTimes /></button>
                        </div>
                        
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Article Title</label>
                                <input 
                                    type="text" required 
                                    placeholder="Enter a descriptive title..."
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '500', boxSizing: 'border-box' }}
                                    value={currentArticle.title}
                                    onChange={(e) => setCurrentArticle({...currentArticle, title: e.target.value})}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                                <select 
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '600', color: '#3f4254' }}
                                    value={currentArticle.category}
                                    onChange={(e) => setCurrentArticle({...currentArticle, category: e.target.value})}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Article Content</label>
                                <textarea 
                                    required 
                                    placeholder="Write detailed helpful content for users..."
                                    style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '500', height: '220px', resize: 'none', boxSizing: 'border-box', lineHeight: '1.6' }}
                                    value={currentArticle.content}
                                    onChange={(e) => setCurrentArticle({...currentArticle, content: e.target.value})}
                                />
                            </div>

                            <div style={{ marginBottom: '35px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#3f4254', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search Tags</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. nutrition, workout, troubleshooting..."
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '15px', fontWeight: '500', boxSizing: 'border-box' }}
                                    value={currentArticle.tags}
                                    onChange={(e) => setCurrentArticle({...currentArticle, tags: e.target.value})}
                                />
                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#b5b5c3' }}>Separate tags with commas to improve search accuracy.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #f3f6f9', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '800', color: '#7e8299' }}>Discard</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#8950fc', color: '#fff', cursor: 'pointer', fontWeight: '800', boxShadow: '0 10px 20px rgba(137, 80, 252, 0.2)' }}>{isEditing ? 'Update Article' : 'Publish Article'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentKnowledge;
