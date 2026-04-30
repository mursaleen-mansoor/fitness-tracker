import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/contact', formData);
            toast.success(data.message);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.9; }
                .text-neon { color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3); }
                input, textarea {
                    width: 100%;
                    padding: 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(57,255,20,0.3);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    margin-bottom: 20px;
                    outline: none;
                    transition: all 0.3s;
                }
                input:focus, textarea:focus {
                    background: rgba(57,255,20,0.05);
                    border-color: #39ff14;
                    box-shadow: 0 0 15px rgba(57,255,20,0.2);
                }
            `}</style>

            <PublicNavbar />

            <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', backgroundImage: 'url(/contact-gym.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4, maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}></div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 20px' }}>
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h1 className="font-display" style={{ fontSize: '100px', letterSpacing: '2px', marginBottom: '20px' }}>
                            REQUEST <span className="text-neon">ACCESS</span>
                        </h1>
                        <p style={{ fontSize: '20px', color: '#aaa', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                            Currently operating at maximum capacity. Submit your request for administrative review. Do not double submit.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                            <h3 className="font-display text-neon" style={{ fontSize: '50px', marginBottom: '40px' }}>TRANSMIT SIGNAL</h3>
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="LEGAL IDENTITY (NAME)" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required 
                                />
                                <input 
                                    type="email" 
                                    placeholder="DIGITAL COMM CHANNEL (EMAIL)" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required 
                                />
                                <textarea 
                                    rows="6" 
                                    placeholder="JUSTIFICATION FOR ACCESS..." 
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required 
                                />
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ width: '100%', padding: '20px', backgroundColor: '#39ff14', color: '#000', border: 'none', fontWeight: '900', fontSize: '18px', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }} 
                                    onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')} 
                                    onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    {loading ? 'TRANSMITTING...' : 'SUBMIT CLEARANCE REQUEST'}
                                </button>
                            </form>
                        </motion.div>

                        <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                            <h3 className="font-display" style={{ fontSize: '50px', marginBottom: '40px' }}>COORDINATES</h3>
                            
                            <div style={{ background: '#111', padding: '40px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'rgba(57,255,20,0.1)', color: '#39ff14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', borderRadius: '10px' }}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <div style={{ color: '#555', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', marginBottom: '5px' }}>HQ LOCATION</div>
                                        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>Sector 7G, Cyber District</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'rgba(57,255,20,0.1)', color: '#39ff14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', borderRadius: '10px' }}>
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <div style={{ color: '#555', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', marginBottom: '5px' }}>PRIORITY COMM</div>
                                        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>admin@fitnesstracker.com</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'rgba(57,255,20,0.1)', color: '#39ff14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', borderRadius: '10px' }}>
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <div style={{ color: '#555', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', marginBottom: '5px' }}>EMERGENCY LINE</div>
                                        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>+1 (800) GET-SHREDDED</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Contact;
