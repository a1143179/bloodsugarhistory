import config from '../config/environment';

class ApiService {
    constructor() {
        this.baseURL = config.backendUrl;
    }

    // Make authenticated API request
    async request(endpoint, options = {}, accessToken = null) {
        const configObj = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Always include cookies for refresh
            ...options,
        };

        if (accessToken) {
            configObj.headers.Authorization = `Bearer ${accessToken}`;
        }

        try {
            let response = await fetch(`${this.baseURL}${endpoint}`, configObj);

            if (response.status === 401 && endpoint !== '/api/auth/refresh') {
                // Try to refresh token
                const refreshRes = await this.refreshToken();
                if (refreshRes && refreshRes.accessToken) {
                    // Retry original request with new access token
                    configObj.headers.Authorization = `Bearer ${refreshRes.accessToken}`;
                    response = await fetch(`${this.baseURL}${endpoint}`, configObj);
                } else {
                    window.location.href = '/login';
                    return null;
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login() {
        window.location.href = `${this.baseURL}/api/auth/login?returnUrl=${encodeURIComponent(window.location.origin)}/dashboard`;
    }

    async logout() {
        try {
            await this.request('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async getCurrentUser(accessToken) {
        return await this.request('/api/auth/me', {}, accessToken);
    }

    async refreshToken() {
        // Backend should read refresh token from HTTP-only cookie
        try {
            const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    // Blood sugar records endpoints
    async getRecords(accessToken) {
        return await this.request('/api/records', {}, accessToken);
    }

    async createRecord(record, accessToken) {
        return await this.request('/api/records', {
            method: 'POST',
            body: JSON.stringify(record),
        }, accessToken);
    }

    async updateRecord(id, record, accessToken) {
        return await this.request(`/api/records/${id}`, {
            method: 'PUT',
            body: JSON.stringify(record),
        }, accessToken);
    }

    async deleteRecord(id, accessToken) {
        return await this.request(`/api/records/${id}`, {
            method: 'DELETE',
        }, accessToken);
    }

    // Health check
    async healthCheck() {
        return await this.request('/api/health');
    }
}

export default new ApiService(); 