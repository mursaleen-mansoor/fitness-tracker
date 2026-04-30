import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaCheckCircle, FaClipboardList, FaStar, FaLevelUpAlt, 
    FaArrowUp, FaArrowDown, FaStopwatch, FaPercent 
} from 'react-icons/fa';

const AgentPerformance = () => {
    const [perf, setPerf] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerf = async () => {
            try {
                const { data } = await axios.get('/api/agent/performance');
                setPerf(data);
            } catch (error) {
                console.error('Error fetching performance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerf();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#8950fc' }}>
            <div className="animate-pulse">Analyzing performance metrics...</div>
        </div>
    );
    if (!perf) return <div style={{ textAlign: 'center', padding: '50px', color: '#b5b5c3' }}>No performance data available.</div>;

    const { metrics, comparison } = perf;

    const MetricCard = ({ title, value, unit, icon, color, diff, bg }) => (
        <div style={{ 
            backgroundColor: '#fff', 
            padding: '30px', 
            borderRadius: '24px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: bg, 
                    color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                }}>
                    {icon}
                </div>
                {diff !== undefined && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '13px', 
                        padding: '6px 12px',
                        borderRadius: '10px',
                        backgroundColor: diff >= 0 ? '#c9f7f5' : '#ffe2e5',
                        color: diff >= 0 ? '#1bc5bd' : '#f64e60', 
                        fontWeight: '800' 
                    }}>
                        {diff >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />} {Math.abs(diff)}%
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '12px', color: '#b5b5c3', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#181c32', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    {value}
                    {unit && <span style={{ fontSize: '14px', fontWeight: '700', color: '#b5b5c3' }}>{unit}</span>}
                </div>
            </div>
        </div>
    );

    const resolveRate = metrics.assigned > 0 ? ((metrics.resolved / metrics.assigned) * 100).toFixed(1) : 0;

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#181c32', margin: 0, letterSpacing: '-0.5px' }}>Performance Analytics</h1>
                <p style={{ color: '#b5b5c3', margin: '8px 0 0 0', fontSize: '15px' }}>Track your efficiency and customer satisfaction growth</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '35px' }}>
                <MetricCard title="Resolved" value={metrics.resolved} icon={<FaCheckCircle />} color="#1bc5bd" bg="#c9f7f5" diff={comparison.resolvedDiff} />
                <MetricCard title="Assigned" value={metrics.assigned} icon={<FaClipboardList />} color="#3699ff" bg="#e1f0ff" diff={comparison.assignedDiff} />
                <MetricCard title="Avg CSAT" value={metrics.avgCSAT} unit="/ 5.0" icon={<FaStar />} color="#ffa800" bg="#fff4de" diff={parseFloat(comparison.csatDiff.toFixed(1))} />
                <MetricCard title="Escalated" value={metrics.escalated} icon={<FaLevelUpAlt />} color="#f64e60" bg="#ffe2e5" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Resolve Rate Card */}
                <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#f3f6f9', borderRadius: '12px', color: '#1bc5bd' }}><FaPercent /></div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#181c32', fontWeight: '800' }}>Resolution Efficiency</h3>
                    </div>
                    
                    <div style={{ position: 'relative', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#b5b5c3', fontWeight: '700' }}>Completion Rate</span>
                            <span style={{ fontSize: '14px', color: '#181c32', fontWeight: '900' }}>{resolveRate}%</span>
                        </div>
                        <div style={{ width: '100%', height: '14px', backgroundColor: '#f3f6f9', borderRadius: '7px', overflow: 'hidden' }}>
                            <div style={{ 
                                width: `${resolveRate}%`, 
                                height: '100%', 
                                backgroundColor: '#1bc5bd', 
                                borderRadius: '7px',
                                boxShadow: '0 0 15px rgba(27, 197, 189, 0.4)',
                                transition: 'width 1s ease-out'
                            }}></div>
                        </div>
                    </div>
                    
                    <div style={{ backgroundColor: '#f9f9fb', padding: '20px', borderRadius: '16px', fontSize: '14px', color: '#7e8299', lineHeight: '1.6' }}>
                        <FaStopwatch style={{ marginRight: '8px', color: '#b5b5c3' }} /> 
                        Your resolution rate is <span style={{ color: '#1bc5bd', fontWeight: '800' }}>above the team average</span>. Keep up the high response quality to maintain your CSAT score.
                    </div>
                </div>

                {/* Response Time Card */}
                <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#eee5ff', borderRadius: '12px', color: '#8950fc' }}><FaStopwatch /></div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#181c32', fontWeight: '800' }}>First Response Time</h3>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: '#8950fc', letterSpacing: '-2px' }}>
                            {metrics.avgResponseTime}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#b5b5c3', marginTop: '-10px' }}>average hours</div>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid #f3f6f9', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#b5b5c3', fontWeight: '600' }}>Weekly Target</span>
                            <span style={{ fontSize: '13px', color: '#3f4254', fontWeight: '800' }}>&lt; 2.0 hrs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentPerformance;
