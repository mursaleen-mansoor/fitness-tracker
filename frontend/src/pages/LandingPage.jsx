import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDumbbell, FaChartLine, FaHeartbeat, FaCheckCircle, FaStar, FaCrown, FaTimes, FaFireAlt, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

// Reusable 3D Tilt Card Component
const TiltCard = ({ children, outerStyle, innerStyle, delay = 0 }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXVal = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
        const rotateYVal = ((x - centerX) / centerX) * 15;
        setRotateX(rotateXVal);
        setRotateY(rotateYVal);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            style={{ perspective: 1200, ...outerStyle }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
                style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: "preserve-3d",
                    ...innerStyle
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.9; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3); }
                .bg-neon { background-color: #39ff14; box-shadow: 0 0 15px rgba(57, 255, 20, 0.4); }
                
                .gym-grid {
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    background-position: center;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #050505; }
                ::-webkit-scrollbar-thumb { background: #333; }
                ::-webkit-scrollbar-thumb:hover { background: #39ff14; }
            `}</style>

            {/* Navbar */}
            <PublicNavbar />

            {/* Hero Section */}
            <header className="gym-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '80px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(/hero-gym.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,1) 100%)', zIndex: 0 }}></div>
                {/* 3D Floating Elements */}
                <motion.div animate={{ y: [0, -20, 0], rotateZ: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.1, fontSize: '150px' }}>
                    <FaDumbbell />
                </motion.div>
                <motion.div animate={{ y: [0, 30, 0], rotateZ: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.05, fontSize: '200px' }}>
                    <FaDumbbell />
                </motion.div>

                <motion.div style={{ y: yHero, opacity: opacityHero, position: 'relative', zIndex: 1, maxWidth: '1000px', textAlign: 'center', padding: '0 20px' }}>
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-display text-neon" style={{ fontSize: '30px', letterSpacing: '5px', marginBottom: '10px' }}
                    >
                        RESTRICTED ACCESS
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="font-display" style={{ fontSize: 'clamp(80px, 12vw, 150px)', textShadow: '4px 4px 0px rgba(57,255,20,0.2)' }}
                    >
                        FORGE YOUR <span className="text-neon" style={{ fontStyle: 'italic' }}>LEGACY</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        style={{ fontSize: '20px', color: '#a3a3a3', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px auto', fontWeight: '600', lineHeight: '1.6' }}
                    >
                        Elite-tier analytics, ruthless progress tracking, and precision nutrition. 
                        No public signups. Only the dedicated survive here.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
                    >
                        <a href="#matrix" style={{ padding: '18px 45px', backgroundColor: '#39ff14', color: '#000', textDecoration: 'none', fontWeight: '900', fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.3s', clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                            ENTER THE MATRIX
                        </a>
                    </motion.div>
                </motion.div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '40px', background: 'linear-gradient(to bottom, #39ff14, transparent)' }}
                />
            </header>

            {/* Core Features */}
            <section id="matrix" style={{ padding: '120px 20px', background: '#080808', position: 'relative' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="font-display" style={{ fontSize: '80px', marginBottom: '80px', borderLeft: '10px solid #39ff14', paddingLeft: '30px' }}
                    >
                        OPERATIONAL <span style={{ color: '#333' }}>CAPABILITIES</span>
                    </motion.div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                        {[
                            { icon: <FaDumbbell />, title: 'BRUTAL WORKLOADS', desc: 'Track sets, reps, and RPE with military precision. Visualize your strength curve dynamically.' },
                            { icon: <FaChartLine />, title: 'PROGRESSION METRICS', desc: 'Real-time charts plotting your physiological changes. Numbers do not lie. See the reality.' },
                            { icon: <FaHeartbeat />, title: 'NUTRITION MATRIX', desc: 'Hyper-accurate macro tracking. Fuel the machine optimally to survive the training block.' }
                        ].map((feature, i) => (
                            <TiltCard 
                                key={i}
                                delay={i * 0.2}
                                innerStyle={{ 
                                    background: 'linear-gradient(145deg, #111, #0a0a0a)', 
                                    border: '1px solid #222', 
                                    padding: '50px', 
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Glow element inside card that stays fixed while card tilts */}
                                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)', transform: 'translateZ(-50px)' }}></div>
                                
                                <div style={{ fontSize: '50px', color: '#39ff14', marginBottom: '30px', transform: 'translateZ(60px)' }}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-display" style={{ fontSize: '40px', marginBottom: '20px', transform: 'translateZ(40px)' }}>{feature.title}</h3>
                                <p style={{ color: '#888', lineHeight: '1.8', fontSize: '16px', fontWeight: '500', transform: 'translateZ(20px)' }}>
                                    {feature.desc}
                                </p>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clearance Tiers (Pricing) */}
            <section style={{ padding: '150px 20px', background: '#050505', backgroundImage: 'radial-gradient(circle at 50% 0%, #111 0%, #050505 70%)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                        <motion.h2 
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="font-display" style={{ fontSize: '90px' }}
                        >
                            CLEARANCE <span className="text-neon">TIERS</span>
                        </motion.h2>
                        <p style={{ color: '#666', fontSize: '20px', fontWeight: '900', letterSpacing: '3px' }}>STRICTLY INVITATION ONLY</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        
                        {/* Standard */}
                        <TiltCard 
                            innerStyle={{ background: '#0a0a0a', border: '1px solid #222', padding: '60px 40px' }}
                        >
                            <div style={{ transform: 'translateZ(30px)' }}>
                                <div className="font-display" style={{ color: '#666', fontSize: '30px', letterSpacing: '2px' }}>STANDARD CLASS</div>
                                <div className="font-display" style={{ fontSize: '80px', lineHeight: '1' }}>$10<span style={{ fontSize: '30px', color: '#555' }}>/MO</span></div>
                                <hr style={{ borderColor: '#222', margin: '30px 0' }} />
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: '600' }}>
                                    <li style={{ display: 'flex', gap: '15px', color: '#ccc' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> Tactical Workout Logs</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#ccc' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> Basic Macro Scans</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#555' }}><FaTimes style={{ marginTop: '4px' }}/> No Comm Support</li>
                                </ul>
                                <div style={{ marginTop: '50px', padding: '20px', textAlign: 'center', background: '#111', color: '#555', fontWeight: '900', letterSpacing: '2px' }}>UNAVAILABLE</div>
                            </div>
                        </TiltCard>

                        {/* Pro - The Centerpiece */}
                        <TiltCard 
                            delay={0.2}
                            outerStyle={{ zIndex: 10 }}
                            innerStyle={{ background: '#111', border: '2px solid #39ff14', padding: '80px 40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(57,255,20,0.1)' }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#39ff14', color: '#000', padding: '10px', textAlign: 'center', fontWeight: '900', letterSpacing: '3px', fontSize: '14px', transform: 'translateZ(40px)' }}>
                                OPTIMAL TRAJECTORY
                            </div>
                            <div style={{ transform: 'translateZ(50px)', marginTop: '20px' }}>
                                <div className="font-display text-neon" style={{ fontSize: '40px', letterSpacing: '2px' }}>PRO CLASS</div>
                                <div className="font-display" style={{ fontSize: '100px', lineHeight: '1', textShadow: '0 0 20px rgba(57,255,20,0.3)' }}>$25<span style={{ fontSize: '30px', color: '#555' }}>/MO</span></div>
                                <hr style={{ borderColor: 'rgba(57,255,20,0.3)', margin: '30px 0' }} />
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: '600' }}>
                                    <li style={{ display: 'flex', gap: '15px', color: '#fff' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> All Standard Systems</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#fff' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> Deep Analytics Engine</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#fff' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> Target Acquisition (Goals)</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#fff' }}><FaCheckCircle className="text-neon" style={{ marginTop: '4px' }}/> Priority Support Comm</li>
                                </ul>
                                <div style={{ marginTop: '50px', padding: '20px', textAlign: 'center', background: '#39ff14', color: '#000', fontWeight: '900', letterSpacing: '2px', cursor: 'not-allowed' }}>REQUIRE ADMIN CLEARANCE</div>
                            </div>
                        </TiltCard>

                        {/* Elite */}
                        <TiltCard 
                            delay={0.4}
                            innerStyle={{ background: '#0a0a0a', border: '1px solid #222', padding: '60px 40px' }}
                        >
                            <div style={{ transform: 'translateZ(30px)' }}>
                                <div className="font-display" style={{ color: '#a855f7', fontSize: '30px', letterSpacing: '2px' }}>ELITE CLASS</div>
                                <div className="font-display" style={{ fontSize: '80px', lineHeight: '1' }}>$50<span style={{ fontSize: '30px', color: '#555' }}>/MO</span></div>
                                <hr style={{ borderColor: '#222', margin: '30px 0' }} />
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: '600' }}>
                                    <li style={{ display: 'flex', gap: '15px', color: '#ccc' }}><FaCheckCircle color="#a855f7" style={{ marginTop: '4px' }}/> Complete Pro Arsenal</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#ccc' }}><FaCheckCircle color="#a855f7" style={{ marginTop: '4px' }}/> 1-on-1 Agent Protocol</li>
                                    <li style={{ display: 'flex', gap: '15px', color: '#ccc' }}><FaCheckCircle color="#a855f7" style={{ marginTop: '4px' }}/> Infinite Data Retention</li>
                                </ul>
                                <div style={{ marginTop: '50px', padding: '20px', textAlign: 'center', background: '#111', color: '#555', fontWeight: '900', letterSpacing: '2px' }}>UNAVAILABLE</div>
                            </div>
                        </TiltCard>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
