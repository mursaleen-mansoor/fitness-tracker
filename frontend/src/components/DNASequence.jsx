import { motion } from 'framer-motion';

const DNASequence = ({ color = '#39ff14' }) => {
    const dots = Array.from({ length: 20 });

    return (
        <div style={{ width: '100px', height: '250px', position: 'relative', overflow: 'hidden' }}>
            <style>{`
                .dna-dot { width: 6px; height: 6px; border-radius: 50%; position: absolute; }
                .dna-line { width: 100%; height: 1px; position: absolute; opacity: 0.2; }
            `}</style>
            {dots.map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${i * 12}px`, width: '100%', height: '10px' }}>
                    {/* Helix A */}
                    <motion.div 
                        className="dna-dot"
                        animate={{ 
                            left: ['20%', '80%', '20%'],
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.15, ease: "easeInOut" }}
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                    />
                    {/* Helix B */}
                    <motion.div 
                        className="dna-dot"
                        animate={{ 
                            left: ['80%', '20%', '80%'],
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.15, ease: "easeInOut" }}
                        style={{ backgroundColor: color, opacity: 0.5 }}
                    />
                    {/* Connection Line */}
                    <motion.div 
                        className="dna-line"
                        animate={{ 
                            width: ['60%', '0%', '60%'],
                            left: ['20%', '50%', '20%']
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15, ease: "easeInOut" }}
                        style={{ backgroundColor: color, top: '3px' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default DNASequence;
