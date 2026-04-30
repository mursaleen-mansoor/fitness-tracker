import { motion } from 'framer-motion';
import { FaImage, FaDumbbell, FaFireAlt } from 'react-icons/fa';
import Layout from '../components/Layout';

const Gallery = () => {
    const images = [
        { id: 1, title: 'Tactical Training Area', category: 'Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
        { id: 2, title: 'Transformation Alpha', category: 'Transformation', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' },
        { id: 3, title: 'Heavy Arsenal', category: 'Gym', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
        { id: 4, title: 'Elite Performance', category: 'Gym', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
        { id: 5, title: 'Conditioning Protocol', category: 'Transformation', url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=800' },
        { id: 6, title: 'The Iron Sanctum', category: 'Gym', url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800' }
    ];

    return (
        <Layout>
            <div style={{ color: '#fff', paddingBottom: '60px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '50px' }}
                >
                    <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>
                        GALLERY <span style={{ color: '#39ff14' }}>PROTOCOL</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Visual documentation of elite transformations and tactical facilities.</p>
                </motion.div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '30px' 
                }}>
                    {images.map((img, i) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            style={{ 
                                background: '#0a0a0a', 
                                border: '1px solid rgba(57, 255, 20, 0.1)', 
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                                <img 
                                    src={img.url} 
                                    alt={img.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '15px', 
                                    right: '15px', 
                                    background: 'rgba(57, 255, 20, 0.9)', 
                                    color: '#000', 
                                    padding: '5px 12px', 
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    letterSpacing: '1px'
                                }}>
                                    {img.category}
                                </div>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '5px' }}>{img.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>System verified operational area.</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Gallery;
