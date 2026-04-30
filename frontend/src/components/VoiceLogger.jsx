import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaWaveSquare, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const VoiceLogger = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [showHUD, setShowHUD] = useState(false);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error('Voice Engine not supported on this terminal.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setShowHUD(true);
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleVoiceCommand(text);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setShowHUD(false);
            toast.error('Comms Interrupted');
        };

        recognition.onend = () => {
            setIsListening(false);
            setTimeout(() => setShowHUD(false), 3000);
        };

        recognition.start();
    };

    const handleVoiceCommand = (text) => {
        const cmd = text.toLowerCase();
        if (cmd.includes('log') || cmd.includes('workout')) {
            toast.success('WORKOUT LOG INITIATED');
            // Here you could navigate or open a modal
        } else if (cmd.includes('status')) {
            toast.success('SYSTEMS NOMINAL. LEVEL 10 CLEARANCE.');
        } else {
            toast.success(`SIGNAL RECEIVED: "${text}"`);
        }
    };

    return (
        <>
            <div style={{ position: 'fixed', top: '100px', right: '30px', zIndex: 9999 }}>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startListening}
                    style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        background: isListening ? '#ff4444' : '#0a0a0a', 
                        border: '2px solid #39ff14', 
                        color: isListening ? 'white' : '#39ff14', 
                        fontSize: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isListening ? '0 0 30px #ff4444' : '0 0 20px rgba(57, 255, 20, 0.4)'
                    }}
                >
                    <FaMicrophone />
                </motion.button>
            </div>

            <AnimatePresence>
                {showHUD && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        style={{ 
                            position: 'fixed', 
                            top: '100px', 
                            right: '90px', 
                            background: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #39ff14', 
                            padding: '10px 20px', 
                            borderRadius: '8px', 
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <FaWaveSquare className={isListening ? 'pulse-voice' : ''} style={{ color: '#39ff14' }} />
                        <div style={{ fontFamily: "'Teko', sans-serif", fontSize: '18px', color: 'white', letterSpacing: '1px' }}>
                            {isListening ? 'LISTENING FOR SIGNAL...' : `RECEIVED: ${transcript.toUpperCase()}`}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes pulse-voice {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
                .pulse-voice { animation: pulse-voice 0.5s infinite; }
            `}</style>
        </>
    );
};

export default VoiceLogger;
