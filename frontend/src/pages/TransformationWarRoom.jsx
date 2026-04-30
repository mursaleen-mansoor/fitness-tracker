import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaExchangeAlt, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TransformationWarRoom = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        imageUrl: '',
        weight: '',
        bodyFat: '',
        label: ''
    });

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/transformations');
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelect = (photo) => {
        if (selectedPhotos.find(p => p._id === photo._id)) {
            setSelectedPhotos(selectedPhotos.filter(p => p._id !== photo._id));
        } else if (selectedPhotos.length < 2) {
            setSelectedPhotos([...selectedPhotos, photo]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/transformations', formData);
            toast.success('Evidence Captured');
            setShowUploadModal(false);
            setFormData({ imageUrl: '', weight: '', bodyFat: '', label: '' });
            fetchData();
        } catch (error) {
            toast.error('Upload Failed');
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>ACCESSING ARCHIVES...</div>;

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .photo-card { background: #111; border: 1px solid #222; border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; transition: all 0.3s; }
                .photo-card:hover { border-color: #39ff14; transform: translateY(-5px); }
                .photo-selected { border-color: #39ff14; box-shadow: 0 0 20px rgba(57, 255, 20, 0.2); }
                .scan-line { position: absolute; width: 100%; height: 2px; background: #39ff14; opacity: 0.5; top: 0; animation: scan 3s linear infinite; pointer-events: none; }
                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        TRANSFORMATION <span className="text-neon">WAR ROOM</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '2px', fontWeight: '800', fontSize: '12px' }}>VISUAL PROGRESS ARCHIVE</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={() => setCompareMode(!compareMode)} 
                        style={{ 
                            background: compareMode ? '#39ff14' : 'transparent', 
                            color: compareMode ? 'black' : '#39ff14', 
                            border: '1px solid #39ff14', 
                            padding: '12px 25px', 
                            borderRadius: '4px', 
                            fontWeight: '900', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <FaExchangeAlt /> {compareMode ? 'EXIT SCAN' : 'INITIATE SCAN'}
                    </button>
                    <button onClick={() => setShowUploadModal(true)} style={{ background: '#39ff14', color: 'black', border: 'none', padding: '12px 25px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCamera /> CAPTURE EVIDENCE
                    </button>
                </div>
            </header>

            {compareMode && selectedPhotos.length === 2 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    style={{ background: '#111', padding: '40px', borderRadius: '20px', marginBottom: '50px', border: '2px solid #39ff14', position: 'relative' }}
                >
                    <div className="scan-line" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {selectedPhotos.map((photo, i) => (
                            <div key={photo._id} style={{ textAlign: 'center' }}>
                                <div className="font-display text-neon" style={{ fontSize: '24px', marginBottom: '15px' }}>{i === 0 ? 'BASELINE' : 'CURRENT STATUS'}</div>
                                <img src={photo.imageUrl} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#666', fontWeight: '800' }}>WEIGHT</div>
                                        <div className="font-display" style={{ fontSize: '24px' }}>{photo.weight} KG</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#666', fontWeight: '800' }}>BODY FAT</div>
                                        <div className="font-display" style={{ fontSize: '24px' }}>{photo.bodyFat}%</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#666', fontWeight: '800' }}>DATE</div>
                                        <div className="font-display" style={{ fontSize: '24px' }}>{new Date(photo.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {photos.map((photo) => (
                    <div 
                        key={photo._id} 
                        className={`photo-card ${selectedPhotos.find(p => p._id === photo._id) ? 'photo-selected' : ''}`}
                        onClick={() => compareMode && handleSelect(photo)}
                    >
                        <img src={photo.imageUrl} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                        <div style={{ padding: '20px' }}>
                            <div className="font-display" style={{ fontSize: '18px' }}>{photo.label || 'UNCATEGORIZED SIGNAL'}</div>
                            <div style={{ fontSize: '12px', color: '#666', fontWeight: '700', marginTop: '5px' }}>{new Date(photo.date).toLocaleDateString()}</div>
                        </div>
                        {selectedPhotos.find(p => p._id === photo._id) && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#39ff14', color: 'black', padding: '5px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '900' }}>
                                SELECTED
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#111', border: '1px solid #39ff14', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '450px' }}>
                        <h2 className="font-display text-neon" style={{ fontSize: '30px', marginBottom: '30px' }}>NEW ARCHIVE SIGNAL</h2>
                        <form onSubmit={handleUpload}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>IMAGE URL (SIMULATED UPLOAD)</label>
                                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} placeholder="https://..." required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>WEIGHT (KG)</label>
                                    <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>BODY FAT %</label>
                                    <input type="number" value={formData.bodyFat} onChange={(e) => setFormData({...formData, bodyFat: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>SIGNAL LABEL</label>
                                <input type="text" value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', color: 'white', outline: 'none' }} placeholder="e.g. Month 6 Check-in" />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #444', color: '#444', fontWeight: '900', cursor: 'pointer' }}>ABORT</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', background: '#39ff14', border: 'none', color: 'black', fontWeight: '900', cursor: 'pointer' }}>TRANSMIT</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TransformationWarRoom;
