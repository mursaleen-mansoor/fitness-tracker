import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaUserCircle } from 'react-icons/fa';
import Layout from '../components/Layout';

const Testimonials = () => {
    const reviews = [
        { id: 1, name: 'Commander Rex', role: 'Elite Athlete', text: 'The progression tracking here is unmatched. It turned my training from guesswork into a science.', rating: 5 },
        { id: 2, name: 'Sarah Jenkins', role: 'Transformation Client', text: 'Lost 15kg in 3 months using the Nutrition HUD and Strike Team protocols. Ruthless but effective.', rating: 5 },
        { id: 3, name: 'Marcus Vane', role: 'Powerlifter', text: 'The iron sanctum is where legends are born. Best facility I have ever trained in.', rating: 5 },
        { id: 4, name: 'Elena Frost', role: 'Hybrid Athlete', text: 'Secure access and detailed analytics. Finally a system that respects my data.', rating: 4 },
        { id: 5, name: 'Victor Thorne', role: 'Bodybuilder', text: 'Everything is optimized for performance. No fluff, just results.', rating: 5 },
        { id: 6, name: 'Jasmine Lee', role: 'Fitness Enthusiast', text: 'The community challenges keep me motivated. Truly a next-gen fitness experience.', rating: 5 }
    ];

    return (
        <Layout>
            <div style={{ color: '#fff', paddingBottom: '60px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '60px' }}
                >
                    <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>
                        CLIENT <span style={{ color: '#39ff14' }}>FEEDBACK</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Intelligence gathered from our most successful operatives.</p>
                </motion.div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '40px' 
                }}>
                    {reviews.map((rev, i) => (
                        <motion.div
                            key={rev.id}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{ 
                                background: 'linear-gradient(145deg, #0a0a0a, #050505)', 
                                padding: '40px', 
                                borderRadius: '16px',
                                border: '1px solid rgba(57, 255, 20, 0.1)',
                                position: 'relative'
                            }}
                        >
                            <FaQuoteLeft style={{ 
                                position: 'absolute', 
                                top: '20px', 
                                right: '20px', 
                                color: 'rgba(57, 255, 20, 0.2)', 
                                fontSize: '40px' 
                            }} />
                            
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                                {[...Array(5)].map((_, star) => (
                                    <FaStar key={star} style={{ color: star < rev.rating ? '#39ff14' : '#222' }} />
                                ))}
                            </div>

                            <p style={{ 
                                fontSize: '16px', 
                                lineHeight: '1.8', 
                                color: 'var(--text-secondary)', 
                                marginBottom: '30px',
                                fontStyle: 'italic'
                            }}>
                                "{rev.text}"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ 
                                    width: '45px', 
                                    height: '45px', 
                                    borderRadius: '50%', 
                                    background: 'rgba(57, 255, 20, 0.1)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#39ff14',
                                    fontSize: '24px'
                                }}>
                                    <FaUserCircle />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{rev.name}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{rev.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Testimonials;
