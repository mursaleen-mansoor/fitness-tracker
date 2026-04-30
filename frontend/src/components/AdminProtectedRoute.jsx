import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
