import config from '../config/environment';
import logger from './logger';

class ApiService {
    constructor() {
        this.baseURL = config.backendUrl;
        logger.info('API Service initialized', { baseURL: this.baseURL });
    }

    // Make authenticated API request
    async request(endpoint, options = {}, accessToken = null) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        
        logger.logApiRequest(method, url, {
            hasAccessToken: !!accessToken,
            headers: options.headers
        });

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
            let response = await fetch(url, configObj);

            logger.logApiResponse(method, url, response.status);

            if (response.status === 401 && endpoint !== '/api/auth/refresh') {
                logger.warn('Unauthorized request, attempting token refresh', { endpoint });
                // Try to refresh token
                const refreshRes = await this.refreshToken();
                if (refreshRes && refreshRes.accessToken) {
                    logger.info('Token refresh successful, retrying original request');
                    // Retry original request with new access token
                    configObj.headers.Authorization = `Bearer ${refreshRes.accessToken}`;
                    response = await fetch(url, configObj);
                    logger.logApiResponse(method, url, response.status, 'retry');
                } else {
                    logger.warn('Token refresh failed, redirecting to login');
                    window.location.href = '/login';
                    return null;
                }
            }

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

    async getCurrentUser(accessToken) {
        logger.logAuthEvent('get_current_user', { hasToken: !!accessToken });
        return await this.request('/api/auth/me', {}, accessToken);
    }

    async refreshToken() {
        logger.logAuthEvent('refresh_token_attempt');
        // Backend should read refresh token from HTTP-only cookie
        try {
            const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                logger.warn('Token refresh failed', { status: response.status });
                return null;
            }
            const data = await response.json();
            logger.logAuthEvent('refresh_token_success');
            return data;
        } catch (error) {
            logger.logError(error, { context: 'refresh_token' });
            return null;
        }
    }

    // Blood sugar records endpoints
    async getRecords(accessToken) {
        logger.logUserAction('get_records');
        return await this.request('/api/records', {}, accessToken);
    }

    async createRecord(record, accessToken) {
        logger.logUserAction('create_record', { recordLevel: record.level });
        return await this.request('/api/records', {
            method: 'POST',
            body: JSON.stringify(record),
        }, accessToken);
    }

    async updateRecord(id, record, accessToken) {
        logger.logUserAction('update_record', { recordId: id, recordLevel: record.level });
        return await this.request(`/api/records/${id}`, {
            method: 'PUT',
            body: JSON.stringify(record),
        }, accessToken);
    }

    async deleteRecord(id, accessToken) {
        logger.logUserAction('delete_record', { recordId: id });
        return await this.request(`/api/records/${id}`, {
            method: 'DELETE',
        }, accessToken);
    }

    // Health check
    async healthCheck() {
        logger.debug('Health check request');
        return await this.request('/api/health');
    }
}

export default new ApiService(); 