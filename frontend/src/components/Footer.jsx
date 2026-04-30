import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaArrowUp, FaFireAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer style={{ 
            backgroundColor: '#0a0a0a', 
            color: 'var(--text-secondary)', 
            padding: '80px 40px 40px', 
            marginTop: 'auto',
            borderTop: '1px solid rgba(57, 255, 20, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%'
        }}>
            {/* Background Accent */}
            <div style={{ 
                position: 'absolute', 
                top: '-100px', 
                right: '-100px', 
                width: '300px', 
                height: '300px', 
                background: 'radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '40px',
                marginBottom: '40px'
            }}>
                {/* Brand Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <div style={{ 
                            fontSize: '24px',
                            color: '#39ff14',
                            filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.5))'
                        }}>
                            <FaFireAlt />
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '22px', color: '#fff', letterSpacing: '2px', fontFamily: "'Teko', sans-serif" }}>FIT<span style={{ color: '#39ff14' }}>TRACK</span> PRO</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '25px' }}>
                        The ultimate fitness tracking command center. Monitor your biometrics, track workouts, and achieve god-mode performance.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {[
                            { icon: <FaGithub />, link: 'https://github.com', color: '#fff' },
                            { icon: <FaLinkedin />, link: 'https://linkedin.com', color: '#0077b5' },
                            { icon: <FaInstagram />, link: 'https://instagram.com', color: '#e4405f' },
                            { icon: <FaWhatsapp />, link: 'https://whatsapp.com', color: '#25d366' }
                        ].map((social, i) => (
                            <a 
                                key={i} 
                                href={social.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '10px', 
                                    backgroundColor: 'rgba(255,255,255,0.05)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: social.color, 
                                    fontSize: '18px',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '900', marginBottom: '25px', letterSpacing: '2px', textTransform: 'uppercase' }}>Tactical Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                            { name: 'Dashboard', path: '/dashboard' },
                            { name: 'Workouts', path: '/workouts' },
                            { name: 'Nutrition', path: '/nutrition' },
                            { name: 'Progress', path: '/progress' },
                            { name: 'Memberships', path: '/memberships' },
                            { name: 'Leaderboard', path: '/leaderboard' },
                            { name: 'Gallery', path: '/gallery' },
                            { name: 'Testimonials', path: '/testimonials' }
                        ].map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#39ff14'; e.currentTarget.style.paddingLeft = '5px'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.paddingLeft = '0'; }}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Info Links */}
                <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '900', marginBottom: '25px', letterSpacing: '2px', textTransform: 'uppercase' }}>Information</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                            { name: 'About Us', path: '/about' },
                            { name: 'Contact Protocol', path: '/contact' },
                            { name: 'Support HUD', path: '/support' }
                        ].map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#39ff14'; e.currentTarget.style.paddingLeft = '5px'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.paddingLeft = '0'; }}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.05)', 
                paddingTop: '40px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                position: 'relative'
            }}>
                <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px' }}>
                    &copy; 2026 FitTrack Command. All systems operational.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
