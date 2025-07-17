class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.logLevel = this.isDevelopment ? 'debug' : 'info';
    }

    // Log levels in order of priority
    levels = {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    };

    shouldLog(level) {
        return this.levels[level] <= this.levels[this.logLevel];
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        
        if (data) {
            return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
        }
        return `${prefix} ${message}`;
    }

    error(message, data = null) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, data));
        }
    }

    warn(message, data = null) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    info(message, data = null) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message, data));
        }
    }

    debug(message, data = null) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }

    // Log API requests
    logApiRequest(method, url, data = null) {
        this.debug(`API Request: ${method} ${url}`, data);
    }

    // Log API responses
    logApiResponse(method, url, status, data = null) {
        this.debug(`API Response: ${method} ${url} - ${status}`, data);
    }

    // Log authentication events
    logAuthEvent(event, data = null) {
        this.info(`Auth Event: ${event}`, data);
    }

    // Log user actions
    logUserAction(action, data = null) {
        this.debug(`User Action: ${action}`, data);
    }

    // Log errors with stack trace
    logError(error, context = null) {
        this.error(`Error: ${error.message}`, {
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
        });
    }
}

export default new Logger(); 