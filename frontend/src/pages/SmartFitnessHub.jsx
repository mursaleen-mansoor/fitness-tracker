import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBolt, FaDumbbell, FaClock, FaFire, FaPlay, FaStop, 
    FaForward, FaCheckCircle, FaUndo, FaSave, FaList, FaTrash,
    FaVolumeUp, FaMicrophone, FaShareAlt, FaChartLine, FaTimes, FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BodyVisualizer from '../components/BodyVisualizer';

const SmartFitnessHub = () => {
    // --- STATE ---
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMuscle, setSelectedMuscle] = useState('abs');
    const [view, setView] = useState('front');
    const [selectedExercise, setSelectedExercise] = useState(null);
    
    // Generator State
    const [generator, setGenerator] = useState({
        goal: 'muscle gain',
        level: 'intermediate',
        duration: 20,
        noEquipment: false
    });
    const [generatedWorkout, setGeneratedWorkout] = useState(null);
    const [myWorkouts, setMyWorkouts] = useState(JSON.parse(localStorage.getItem('saved_workouts') || '[]'));

    // Active Workout State
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // 0 = warmup, 1 = ex1, 2 = rest, 3 = ex2...
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isResting, setIsResting] = useState(false);

    // Gamification
    const [streak, setStreak] = useState(parseInt(localStorage.getItem('workout_streak') || '0'));
    const [dailyDone, setDailyDone] = useState(localStorage.getItem('daily_done') === new Date().toDateString());

    const hudColor = '#39ff14';

    // --- EFFECTS ---
    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        let interval;
        if (activeWorkout && !isPaused && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && activeWorkout) {
            handleStepComplete();
        }
        return () => clearInterval(interval);
    }, [activeWorkout, isPaused, timer]);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/exercises');
            const data = Array.isArray(response.data) ? response.data : [];
            setExercises(data);
        } catch (error) {
            toast.error('SATELLITE DATA LINK FAILURE');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC ---
    const generateWorkout = () => {
        const count = generator.duration === 10 ? 5 : generator.duration === 20 ? 8 : 12;
        let pool = exercises;
        
        if (generator.noEquipment) {
            pool = pool.filter(ex => ex.equipment === 'body weight');
        }

        // Simple randomization & filtering by goal (simulation)
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count).map(ex => ({
            ...ex,
            sets: generator.goal === 'strength' ? 5 : 3,
            reps: generator.goal === 'strength' ? 5 : 12,
            duration: 45 // seconds for timer mode
        }));

        setGeneratedWorkout({
            id: Date.now(),
            title: `${generator.goal.toUpperCase()} - ${generator.level.toUpperCase()}`,
            exercises: selected,
            totalDuration: generator.duration
        });
        toast.success('WORKOUT PROTOCOL GENERATED');
    };

    const startWorkout = (workout) => {
        setActiveWorkout(workout);
        setCurrentStep(0);
        setTimer(workout.exercises[0].duration);
        setIsResting(false);
        speak(`Starting ${workout.exercises[0].name}. Prepare operative.`);
    };

    const handleStepComplete = () => {
        if (!isResting) {
            // Finished an exercise, start rest
            setIsResting(true);
            setTimer(30); // 30s rest
            speak('Exercise complete. Commence recovery period.');
        } else {
            // Finished rest, start next exercise
            const nextIdx = currentStep + 1;
            if (nextIdx < activeWorkout.exercises.length) {
                setCurrentStep(nextIdx);
                setIsResting(false);
                setTimer(activeWorkout.exercises[nextIdx].duration);
                speak(`Recovery complete. Next exercise: ${activeWorkout.exercises[nextIdx].name}.`);
            } else {
                // Workout Complete
                completeWorkout();
            }
        }
    };

    const completeWorkout = () => {
        setActiveWorkout(null);
        toast.success('MISSION ACCOMPLISHED');
        if (!dailyDone) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setDailyDone(true);
            localStorage.setItem('workout_streak', newStreak);
            localStorage.setItem('daily_done', new Date().toDateString());
        }
        speak('Workout complete. Optimal performance achieved. Elite status confirmed.');
    };

    const saveWorkout = () => {
        const newWorkouts = [...myWorkouts, generatedWorkout];
        setMyWorkouts(newWorkouts);
        localStorage.setItem('saved_workouts', JSON.stringify(newWorkouts));
        toast.success('PROTOCOL SAVED TO LOCAL ARMORY');
    };

    const speak = (text) => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    };

    // --- STYLES ---
    const glassStyle = {
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(57, 255, 20, 0.1)',
        borderRadius: '16px',
        padding: '25px'
    };

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;900&display=swap');
                .font-display { font-family: 'Teko', sans-serif; text-transform: uppercase; }
                .text-neon { color: ${hudColor}; text-shadow: 0 0 10px ${hudColor}66; }
                .btn-hud { background: transparent; border: 1px solid ${hudColor}; color: ${hudColor}; padding: 12px 24px; border-radius: 8px; font-weight: 900; cursor: pointer; transition: 0.3s; font-family: 'Teko'; font-size: 18px; letter-spacing: 1px; }
                .btn-hud:hover { background: ${hudColor}; color: black; box-shadow: 0 0 20px ${hudColor}66; }
                .card-hover:hover { border-color: ${hudColor} !important; transform: translateY(-5px); }
                @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 0; } }
                .pulse-ring { position: absolute; border: 2px solid ${hudColor}; border-radius: 50%; width: 100%; height: 100%; animation: pulse-ring 2s infinite; }
            `}</style>

            {/* Header HUD */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '60px', margin: 0, lineHeight: 1 }}>
                        SMART <span className="text-neon">FITNESS HUB</span>
                    </h1>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#555', fontWeight: '900', letterSpacing: '3px' }}>
                            STREAK: <span className="text-neon">{streak} DAYS</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#555', fontWeight: '900', letterSpacing: '3px' }}>
                            STATUS: <span style={{ color: dailyDone ? hudColor : '#ff4444' }}>{dailyDone ? 'OPTIMIZED' : 'PENDING'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn-hud" onClick={() => startWorkout({ exercises: exercises.slice(0, 5).map(e => ({...e, duration: 30})), title: 'INSTANT RECON' })}>
                        <FaBolt style={{ marginRight: '10px' }} /> INSTANT START
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Module 1: Smart Generator */}
                    <section style={glassStyle}>
                        <h2 className="font-display" style={{ fontSize: '30px', margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <FaBolt className="text-neon" /> WORKOUT ARCHITECT
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={{ fontSize: '10px', color: '#444', fontWeight: '900', display: 'block', marginBottom: '8px' }}>TARGET GOAL</label>
                                <select 
                                    style={{ width: '100%', background: '#111', border: '1px solid #222', color: 'white', padding: '12px', borderRadius: '8px' }}
                                    value={generator.goal} onChange={(e) => setGenerator({...generator, goal: e.target.value})}
                                >
                                    <option value="fat loss">FAT LOSS</option>
                                    <option value="muscle gain">MUSCLE GAIN</option>
                                    <option value="strength">STRENGTH</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', color: '#444', fontWeight: '900', display: 'block', marginBottom: '8px' }}>SKILL LEVEL</label>
                                <select 
                                    style={{ width: '100%', background: '#111', border: '1px solid #222', color: 'white', padding: '12px', borderRadius: '8px' }}
                                    value={generator.level} onChange={(e) => setGenerator({...generator, level: e.target.value})}
                                >
                                    <option value="beginner">BEGINNER</option>
                                    <option value="intermediate">INTERMEDIATE</option>
                                    <option value="advanced">ADVANCED</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', color: '#444', fontWeight: '900', display: 'block', marginBottom: '8px' }}>DURATION (MIN)</label>
                                <select 
                                    style={{ width: '100%', background: '#111', border: '1px solid #222', color: 'white', padding: '12px', borderRadius: '8px' }}
                                    value={generator.duration} onChange={(e) => setGenerator({...generator, duration: parseInt(e.target.value)})}
                                >
                                    <option value="10">10 MIN</option>
                                    <option value="20">20 MIN</option>
                                    <option value="30">30 MIN</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
                                <input type="checkbox" id="noEq" checked={generator.noEquipment} onChange={(e) => setGenerator({...generator, noEquipment: e.target.checked})} />
                                <label htmlFor="noEq" style={{ fontSize: '12px', fontWeight: '700' }}>NO EQUIPMENT</label>
                            </div>
                        </div>
                        <button className="btn-hud" style={{ width: '100%' }} onClick={generateWorkout}>
                            INITIALIZE GENERATION SEQUENCE
                        </button>

                        {generatedWorkout && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '30px', padding: '20px', border: `1px dashed ${hudColor}33`, borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 className="font-display" style={{ fontSize: '24px', margin: 0 }}>{generatedWorkout.title}</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn-hud" style={{ padding: '8px 15px', fontSize: '14px' }} onClick={() => startWorkout(generatedWorkout)}>START NOW</button>
                                        <button className="btn-hud" style={{ padding: '8px 15px', fontSize: '14px', borderColor: '#444', color: '#444' }} onClick={saveWorkout}><FaSave /></button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                    {generatedWorkout.exercises.map((ex, i) => (
                                        <div key={i} style={{ background: '#111', padding: '15px', borderRadius: '8px', borderLeft: `3px solid ${hudColor}` }}>
                                            <div style={{ fontWeight: '900', fontSize: '12px' }}>{ex.name.toUpperCase()}</div>
                                            <div style={{ fontSize: '10px', color: '#555' }}>{ex.sets} SETS x {ex.reps} REPS</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </section>

                    {/* Module 2: Muscle Explorer */}
                    <section style={{ ...glassStyle, display: 'flex', gap: '40px' }}>
                        <div style={{ flex: '0 0 300px' }}>
                            <h2 className="font-display" style={{ fontSize: '30px', margin: '0 0 20px 0' }}>MUSCLE <span className="text-neon">EXPLORER</span></h2>
                            <BodyVisualizer view={view} selectedMuscle={selectedMuscle} onMuscleClick={(m) => setSelectedMuscle(m)} />
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button className="btn-hud" style={{ flex: 1, fontSize: '12px' }} onClick={() => setView('front')}>FRONT</button>
                                <button className="btn-hud" style={{ flex: 1, fontSize: '12px' }} onClick={() => setView('back')}>BACK</button>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 className="font-display" style={{ fontSize: '24px', marginBottom: '20px', color: hudColor }}>
                                TARGET: {selectedMuscle.toUpperCase()}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                                {exercises.filter(ex => ex.bodyPart === selectedMuscle || ex.target === selectedMuscle).slice(0, 10).map((ex) => (
                                    <motion.div 
                                        key={ex.id} whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedExercise(ex)}
                                        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                                    >
                                        <img src={ex.gifUrl} alt={ex.name} style={{ width: '100%', height: '120px', objectFit: 'cover', opacity: 0.7 }} />
                                        <div style={{ padding: '10px', fontSize: '11px', fontWeight: '900', textAlign: 'center' }}>{ex.name.toUpperCase()}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Active Workout & Saved */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Module 3: Active Workout Player */}
                    <section style={{ ...glassStyle, position: 'sticky', top: '20px', border: activeWorkout ? `1px solid ${hudColor}` : '1px solid #1a1a1a' }}>
                        <h2 className="font-display" style={{ fontSize: '24px', margin: '0 0 20px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>TACTICAL PLAYER</span>
                            {activeWorkout && <span className="text-neon" style={{ fontSize: '14px' }}>ACTIVE</span>}
                        </h2>

                        {!activeWorkout ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#333' }}>
                                <FaPlay style={{ fontSize: '40px', marginBottom: '20px', opacity: 0.1 }} />
                                <div style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '2px' }}>NO ACTIVE MISSION</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                                        <div className="pulse-ring" />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateTranslate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50%', background: '#111', border: `2px solid ${hudColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '30px', fontWeight: '900', color: hudColor }}>{timer}</div>
                                            <div style={{ fontSize: '10px', color: '#444' }}>SECONDS</div>
                                        </div>
                                    </div>
                                    <div className="font-display" style={{ fontSize: '24px', color: isResting ? '#3699ff' : 'white' }}>
                                        {isResting ? 'RECOVERY PERIOD' : activeWorkout.exercises[currentStep].name.toUpperCase()}
                                    </div>
                                    {!isResting && <img src={activeWorkout.exercises[currentStep].gifUrl} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginTop: '20px', border: '1px solid #222' }} />}
                                </div>

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button className="btn-hud" onClick={() => setIsPaused(!isPaused)}>
                                        {isPaused ? <FaPlay /> : <FaStop />}
                                    </button>
                                    <button className="btn-hud" onClick={handleStepComplete}>
                                        <FaForward />
                                    </button>
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444', marginBottom: '5px' }}>
                                        <span>PROGRESS</span>
                                        <span>{Math.round(((currentStep + (isResting ? 0.5 : 0)) / activeWorkout.exercises.length) * 100)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: '#111', borderRadius: '2px' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentStep + (isResting ? 0.5 : 0)) / activeWorkout.exercises.length) * 100}%` }}
                                            style={{ height: '100%', background: hudColor, borderRadius: '2px', boxShadow: `0 0 10px ${hudColor}` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Module 4: Saved Workouts */}
                    <section style={glassStyle}>
                        <h2 className="font-display" style={{ fontSize: '24px', margin: '0 0 20px 0' }}>LOCAL ARMORY</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {myWorkouts.length === 0 ? (
                                <div style={{ color: '#222', fontSize: '11px', textAlign: 'center' }}>NO SAVED PROTOCOLS</div>
                            ) : (
                                myWorkouts.map((w, i) => (
                                    <div key={i} className="card-hover" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '900', fontSize: '13px' }}>{w.title}</div>
                                            <div style={{ fontSize: '10px', color: '#444' }}>{w.exercises.length} EXERCISES</div>
                                        </div>
                                        <button onClick={() => startWorkout(w)} style={{ background: 'none', border: 'none', color: hudColor, cursor: 'pointer' }}><FaPlay /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Exercise Detail Modal */}
            <AnimatePresence>
                {selectedExercise && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedExercise(null)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '100%', maxWidth: '800px', background: '#0a0a0a', border: `1px solid ${hudColor}`, borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div style={{ background: '#111' }}>
                                <img src={selectedExercise.gifUrl} alt={selectedExercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                    <h2 className="font-display" style={{ fontSize: '36px', margin: 0, color: hudColor }}>{selectedExercise.name}</h2>
                                    <button onClick={() => setSelectedExercise(null)} style={{ background: 'none', border: 'none', color: '#444', fontSize: '24px', cursor: 'pointer' }}><FaTimes /></button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#444', fontWeight: '900' }}>TARGET</div>
                                        <div style={{ fontWeight: '800' }}>{selectedExercise.target.toUpperCase()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#444', fontWeight: '900' }}>EQUIPMENT</div>
                                        <div style={{ fontWeight: '800' }}>{selectedExercise.equipment.toUpperCase()}</div>
                                    </div>
                                </div>
                                <button className="btn-hud" style={{ width: '100%' }} onClick={() => { speak(`Instruction for ${selectedExercise.name}. Start from a stable position and perform controlled movements.`); toast.success('VOICE GUIDANCE INITIATED'); }}>
                                    <FaVolumeUp style={{ marginRight: '10px' }} /> LISTEN TO INSTRUCTIONS
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartFitnessHub;
