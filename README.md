# Blood Sugar History Tracker - Redirect Site

This is a React application that serves as a redirect page for the Blood Sugar History Tracker. The main application has been moved to a new location.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start` or run `start-dev.bat`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build
```bash
npm run build
```

## 📋 Features

- **Automatic Redirect**: Automatically redirects users to the new application after 10 seconds
- **Manual Redirect**: Users can click "Redirect Now" to immediately go to the new site
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations

## 🔗 New Application Location

The main Blood Sugar History Tracker application is now available at:
**https://medicaltracker.azurewebsites.net**

## 🚀 Deployment

This application is automatically deployed to Azure when changes are pushed to the main branch via GitHub Actions.

### Deployment Details
- **Azure App Name**: bloodsugartracker
- **URL**: https://bloodsugartracker.azurewebsites.net
- **Deployment Trigger**: Push to main branch

## 🛠️ Technology Stack

- **Frontend**: React 19
- **Styling**: CSS3 with modern features (backdrop-filter, gradients)
- **Build Tool**: Create React App
- **Deployment**: Azure Web Apps with GitHub Actions

## 📁 Project Structure

```
bloodsugerhistory/
├── public/                 # Static files
├── src/                    # React source code
│   ├── components/         # React components
│   │   ├── RedirectPage.js # Main redirect component
│   │   └── RedirectPage.css
│   ├── App.js             # Main app component
│   └── index.js           # App entry point
├── .github/workflows/     # GitHub Actions workflows
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📝 License

This project is part of the Blood Sugar History Tracker application.