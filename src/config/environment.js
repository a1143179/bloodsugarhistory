const config = {
    development: {
        backendUrl: 'http://localhost:55556',
        frontendUrl: 'http://localhost:55555',
        environment: 'development'
    },
    production: {
        backendUrl: 'https://medicaltrackerbackend.azurewebsites.net',
        frontendUrl: 'https://medicaltracker.azurewebsites.net',
        environment: 'production'
    }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment]; 