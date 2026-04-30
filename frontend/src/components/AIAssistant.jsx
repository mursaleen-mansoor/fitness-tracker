import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Operative, I am A.T.A. (AI Tactical Assistant). Biometric link established. Ready for mission briefing.' }
    ]);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);
        setInput('');

        // Simulated Tactical AI Response
        setTimeout(() => {
            let responseText = "Analyzing signal... ";
            const lowInput = input.toLowerCase();

            if (lowInput.includes('workout') || lowInput.includes('training')) {
                responseText += "High-intensity interval training is recommended for your current metabolic state. Focus on compound movements.";
            } else if (lowInput.includes('diet') || lowInput.includes('eat') || lowInput.includes('nutrition')) {
                responseText += "Fueling protocol initiated. Increase protein synthesis with lean sources and maintain hydration levels at 3.5L/day.";
            } else if (lowInput.includes('tired') || lowInput.includes('rest')) {
                responseText += "Fatigue detected. Protocol: Delta Sleep. Minimum 8 hours required to prevent CNS degradation.";
            } else {
                responseText += "Instruction received. Maintain discipline. Pain is temporary, but the system is eternal.";
            }

            setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        style={{ 
                            width: '350px', 
                            height: '500px', 
                            background: '#0a0a0a', 
                            border: '1px solid #39ff14', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                            overflow: 'hidden',
                            marginBottom: '20px'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '15px 20px', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaRobot style={{ color: '#39ff14' }} />
                                <span style={{ fontWeight: '900', color: '#39ff14', fontSize: '14px', letterSpacing: '2px' }}>A.T.A. v2.0</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><FaTimes /></button>
                        </div>

                        {/* Messages */}
                        <div ref={chatRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{ 
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    background: msg.role === 'user' ? '#39ff14' : '#1a1a1a',
                                    color: msg.role === 'user' ? 'black' : 'white',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: msg.role === 'assistant' ? '1px solid #333' : 'none'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '15px', borderTop: '1px solid #222', display: 'flex', gap: '10px' }}>
                            <input 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="TYPE SIGNAL..." 
                                style={{ flex: 1, background: '#111', border: '1px solid #333', padding: '10px', color: 'white', borderRadius: '4px', outline: 'none', fontSize: '12px' }} 
                            />
                            <button onClick={handleSend} style={{ background: '#39ff14', color: 'black', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: '#0a0a0a', 
                    border: '2px solid #39ff14', 
                    color: '#39ff14', 
                    fontSize: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
                }}
            >
                <FaRobot />
            </motion.button>
        </div>
    );
};

export default AIAssistant;
