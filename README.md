# Medical Tracker Frontend

A modern React application for tracking blood sugar history and analytics.

## Quick Start

### Prerequisites
- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)

### First-Time Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd medical-tracker-frontend
   ```

2. **Setup Google OAuth (Required)**:
   - Copy `backend\appsettings.Development.json.example` to `backend\appsettings.Development.json`
   - Add your Google OAuth credentials to `backend\appsettings.Development.json`:
     - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID
     - Replace `YOUR_GOOGLE_CLIENT_SECRET_HERE` with your actual Google Client Secret
   - See [Google OAuth Setup Guide](GOOGLE_OAUTH_SETUP.md) for detailed instructions

3. **Install dependencies and start the app**:
   ```bash
   npm install
   npm start
   ```

4. **Access the application** at [http://localhost:55555](http://localhost:55555)

## Project Structure
```
medical-tracker-frontend/
├── public/        # Static assets
├── src/           # React source code
├── cypress/       # End-to-end tests
├── start-dev.bat  # Windows startup script (frontend only)
├── start-dev.sh   # Linux/Mac startup script (frontend only)
└── README.md      # This file
```

## Features
- **Blood Sugar Tracking**: Add, edit, and delete blood sugar records
- **Analytics Dashboard**: Charts and statistics for blood sugar trends
- **Responsive Design**: Works on desktop and mobile devices
- **Multi-language Support**: Internationalization support

## Frontend Testing

The project includes comprehensive Cypress tests for the frontend:

```bash
# Run Cypress tests
npm run cypress:run

# Open Cypress UI
npm run cypress:open
```

## Troubleshooting

- **Port Already in Use**: Make sure port 3000 is free before starting the app.
- **Node.js Not Installed**: Download from [nodejs.org](https://nodejs.org/).
- **Dependency Issues**: Run `npm install` again in the project root directory.

## Development Scripts

- **Windows**: Use `start-dev.bat` (starts frontend only)
- **Linux/Mac**: Use `./start-dev.sh` (starts frontend only)

## Manual Setup (Alternative to setup-dev.bat)

If you need to manually set up the development environment:

1. **Create appsettings.Development.json**:
   ```bash
   copy backend\appsettings.Development.json.example backend\appsettings.Development.json
   ```

2. **Add Google OAuth credentials** to `backend\appsettings.Development.json`:
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID
   - Replace `YOUR_GOOGLE_CLIENT_SECRET_HERE` with your actual Google Client Secret

3. **Start the application**:
   ```bash
   start-dev.bat
   ```

---

For any issues or feature requests, please open an issue in this repository.