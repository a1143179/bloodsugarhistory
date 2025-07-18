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
- **Azure App Name**: bloodsugarhistory
- **URL**: https://bloodsugarhistory.azurewebsites.net
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

---

## ⚠️ Azure Deployment Troubleshooting

If you deploy and only see `hostingstart.html` in the Azure App Service `/wwwroot/` directory, or the old site is still showing, follow these steps:

1. **Check the GitHub Actions logs**
   - Ensure the `build/` directory contains `index.html` and your static files before deployment.
2. **Verify the Azure Publish Profile**
   - Go to Azure Portal → App Services → `bloodsugarhistory` → Get publish profile.
   - Download and open the `.PublishSettings` file.
   - In GitHub, go to Settings → Secrets and variables → Actions.
   - Update the `AZURE_WEBAPP_PUBLISH_PROFILE` secret with the new file's contents.
3. **Trigger a new deployment**
   - Push any change to the repository to trigger the workflow.
4. **Check Azure Kudu Console**
   - Go to https://bloodsugarhistory.scm.azurewebsites.net/DebugConsole
   - Navigate to `site/wwwroot` and confirm your React build files are present.
5. **Restart the App Service**
   - In Azure Portal, select your app and click Restart.

If you still see issues, make sure:
- The publish profile is for the correct app and production slot.
- The workflow is not deploying to a slot unless intended.
- The workflow is using `package: build/` for React apps.

For manual deployment, you can zip the contents of the `build/` folder and use Azure Portal's Zip Deploy feature.