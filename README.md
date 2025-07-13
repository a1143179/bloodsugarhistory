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
   cd medicaltracker
   ```

2. **Install dependencies and start the frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access the application** at [http://localhost:3001](http://localhost:3001)

## Project Structure
```
medicaltracker/
├── frontend/          # React application
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   └── cypress/       # End-to-end tests
├── start-dev.bat      # Windows startup script (frontend only)
├── start-dev.sh       # Linux/Mac startup script (frontend only)
└── README.md          # This file
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
cd frontend
npm run cypress:run

# Open Cypress UI
npm run cypress:open
```

## Troubleshooting

- **Port Already in Use**: Make sure port 3001 is free before starting the frontend.
- **Node.js Not Installed**: Download from [nodejs.org](https://nodejs.org/).
- **Dependency Issues**: Run `npm install` again in the `frontend` directory.

## Development Scripts

- **Windows**: Use `start-dev.bat` (starts frontend only)
- **Linux/Mac**: Use `./start-dev.sh` (starts frontend only)

---

For any issues or feature requests, please open an issue in this repository.