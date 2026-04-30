import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import Footer from '../components/Footer';
import { FaFireAlt, FaLock, FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 3D Tilt Effect State
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXVal = ((y - centerY) / centerY) * -10; 
        const rotateYVal = ((x - centerX) / centerX) * 10;
        setRotateX(rotateXVal);
        setRotateY(rotateYVal);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            const user = JSON.parse(localStorage.getItem('userInfo'));
            toast.success('Access Granted');
            
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'support_agent') {
                navigate('/agent/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#050505', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '80px 0 0 0',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.9; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.5); }
                
                .login-bg {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: url(/hero-gym.png);
                    background-size: cover;
                    background-position: center;
                    opacity: 0.2;
                    filter: grayscale(100%);
                }
                
                input {
                    width: 100%;
                    padding: 18px 20px 18px 50px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(57,255,20,0.2);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s;
                    border-radius: 4px;
                }
                
                input:focus {
                    border-color: #39ff14;
                    background: rgba(57,255,20,0.05);
                    box-shadow: 0 0 15px rgba(57,255,20,0.15);
                }
            `}</style>

            <div className="login-bg"></div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, transparent 0%, #050505 80%)' }}></div>

            {/* Back Button */}
            <Link to="/" style={{ position: 'absolute', top: '40px', left: '40px', color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '14px', letterSpacing: '2px', zIndex: 10 }}>
                <FaArrowLeft /> RETURN TO BASE
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ perspective: 1000, zIndex: 1, width: '100%', maxWidth: '500px', padding: '20px' }}
            >
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    animate={{ rotateX, rotateY }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
                    style={{
                        background: 'rgba(10, 10, 10, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(57, 255, 20, 0.3)',
                        padding: '60px 40px',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ transform: 'translateZ(60px)', textAlign: 'center', marginBottom: '50px' }}>
                        <FaFireAlt className="text-neon" style={{ fontSize: '50px', marginBottom: '20px' }} />
                        <h2 className="font-display" style={{ fontSize: '60px', letterSpacing: '2px' }}>
                            IDENTITY <span className="text-neon">VERIFICATION</span>
                        </h2>
                        <p style={{ color: '#666', fontWeight: '800', letterSpacing: '3px', fontSize: '12px', marginTop: '10px' }}>
                            SECURE TERMINAL ACCESS
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ transform: 'translateZ(40px)' }}>
                        <div style={{ marginBottom: '25px', position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '20px', top: '22px', color: '#444' }} />
                            <input 
                                type="email" 
                                placeholder="COMM CHANNEL (EMAIL)"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div style={{ marginBottom: '35px', position: 'relative' }}>
                            <FaKey style={{ position: 'absolute', left: '20px', top: '22px', color: '#444' }} />
                            <input 
                                type="password" 
                                placeholder="ENCRYPTED KEY (PASSWORD)"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '20px', 
                                backgroundColor: '#39ff14', 
                                color: '#000', 
                                border: 'none', 
                                fontWeight: '900', 
                                fontSize: '18px', 
                                letterSpacing: '2px', 
                                cursor: loading ? 'not-allowed' : 'pointer', 
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                            onMouseOver={e => !loading && (e.currentTarget.style.boxShadow = '0 0 30px rgba(57, 255, 20, 0.4)')}
                            onMouseOut={e => !loading && (e.currentTarget.style.boxShadow = 'none')}
                        >
                            {loading ? 'AUTHENTICATING...' : (
                                <>INITIATE LOGIN <FaLock style={{ fontSize: '14px' }} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ transform: 'translateZ(20px)', textAlign: 'center', marginTop: '40px' }}>
                        <p style={{ color: '#444', fontSize: '12px', fontWeight: '700' }}>
                            LOST YOUR CLEARANCE? <Link to="/contact" style={{ color: '#39ff14', textDecoration: 'none' }}>REQUEST ACCESS</Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default Login;
