import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';

import DashboardHome from './pages/DashboardHome';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import StrikeTeams from './pages/StrikeTeams';
import TransformationWarRoom from './pages/TransformationWarRoom';
import BiometricHUD from './pages/BiometricHUD';
import TacticalArmory from './pages/TacticalArmory';
import GlobalHeatmap from './pages/GlobalHeatmap';
import ExerciseLibrary from './pages/ExerciseLibrary';
import SmartFitnessHub from './pages/SmartFitnessHub';
import Goals from './pages/Goals';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Memberships from './pages/Memberships';
import AgentLayout from './components/AgentLayout';
import AgentProtectedRoute from './components/AgentProtectedRoute';
import AgentDashboard from './pages/AgentDashboard';
import AgentTickets from './pages/AgentTickets';
import AgentTicketDetail from './pages/AgentTicketDetail';
import AgentKnowledge from './pages/AgentKnowledge';
import AgentPerformance from './pages/AgentPerformance';
import AgentTemplates from './pages/AgentTemplates';
import AdminLayout from './components/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAgents from './pages/AdminAgents';
import AdminTickets from './pages/AdminTickets';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminKnowledge from './pages/AdminKnowledge';
import AdminBroadcast from './pages/AdminBroadcast';
import AdminLogs from './pages/AdminLogs';
import AdminSettings from './pages/AdminSettings';
import AdminTicketDetail from './pages/AdminTicketDetail';
import AdminContactRequests from './pages/AdminContactRequests';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agent/*" element={
              <AgentProtectedRoute>
                <AgentLayout>
                  <Routes>
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="tickets" element={<AgentTickets />} />
                    <Route path="ticket/:id" element={<AgentTicketDetail />} />
                    <Route path="knowledge-base" element={<AgentKnowledge />} />
                    <Route path="performance" element={<AgentPerformance />} />
                    <Route path="templates" element={<AgentTemplates />} />
                    <Route path="profile" element={<Settings />} />
                  </Routes>
                </AgentLayout>
              </AgentProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="access-requests" element={<AdminContactRequests />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="agents" element={<AdminAgents />} />
                    <Route path="tickets" element={<AdminTickets />} />
                    <Route path="ticket/:id" element={<AdminTicketDetail />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="knowledge-base" element={<AdminKnowledge />} />
                    <Route path="broadcast" element={<AdminBroadcast />} />
                    <Route path="logs" element={<AdminLogs />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="profile" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<DashboardHome />} />
                      <Route path="/workouts" element={<Workouts />} />
                      <Route path="/nutrition" element={<Nutrition />} />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/testimonials" element={<Testimonials />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/strike-teams" element={<StrikeTeams />} />
                      <Route path="/war-room" element={<TransformationWarRoom />} />
                      <Route path="/biometrics" element={<BiometricHUD />} />
                      <Route path="/armory" element={<TacticalArmory />} />
                      <Route path="/global-map" element={<GlobalHeatmap />} />
                      <Route path="/exercises" element={<ExerciseLibrary />} />
                      <Route path="/fitness-hub" element={<SmartFitnessHub />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/memberships" element={<Memberships />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
