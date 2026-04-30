import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaBolt, FaSatellite, FaBroadcastTower } from 'react-icons/fa';

const GlobalHeatmap = () => {
    const [intensityPoints, setIntensityPoints] = useState([]);

    useEffect(() => {
        // Generate simulated real-time data points
        const points = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 800 + 50,
            y: Math.random() * 400 + 50,
            intensity: Math.random() * 50 + 20
        }));
        setIntensityPoints(points);

        const interval = setInterval(() => {
            setIntensityPoints(prev => prev.map(p => ({
                ...p,
                intensity: Math.random() * 50 + 20,
                active: Math.random() > 0.3
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '20px', overflow: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
                .map-grid { stroke: rgba(57, 255, 20, 0.05); stroke-width: 1; }
                .pulse { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '50px', margin: 0 }}>
                        GLOBAL <span className="text-neon">METABOLIC GRID</span>
                    </h1>
                    <p style={{ color: '#666', letterSpacing: '4px', fontWeight: '800', fontSize: '12px' }}>REAL-TIME OPERATIVE DENSITY SCAN</p>
                </div>
                <div style={{ textAlign: 'right', color: '#39ff14' }}>
                    <div style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px' }}>SATELLITE LINK: ESTABLISHED</div>
                    <div style={{ fontSize: '24px' }} className="font-display">94,102 ACTIVE SIGNALS</div>
                </div>
            </header>

            <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '40px', boxShadow: '0 0 50px rgba(0,0,0,1)' }}>
                {/* HUD Overlays */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#444', fontSize: '12px', fontWeight: '900' }}>COORD SCAN: 51.5074° N, 0.1278° W</div>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#444', fontSize: '12px', fontWeight: '900' }}>ENCRYPTION: AES-256-GCM</div>

                <svg viewBox="0 0 1000 500" style={{ width: '100%', height: 'auto' }}>
                    {/* Grid Lines */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" className="map-grid" />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} className="map-grid" />
                    ))}

                    {/* Simple World Map Outline (Mock) */}
                    <path d="M150,100 Q200,80 250,120 T350,100 T450,150 T600,120 T800,180 L850,300 Q800,400 700,380 T500,420 T300,350 T150,300 Z" fill="none" stroke="rgba(57,255,20,0.1)" strokeWidth="2" strokeDasharray="10 5" />

                    {/* Data Points */}
                    {intensityPoints.map((p) => (
                        <g key={p.id}>
                            <motion.circle 
                                cx={p.x} cy={p.y} r={p.intensity / 2} 
                                fill="#39ff14" fillOpacity={0.2} 
                                animate={{ r: p.active ? p.intensity / 2 : 0 }}
                            />
                            <motion.circle 
                                cx={p.x} cy={p.y} r={2} 
                                fill="#39ff14"
                                animate={{ opacity: p.active ? 1 : 0.2 }}
                            />
                            {p.active && (
                                <circle cx={p.x} cy={p.y} r={p.intensity} className="pulse" fill="none" stroke="#39ff14" strokeWidth="1" />
                            )}
                        </g>
                    ))}
                </svg>

                {/* Legend */}
                <div style={{ marginTop: '40px', display: 'flex', gap: '30px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#666' }}>
                        <div style={{ width: '10px', height: '10px', background: '#39ff14', borderRadius: '50%' }}></div> HIGH INTENSITY
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#666' }}>
                        <div style={{ width: '10px', height: '10px', background: 'rgba(57,255,20,0.2)', borderRadius: '50%' }}></div> PASSIVE SIGNAL
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#666' }}>
                        <FaSatellite style={{ color: '#39ff14' }} /> SYNCED RELAY
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalHeatmap;
