import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFireAlt, FaLock } from 'react-icons/fa';

const PublicNavbar = () => {
    const location = useLocation();

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(15px)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, borderBottom: '1px solid rgba(57, 255, 20, 0.2)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '32px' }} className="font-display">
                <FaFireAlt className="text-neon" /> 
                <Link to="/" style={{ textDecoration: 'none', color: '#fff', letterSpacing: '2px' }}>
                    FIT<span className="text-neon">TRACK</span> PRO
                </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{ display: 'flex', gap: '25px', fontSize: '14px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: location.pathname === '/' ? '#39ff14' : '#fff', transition: 'color 0.3s' }}>Home</Link>
                    <Link to="/about" style={{ textDecoration: 'none', color: location.pathname === '/about' ? '#39ff14' : '#fff', transition: 'color 0.3s' }}>About</Link>
                    <Link to="/gallery" style={{ textDecoration: 'none', color: location.pathname === '/gallery' ? '#39ff14' : '#fff', transition: 'color 0.3s' }}>Gallery</Link>
                    <Link to="/testimonials" style={{ textDecoration: 'none', color: location.pathname === '/testimonials' ? '#39ff14' : '#fff', transition: 'color 0.3s' }}>Testimonials</Link>
                    <Link to="/contact" style={{ textDecoration: 'none', color: location.pathname === '/contact' ? '#39ff14' : '#fff', transition: 'color 0.3s' }}>Contact</Link>
                </div>
                <Link to="/login" style={{ padding: '12px 30px', backgroundColor: 'transparent', color: '#fff', border: '2px solid #39ff14', textDecoration: 'none', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = '#39ff14'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.6)'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    ACCESS TERMINAL <FaLock style={{ fontSize: '12px' }} />
                </Link>
            </div>
        </motion.nav>
    );
};

export default PublicNavbar;
