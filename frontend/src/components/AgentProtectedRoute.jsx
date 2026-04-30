import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AgentProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user || (user.role !== 'support_agent' && user.role !== 'admin')) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default AgentProtectedRoute;
