import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { tokenStorage } from '../utils/tokenStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const refreshToken = tokenStorage.getRefreshToken();
        const storedUser = tokenStorage.getUser();

        if (refreshToken && storedUser) {
            setUser(storedUser);
            // Attempt to refresh access token
            refreshAccessToken(refreshToken);
        }
        setLoading(false);
    }, []);

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await api.post('/auth/refresh', { refreshToken });
            const { accessToken, expiresIn } = response.data.data;
            tokenStorage.setTokens(accessToken, refreshToken, expiresIn);
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { accessToken, refreshToken, expiresIn, ...userData } = response.data.data;

            tokenStorage.setTokens(accessToken, refreshToken, expiresIn);
            tokenStorage.setUser(userData);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenStorage.clearTokens();
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
