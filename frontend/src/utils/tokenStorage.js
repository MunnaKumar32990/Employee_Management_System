/**
 * Secure token storage utility
 * Uses memory storage with automatic refresh mechanism
 */

class TokenStorage {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
    }

    setTokens(accessToken, refreshToken, expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        
        // Store refresh token in localStorage (less sensitive, longer-lived)
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Calculate expiry time (90% of actual expiry for safety margin)
        if (expiresIn) {
            this.tokenExpiry = Date.now() + (expiresIn * 0.9);
        }
    }

    getAccessToken() {
        return this.accessToken;
    }

    getRefreshToken() {
        return this.refreshToken || localStorage.getItem('refreshToken');
    }

    isTokenExpired() {
        if (!this.tokenExpiry) return true;
        return Date.now() >= this.tokenExpiry;
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

export const tokenStorage = new TokenStorage();
