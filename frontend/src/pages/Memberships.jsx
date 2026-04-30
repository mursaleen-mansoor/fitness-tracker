import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaBolt, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

const Memberships = () => {
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (plan) => {
        setLoading(true);
        try {
            // Simulated purchase API call
            // In a real app, you'd integrate Stripe/PayPal here
            
            // Notify Admins
            await axios.post('/api/notifications/notify-admins', {
                title: 'New Membership Purchase',
                message: `A user has just purchased the ${plan} membership. Action required: Verify clearance.`,
                type: 'system',
                link: '/admin/users'
            });

            toast.success(`${plan} Plan Activated! Admin has been notified.`);
        } catch (error) {
            toast.error('Purchase protocol failed. Contact support.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: 'PRO OPERATIVE',
            price: '25',
            icon: <FaBolt />,
            features: ['Advanced Analytics', 'Tactical Goal Setting', 'Priority Support', 'Custom HUD Skins'],
            color: '#39ff14'
        },
        {
            name: 'ELITE OVERSEER',
            price: '50',
            icon: <FaCrown />,
            features: ['All Pro Features', 'Personalized AI Coach', 'Strike Team Leadership', 'Infinite Data Retention'],
            color: '#aa3bff'
        }
    ];

    return (
        <Layout>
            <div style={{ color: '#fff', paddingBottom: '60px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>
                        MEMBERSHIP <span style={{ color: '#39ff14' }}>CLEARANCE</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Upgrade your clearance level to unlock restricted tactical systems.</p>
                </motion.div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                    gap: '40px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            style={{ 
                                background: 'rgba(10, 10, 10, 0.8)', 
                                border: `2px solid ${plan.color}`, 
                                padding: '60px 40px', 
                                borderRadius: '20px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 0 30px ${plan.color}22`
                            }}
                        >
                            <div style={{ 
                                fontSize: '50px', 
                                color: plan.color, 
                                marginBottom: '20px' 
                            }}>
                                {plan.icon}
                            </div>
                            <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px' }}>{plan.name}</h2>
                            <div style={{ fontSize: '60px', fontWeight: '900', marginBottom: '30px' }}>
                                ${plan.price}<span style={{ fontSize: '20px', color: '#666' }}>/mo</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '50px', textAlign: 'left' }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#ccc', fontWeight: '600' }}>
                                        <FaCheckCircle style={{ color: plan.color }} /> {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(plan.name)}
                                disabled={loading}
                                style={{ 
                                    width: '100%', 
                                    padding: '20px', 
                                    background: plan.color, 
                                    color: '#000', 
                                    border: 'none', 
                                    fontWeight: '900', 
                                    fontSize: '16px', 
                                    letterSpacing: '2px',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${plan.color}`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                {loading ? 'INITIATING PROTOCOL...' : 'PURCHASE CLEARANCE'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div style={{ 
                    marginTop: '80px', 
                    padding: '40px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px', 
                    textAlign: 'center',
                    border: '1px dashed #333'
                }}>
                    <FaShieldAlt style={{ fontSize: '30px', color: '#666', marginBottom: '15px' }} />
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                        All transactions are secured with 256-bit military grade encryption. 
                        Clearance is granted manually by an Overseer after payment verification.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Memberships;
