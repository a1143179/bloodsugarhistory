const config = {
    development: {
        backendUrl: 'http://localhost:55556',
        frontendUrl: 'http://localhost:55555',
        googleClientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your local Google Client ID
        environment: 'development'
    },
    production: {
        backendUrl: 'https://medicaltrackerbackend.azurewebsites.net',
        frontendUrl: 'https://medicaltracker.azurewebsites.net',
        googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        environment: 'production'
    }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment]; 