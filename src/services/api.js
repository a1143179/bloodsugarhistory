import config from '../config/environment';
import logger from './logger';

class ApiService {
    constructor() {
        this.baseURL = config.backendUrl;
        logger.info('API Service initialized', { baseURL: this.baseURL });
    }

    // Make authenticated API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        
        // Get JWT token from cookie
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        const jwtToken = getCookie('medical_tracker_access_token');
        
        logger.logApiRequest(method, url, {
            hasAccessToken: !!jwtToken,
            headers: options.headers
        });

        const configObj = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Always include cookies
            ...options,
        };

        if (jwtToken) {
            configObj.headers.Authorization = `Bearer ${jwtToken}`;
        }

        try {
            const response = await fetch(url, configObj);

            logger.logApiResponse(method, url, response.status);

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`HTTP error! status: ${response.status}`, { 
                    endpoint, 
                    status: response.status, 
                    responseText: errorText 
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            logger.debug(`API request successful`, { endpoint, status: response.status });
            return data;
        } catch (error) {
            logger.logError(error, { endpoint, method, url });
            throw error;
        }
    }

    // Auth endpoints
    async login() {
        logger.logAuthEvent('login_redirect', { returnUrl: `${window.location.origin}/dashboard` });
        window.location.href = `${this.baseURL}/api/auth/login?returnUrl=${encodeURIComponent(window.location.origin)}/dashboard`;
    }

    async logout() {
        try {
            logger.logAuthEvent('logout_attempt');
            await this.request('/api/auth/logout', { method: 'POST' });
            logger.logAuthEvent('logout_success');
        } catch (error) {
            logger.logError(error, { context: 'logout' });
        }
    }

    async getCurrentUser() {
        logger.logAuthEvent('get_current_user');
        return await this.request('/api/auth/me');
    }

    // Blood sugar records endpoints
    async getRecords() {
        logger.logUserAction('get_records');
        return await this.request('/api/records');
    }

    async createRecord(record) {
        logger.logUserAction('create_record', { recordLevel: record.level });
        return await this.request('/api/records', {
            method: 'POST',
            body: JSON.stringify(record),
        });
    }

    async updateRecord(id, record) {
        logger.logUserAction('update_record', { recordId: id, recordLevel: record.level });
        return await this.request(`/api/records/${id}`, {
            method: 'PUT',
            body: JSON.stringify(record),
        });
    }

    async deleteRecord(id) {
        logger.logUserAction('delete_record', { recordId: id });
        return await this.request(`/api/records/${id}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck() {
        logger.debug('Health check request');
        return await this.request('/api/health');
    }
}

export default new ApiService(); 