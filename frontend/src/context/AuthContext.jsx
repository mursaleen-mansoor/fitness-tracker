import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup axios interceptors once
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Token expired or invalid - clear session
                    localStorage.removeItem('userInfo');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        // Load user from localStorage
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                if (parsedUser && parsedUser.token) {
                    setUser(parsedUser);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem('userInfo');
            }
        }
        
        setLoading(false);

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
