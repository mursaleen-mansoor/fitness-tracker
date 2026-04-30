import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMusic, FaPlay, FaPause, FaStepForward, FaStepBackward, FaWaveSquare } from 'react-icons/fa';

const NeuralLinkPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    
    const tracks = [
        { title: 'BINAURAL ALPHA', type: 'Focus Engine', dur: '∞' },
        { title: 'DELTA RECOVERY', type: 'Sleep Protocol', dur: '∞' },
        { title: 'CYBER-STRENGTH', type: 'Combat Protocol', dur: '∞' }
    ];

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.8 }}
                        style={{ 
                            width: '300px', 
                            background: '#0a0a0a', 
                            border: '1px solid #39ff14', 
                            borderRadius: '12px', 
                            padding: '20px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                            marginBottom: '20px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: isPlaying ? '#39ff14' : '#222' }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ width: '50px', height: '50px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39ff14' }}>
                                <FaWaveSquare className={isPlaying ? 'pulse-audio' : ''} />
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', fontWeight: '900', letterSpacing: '2px' }}>NEURAL LINK ACTIVE</div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#39ff14' }}>{tracks[currentTrack].title}</div>
                                <div style={{ fontSize: '10px', color: '#444' }}>{tracks[currentTrack].type}</div>
                            </div>
                        </div>

                        {/* Waveform Visualization (Mock) */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '30px', marginBottom: '20px' }}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ height: isPlaying ? [10, 25, 15, 30, 10][i % 5] : 5 }}
                                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                                    style={{ flex: 1, background: isPlaying ? '#39ff14' : '#222', borderRadius: '1px' }}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
                            <FaStepBackward style={{ color: '#444', cursor: 'pointer' }} />
                            <button onClick={togglePlay} style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#39ff14', border: 'none', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <FaStepForward style={{ color: '#444', cursor: 'pointer' }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: '#0a0a0a', 
                    border: '2px solid #39ff14', 
                    color: '#39ff14', 
                    fontSize: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
                }}
            >
                <FaMusic />
            </motion.button>

            <style>{`
                @keyframes pulse-audio {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .pulse-audio { animation: pulse-audio 1s infinite; }
            `}</style>
        </div>
    );
};

export default NeuralLinkPlayer;
