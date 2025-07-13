const config = {
    development: {
        backendUrl: 'http://localhost:55556',
        frontendUrl: 'http://localhost:55555',
        googleClientId: '359243866499-mvar0u4reungd9a399j5761rmlsbb3p8.apps.googleusercontent.com', // Replace with your local Google Client ID
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