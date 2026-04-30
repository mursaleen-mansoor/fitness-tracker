import { motion } from 'framer-motion';

const BodyVisualizer = ({ selectedMuscle, onMuscleClick, view = 'front' }) => {
    const hudColor = '#39ff14';
    
    const muscles = {
        front: [
            { id: 'abs', name: 'waist', d: "M85 110 L115 110 L115 190 L85 190 Z" },
            { id: 'chest', name: 'chest', d: "M70 60 L130 60 L130 100 L100 110 L70 100 Z" },
            { id: 'quads', name: 'upper legs', d: "M85 200 L95 200 L95 280 L85 280 Z M105 200 L115 200 L115 280 L105 280 Z" },
            { id: 'shoulders', name: 'shoulders', d: "M60 60 L70 60 L75 80 L65 80 Z M125 60 L140 60 L135 80 L125 80 Z" },
            { id: 'biceps', name: 'upper arms', d: "M55 85 L65 85 L60 130 L50 130 Z M135 85 L145 85 L150 130 L140 130 Z" },
            { id: 'forearms', name: 'lower arms', d: "M45 140 L55 140 L50 190 L40 190 Z M145 140 L155 140 L160 190 L150 190 Z" },
            { id: 'calves', name: 'lower legs', d: "M85 290 L95 290 L95 360 L85 360 Z M105 290 L115 290 L115 360 L105 360 Z" }
        ],
        back: [
            { id: 'back', name: 'back', d: "M70 60 L130 60 L130 150 L100 160 L70 150 Z" },
            { id: 'glutes', name: 'upper legs', d: "M85 190 L115 190 L115 230 L85 230 Z" },
            { id: 'hamstrings', name: 'upper legs', d: "M85 240 L95 240 L95 320 L85 320 Z M105 240 L115 240 L115 320 L105 320 Z" },
            { id: 'triceps', name: 'upper arms', d: "M55 85 L65 85 L60 130 L50 130 Z M135 85 L145 85 L150 130 L140 130 Z" }
        ]
    };

    return (
        <div style={{ position: 'relative', width: '300px', height: '450px', background: 'rgba(57, 255, 20, 0.02)', borderRadius: '20px', border: '1px solid rgba(57, 255, 20, 0.1)', padding: '20px' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '2px' }}>
                BIOMETRIC_VISUALIZER_v4.0
            </div>
            
            <svg viewBox="0 0 200 400" style={{ width: '100%', height: '100%' }}>
                {/* Basic Human Frame */}
                <g stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth="1">
                    <circle cx="100" cy="30" r="15" />
                    <path d="M100 45 L100 200 M100 200 L80 380 M100 200 L120 380 M100 80 L50 180 M100 80 L150 180" />
                </g>

                {/* Interactive Muscle Groups */}
                {muscles[view].map((muscle) => (
                    <motion.path
                        key={muscle.id}
                        d={muscle.d}
                        fill={selectedMuscle === muscle.name ? hudColor : 'rgba(255,255,255,0.1)'}
                        stroke={selectedMuscle === muscle.name ? 'white' : 'rgba(255,255,255,0.2)'}
                        strokeWidth="1"
                        style={{ cursor: 'pointer', filter: selectedMuscle === muscle.name ? `drop-shadow(0 0 8px ${hudColor})` : 'none' }}
                        whileHover={{ fill: 'rgba(57, 255, 20, 0.4)' }}
                        onClick={() => onMuscleClick(muscle.name)}
                    />
                ))}

                {/* Scanline Effect */}
                <motion.line 
                    x1="0" y1="0" x2="200" y2="0" 
                    stroke={hudColor} strokeWidth="0.5" opacity="0.3"
                    animate={{ y: [0, 400, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
            </svg>

            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                <div style={{ fontSize: '8px', color: '#333', fontWeight: '900' }}>FRONT_MAP</div>
                <div style={{ width: '20px', height: '2px', background: view === 'front' ? hudColor : '#222' }} />
                <div style={{ width: '20px', height: '2px', background: view === 'back' ? hudColor : '#222' }} />
                <div style={{ fontSize: '8px', color: '#333', fontWeight: '900' }}>REAR_MAP</div>
            </div>
        </div>
    );
};

export default BodyVisualizer;
