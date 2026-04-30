import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBook, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaLayerGroup, FaQuoteLeft } from 'react-icons/fa';

const AdminKnowledge = () => {
    const [articles, setArticles] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('articles');

    const fetchData = async () => {
        try {
            const [artRes, tempRes] = await Promise.all([
                axios.get('/api/admin/knowledge'),
                axios.get('/api/admin/templates')
            ]);
            setArticles(artRes.data);
            setTemplates(tempRes.data);
        } catch (error) {
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleArticle = async (id) => {
        try {
            await axios.put(`/api/admin/knowledge/${id}/toggle`);
            toast.success('Status updated');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#181c32', margin: 0 }}>Content & Resources</h1>
                    <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '500' }}>Moderate knowledge base articles and manage support response templates</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', borderBottom: '1px solid #e1e1e1' }}>
                <button onClick={() => setTab('articles')} style={{ padding: '15px 5px', border: 'none', background: 'none', color: tab === 'articles' ? '#8950fc' : '#b5b5c3', fontWeight: '800', borderBottom: tab === 'articles' ? '3px solid #8950fc' : '3px solid transparent', cursor: 'pointer' }}>ARTICLES ({articles.length})</button>
                <button onClick={() => setTab('templates')} style={{ padding: '15px 5px', border: 'none', background: 'none', color: tab === 'templates' ? '#8950fc' : '#b5b5c3', fontWeight: '800', borderBottom: tab === 'templates' ? '3px solid #8950fc' : '3px solid transparent', cursor: 'pointer' }}>TEMPLATES ({templates.length})</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#8950fc' }}>Syncing repository...</div>
            ) : tab === 'articles' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                    {articles.map((art) => (
                        <div key={art._id} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: '#8950fc', backgroundColor: '#eee5ff', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>{art.category}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => toggleArticle(art._id)} style={{ border: 'none', background: 'none', color: art.published ? '#1bc5bd' : '#f64e60', cursor: 'pointer' }}>{art.published ? <FaCheckCircle title="Published" /> : <FaTimesCircle title="Draft" />}</button>
                                </div>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800', color: '#181c32' }}>{art.title}</h4>
                            <p style={{ fontSize: '14px', color: '#7e8299', lineHeight: '1.5', height: '60px', overflow: 'hidden' }}>{art.content}</p>
                            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f3f6f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <div style={{ color: '#b5b5c3', fontWeight: '700' }}>By: <span style={{ color: '#3f4254' }}>{art.authorId?.name}</span></div>
                                <div style={{ color: '#ffa800', fontWeight: '900' }}>★ {art.averageRating.toFixed(1)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                    {templates.map((temp) => (
                        <div key={temp._id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', borderLeft: '5px solid #8950fc' }}>
                            <div style={{ color: '#b5b5c3', fontSize: '20px', marginBottom: '10px' }}><FaQuoteLeft /></div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#181c32', fontSize: '16px', fontWeight: '800' }}>{temp.title}</h4>
                            <p style={{ fontSize: '13px', color: '#7e8299', lineHeight: '1.4' }}>{temp.body}</p>
                            <div style={{ marginTop: '15px', fontSize: '11px', fontWeight: '900', color: '#8950fc', textTransform: 'uppercase' }}>{temp.category}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminKnowledge;
