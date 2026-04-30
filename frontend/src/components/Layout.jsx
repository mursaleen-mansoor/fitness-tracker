import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingScrollToTop from './FloatingScrollToTop';
import AIAssistant from './AIAssistant';
import NeuralLinkPlayer from './NeuralLinkPlayer';
import VoiceLogger from './VoiceLogger';
import TacticalTour from './TacticalTour';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            <Sidebar collapsed={collapsed} />
            <div style={{ 
                marginLeft: collapsed ? '80px' : '280px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '100vh'
            }}>
                <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />
                <main style={{ 
                    padding: '40px', 
                    flex: 1, 
                    opacity: 0.96, // Slightly reduced opacity as requested
                    transition: 'opacity 0.3s ease'
                }}>
                    {children}
                </main>
                <Footer />
                <FloatingScrollToTop />
                <AIAssistant />
                <NeuralLinkPlayer />
                <VoiceLogger />
                <TacticalTour />
            </div>
        </div>
    );
};

export default Layout;