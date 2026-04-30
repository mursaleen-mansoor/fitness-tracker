import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaHeart, FaRegHeart, FaInfoCircle, FaTimes, FaDumbbell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('fav_exercises') || '[]'));
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    
    // Filters
    const [filters, setFilters] = useState({
        bodyPart: 'all',
        target: 'all',
        equipment: 'all'
    });

    const bodyParts = ['all', 'back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
    const equipments = ['all', 'assisted', 'band', 'barbell', 'body weight', 'dumbbell', 'elliptical machine', 'ez barbell', 'hammer', 'kettlebell', 'lever machine', 'medicine ball', 'olympic barbell', 'resistance band', 'roller', 'rope', 'skierg machine', 'sled machine', 'smith machine', 'stability ball', 'stationary bike', 'stepper', 'suspension setting', 'tire', 'trap bar', 'upper body ergometer', 'weighted', 'wheel roller'];

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        applyFilters();
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchQuery, filters, exercises, showOnlyFavorites]);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/exercises');
            const data = Array.isArray(response.data) ? response.data : (response.data.exercises || []);
            setExercises(data);
            setFilteredExercises(data);
            setError(null);
        } catch (err) {
            setError('FAILED TO ESTABLISH SATELLITE LINK TO EXERCISE DATABASE');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = Array.isArray(exercises) ? exercises : [];

        if (showOnlyFavorites) {
            result = result.filter(ex => favorites.some(f => f.id === ex.id));
        }

        if (searchQuery) {
            result = result.filter(ex => ex.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (filters.bodyPart !== 'all') {
            result = result.filter(ex => ex.bodyPart === filters.bodyPart);
        }

        if (filters.target !== 'all') {
            result = result.filter(ex => ex.target === filters.target);
        }

        if (filters.equipment !== 'all') {
            result = result.filter(ex => ex.equipment === filters.equipment);
        }

        setFilteredExercises(result);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

    const toggleFavorite = (exercise) => {
        let newFavs;
        if (favorites.some(f => f.id === exercise.id)) {
            newFavs = favorites.filter(f => f.id !== exercise.id);
            toast.error('REMOVED FROM FAVORITE PROTOCOLS');
        } else {
            newFavs = [...favorites, exercise];
            toast.success('SAVED TO TACTICAL FAVORITES');
        }
        setFavorites(newFavs);
        localStorage.setItem('fav_exercises', JSON.stringify(newFavs));
    };

    const hudColor = '#39ff14';

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '30px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: ${hudColor}; text-shadow: 0 0 10px ${hudColor}66; }
                .hud-card { background: #0a0a0a; border: 1px solid #1a1a1a; transition: all 0.3s; position: relative; overflow: hidden; border-radius: 12px; }
                .hud-card:hover { border-color: ${hudColor}; transform: translateY(-5px); box-shadow: 0 5px 20px rgba(57, 255, 20, 0.1); }
                .filter-select { background: #111; border: 1px solid #222; color: white; padding: 10px; border-radius: 4px; font-family: 'Inter', sans-serif; }
                .filter-select:focus { border-color: ${hudColor}; outline: none; }
                .search-input { background: #111; border: 1px solid #222; color: white; padding: 12px 40px; border-radius: 8px; width: 100%; font-size: 16px; }
                .search-input:focus { border-color: ${hudColor}; outline: none; }
                @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
                .scanline { position: absolute; width: 100%; height: 2px; background: ${hudColor}1a; top: 0; animation: scanline 4s linear infinite; pointer-events: none; }
                .page-btn { background: #111; border: 1px solid #222; color: #666; padding: 8px 15px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
                .page-btn:hover:not(:disabled) { border-color: ${hudColor}; color: ${hudColor}; }
                .page-btn.active { background: ${hudColor}; color: black; border-color: ${hudColor}; }
                .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            `}</style>

            <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        TACTICAL <span className="text-neon">EXERCISE DATABASE</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '4px', fontWeight: '800', fontSize: '12px' }}>CORE DATASET: v1.0.4 - GLOBAL SYNC ACTIVE</p>
                </div>
                <button 
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    style={{ background: showOnlyFavorites ? hudColor : 'transparent', border: `1px solid ${hudColor}`, color: showOnlyFavorites ? 'black' : hudColor, padding: '10px 20px', borderRadius: '8px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    {showOnlyFavorites ? <FaHeart /> : <FaRegHeart />} {showOnlyFavorites ? 'SHOWING FAVORITES' : 'VIEW FAVORITES'}
                </button>
            </header>

            {/* Search and Filters */}
            <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                    <input 
                        type="text" 
                        placeholder="SEARCH EXERCISE NAME..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFilter style={{ color: hudColor, fontSize: '12px' }} />
                        <select className="filter-select" value={filters.bodyPart} onChange={(e) => setFilters({...filters, bodyPart: e.target.value})}>
                            {bodyParts.map(bp => <option key={bp} value={bp}>{bp.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <select className="filter-select" value={filters.equipment} onChange={(e) => setFilters({...filters, equipment: e.target.value})}>
                        {equipments.map(eq => <option key={eq} value={eq}>{eq.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'inline-block' }}>
                        <FaDumbbell style={{ fontSize: '50px', color: hudColor }} />
                    </motion.div>
                    <p className="font-display" style={{ marginTop: '20px', letterSpacing: '2px' }}>SYNCING WITH SATELLITE ARRAY...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '50px', border: '1px solid #ff0000', background: 'rgba(255,0,0,0.05)', borderRadius: '12px' }}>
                    <h3 className="font-display" style={{ color: '#ff0000', fontSize: '24px' }}>{error}</h3>
                    <button onClick={fetchExercises} style={{ marginTop: '20px', background: '#ff0000', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '900' }}>RETRY UPLINK</button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {currentExercises.length > 0 ? (
                            currentExercises.map((ex) => (
                                <motion.div 
                                    key={ex.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="hud-card"
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                    <div className="scanline" />
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#111' }}>
                                        <img 
                                            src={ex.gifUrl} 
                                            alt={ex.name} 
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                                            loading="lazy"
                                        />
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                                            <button 
                                                onClick={() => toggleFavorite(ex)}
                                                style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: favorites.some(f => f.id === ex.id) ? hudColor : 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                {favorites.some(f => f.id === ex.id) ? <FaHeart /> : <FaRegHeart />}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 className="font-display" style={{ margin: '0 0 10px 0', fontSize: '20px', color: hudColor }}>{ex.name}</h3>
                                        
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                            <span style={{ fontSize: '10px', padding: '4px 8px', background: '#222', borderRadius: '4px', fontWeight: '800' }}>{ex.target?.toUpperCase() || 'N/A'}</span>
                                            <span style={{ fontSize: '10px', padding: '4px 8px', background: '#222', borderRadius: '4px', fontWeight: '800' }}>{ex.equipment?.toUpperCase() || 'N/A'}</span>
                                        </div>

                                        <button 
                                            onClick={() => setSelectedExercise(ex)}
                                            style={{ marginTop: 'auto', width: '100%', background: 'transparent', border: '1px solid #333', color: '#666', padding: '10px', borderRadius: '4px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                        >
                                            <FaInfoCircle /> VIEW TACTICAL SPECS
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', border: '1px dashed #222', borderRadius: '12px' }}>
                                <h3 className="font-display" style={{ color: '#444', fontSize: '24px' }}>NO DATA SIGNALS DETECTED IN THIS SECTOR</h3>
                                <p style={{ color: '#333', fontSize: '12px' }}>ADJUST FILTERS OR CHECK SATELLITE CONNECTION</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <button 
                                className="page-btn" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <FaChevronLeft />
                            </button>
                            
                            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', maxWidth: '300px', padding: '10px' }}>
                                {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button 
                                            key={pageNum}
                                            className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 10 && <span style={{ color: '#444' }}>...</span>}
                            </div>

                            <button 
                                className="page-btn" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <FaChevronRight />
                            </button>

                            <div style={{ fontSize: '12px', color: '#444', marginLeft: '20px', fontWeight: '900' }}>
                                PAGE {currentPage} OF {totalPages}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedExercise && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedExercise(null)}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)' }}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ position: 'relative', width: '100%', maxWidth: '800px', background: '#0a0a0a', border: `1px solid ${hudColor}`, borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
                        >
                            <div style={{ background: '#111', position: 'relative' }}>
                                <img src={selectedExercise.gifUrl} alt={selectedExercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div className="scanline" />
                            </div>

                            <div style={{ padding: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h2 className="font-display" style={{ fontSize: '32px', margin: 0, color: hudColor }}>{selectedExercise.name}</h2>
                                        <div style={{ fontSize: '12px', color: '#666', letterSpacing: '2px', fontWeight: '800' }}>EXERCISE_ID: {selectedExercise.id}</div>
                                    </div>
                                    <button onClick={() => setSelectedExercise(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer' }}><FaTimes /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '1px' }}>TARGET MUSCLE</div>
                                        <div className="font-display" style={{ fontSize: '20px' }}>{selectedExercise.target || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '1px' }}>EQUIPMENT</div>
                                        <div className="font-display" style={{ fontSize: '20px' }}>{selectedExercise.equipment || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '1px' }}>BODY PART</div>
                                        <div className="font-display" style={{ fontSize: '20px' }}>{selectedExercise.bodyPart || 'N/A'}</div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
                                    <div style={{ fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '1px', marginBottom: '10px' }}>EXECUTION STEPS</div>
                                    <ul style={{ paddingLeft: '20px', color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                                        <li>Position body according to the visual guidance.</li>
                                        <li>Maintain controlled eccentric movement.</li>
                                        <li>Focus on target muscle contraction ({selectedExercise.target}).</li>
                                        <li>Ensure proper respiratory protocol.</li>
                                    </ul>
                                </div>

                                <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                                    <button 
                                        onClick={() => toggleFavorite(selectedExercise)}
                                        style={{ flex: 1, padding: '15px', background: favorites.some(f => f.id === selectedExercise.id) ? '#222' : hudColor, color: favorites.some(f => f.id === selectedExercise.id) ? hudColor : 'black', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        <FaHeart /> {favorites.some(f => f.id === selectedExercise.id) ? 'FAVORITED' : 'ADD TO FAVORITES'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExerciseLibrary;
