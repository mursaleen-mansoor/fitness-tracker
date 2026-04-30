import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { FaFireAlt, FaSkull, FaRunning, FaDumbbell } from 'react-icons/fa';

const About = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.9; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3); }
            `}</style>

            <PublicNavbar />

            <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', backgroundImage: 'url(/about-gym.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4, maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}></div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 20px' }}>
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <h1 className="font-display" style={{ fontSize: '100px', letterSpacing: '2px', marginBottom: '20px' }}>
                            THE <span className="text-neon">ORIGIN</span>
                        </h1>
                        <p style={{ fontSize: '20px', color: '#aaa', maxWidth: '800px', lineHeight: '1.6', marginBottom: '80px' }}>
                            FitTrack Pro was forged in the fires of discipline. We realized that public fitness platforms were too soft, too distracted, and lacked the ruthless precision required for elite physical transformation. Thus, the system was created.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ background: '#111', padding: '50px', border: '1px solid #222' }}>
                            <FaSkull className="text-neon" style={{ fontSize: '50px', marginBottom: '20px' }} />
                            <h3 className="font-display" style={{ fontSize: '40px', marginBottom: '15px' }}>NO DISTRACTIONS</h3>
                            <p style={{ color: '#888' }}>Zero social feeds. Zero fluff. Pure data and analytics designed to break limits.</p>
                        </motion.div>
                        
                        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ background: '#111', padding: '50px', border: '1px solid #222' }}>
                            <FaRunning className="text-neon" style={{ fontSize: '50px', marginBottom: '20px' }} />
                            <h3 className="font-display" style={{ fontSize: '40px', marginBottom: '15px' }}>TACTICAL PRECISION</h3>
                            <p style={{ color: '#888' }}>Every calorie and every rep is logged with absolute certainty. The matrix does not lie.</p>
                        </motion.div>

                        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} style={{ background: '#111', padding: '50px', border: '1px solid #222' }}>
                            <FaDumbbell className="text-neon" style={{ fontSize: '50px', marginBottom: '20px' }} />
                            <h3 className="font-display" style={{ fontSize: '40px', marginBottom: '15px' }}>ELITE ONLY</h3>
                            <p style={{ color: '#888' }}>A closed-system network. Only those approved by an Overseer are granted access.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default About;
