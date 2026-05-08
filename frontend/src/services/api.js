import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config) => {
        const token = tokenStorage.getAccessToken();
        
        // Check if token is expired and refresh if needed
        if (token && tokenStorage.isTokenExpired() && !config._retry) {
            const refreshToken = tokenStorage.getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    });
                    const { accessToken, expiresIn } = response.data.data;
                    tokenStorage.setTokens(accessToken, refreshToken, expiresIn);
                    config.headers.Authorization = `Bearer ${accessToken}`;
                } catch (error) {
                    tokenStorage.clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            }
        } else if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenStorage.getRefreshToken();
            
            if (!refreshToken) {
                tokenStorage.clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken
                });
                
                const { accessToken, expiresIn } = response.data.data;
                tokenStorage.setTokens(accessToken, refreshToken, expiresIn);
                
                processQueue(null, accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStorage.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
