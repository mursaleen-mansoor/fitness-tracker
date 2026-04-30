import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft, FaTimes, FaShieldAlt } from 'react-icons/fa';

const TacticalTour = () => {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const tourSteps = [
        {
            title: "WELCOME TO THE COMMAND CENTER",
            content: "Operative, you have successfully linked to the FitTrack Pro Tactical Grid. This is your primary interface for physical dominance.",
            target: "dashboard-header"
        },
        {
            title: "OPERATIVE CLEARANCE (LEVEL/XP)",
            content: "Your performance is tracked in real-time. Gain XP by completing missions to increase your clearance level and unlock elite gear.",
            target: "xp-bar"
        },
        {
            title: "DAILY SPECIAL OPS",
            content: "Check here daily for new AI-generated missions. Accept them to challenge your limits and earn massive XP rewards.",
            target: "mission-widget"
        },
        {
            title: "BIOMETRIC HUD",
            content: "Monitor your vitals. If Stress levels exceed threshold or Sleep falls too low, RED ALERT protocol will initiate.",
            target: "biometric-rings"
        },
        {
            title: "A.T.A. TACTICAL AI",
            content: "Meet your AI Tactical Assistant. Click the robot icon for workout advice, nutrition protocols, or system status.",
            target: "ata-bot"
        },
        {
            title: "NEURAL LINK AUDIO",
            content: "Activate binaural beats and tactical lo-fi to optimize recovery and focus during your off-hours.",
            target: "neural-player"
        },
        {
            title: "VOICE COMMS (V.A.L.)",
            content: "Log your sets hands-free using the Voice-Activated Log. Speak clearly into the comms relay.",
            target: "voice-relay"
        },
        {
            title: "THE TACTICAL ARMORY",
            content: "Exchange your earned XP for custom HUD skins and elite gear to personalize your command center.",
            target: "armory-link"
        }
    ];

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('tactical_tour_complete');
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, []);

    const nextStep = () => {
        if (step < tourSteps.length - 1) setStep(step + 1);
        else finishTour();
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const finishTour = () => {
        setIsVisible(false);
        localStorage.setItem('tactical_tour_complete', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{ 
                            width: '500px', 
                            background: '#0a0a0a', 
                            border: '1px solid #39ff14', 
                            padding: '40px', 
                            borderRadius: '12px', 
                            boxShadow: '0 0 100px rgba(57, 255, 20, 0.2)',
                            position: 'relative',
                            textAlign: 'center'
                        }}
                    >
                        {/* HUD Decoration */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#444', fontWeight: '900', letterSpacing: '2px' }}>BRIEFING_ID: OP-INIT-001</div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: '#666' }} onClick={finishTour}><FaTimes /></div>

                        <div style={{ marginBottom: '30px' }}>
                            <FaShieldAlt style={{ fontSize: '50px', color: '#39ff14', marginBottom: '20px' }} />
                            <h2 style={{ fontFamily: "'Teko', sans-serif", fontSize: '36px', color: '#39ff14', margin: 0, letterSpacing: '2px' }}>{tourSteps[step].title}</h2>
                            <div style={{ width: '100px', height: '2px', background: '#39ff14', margin: '15px auto' }} />
                        </div>

                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#aaa', lineHeight: '1.6', marginBottom: '40px', minHeight: '80px' }}>
                            {tourSteps[step].content}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button 
                                onClick={prevStep} 
                                disabled={step === 0}
                                style={{ background: 'none', border: 'none', color: step === 0 ? '#222' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '12px' }}
                            >
                                <FaChevronLeft /> BACK
                            </button>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {tourSteps.map((_, i) => (
                                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === step ? '#39ff14' : '#222' }} />
                                ))}
                            </div>

                            <button 
                                onClick={nextStep} 
                                style={{ background: '#39ff14', border: 'none', padding: '12px 30px', color: 'black', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}
                            >
                                {step === tourSteps.length - 1 ? 'BEGIN MISSION' : 'PROCEED'} <FaChevronRight />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TacticalTour;
