import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const FloatingScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(57, 255, 20, 0.6)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '40px',
                        right: '40px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: '#39ff14',
                        color: '#000',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        zIndex: 1000,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    <FaArrowUp />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingScrollToTop;
