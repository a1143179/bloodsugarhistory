# Blood Sugar History Tracker

A comprehensive blood sugar tracking application with React frontend and .NET backend.

## Quick Start

### Prerequisites

- **Docker Desktop** - For PostgreSQL database
- **Node.js** (v16+) - For React frontend
- **.NET 9 SDK** - For backend API
- **Git Bash** (recommended) or **Command Prompt/PowerShell**

### First-Time Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bloodsugerhistory
   ```

2. **Set up development environment**:
   ```bash
   # On Windows
   setup-dev.bat
   
   # On Linux/Mac
   ./setup-dev.sh
   ```

3. **Add your Google OAuth credentials** to `backend/appsettings.Development.json`

4. **Start the application**:
   ```bash
   # On Windows
   start-dev.bat
   
   # On Linux/Mac
   ./start-dev.sh
   ```

5. **Access the application** at `http://localhost:3000`

### Environment Setup

#### Google OAuth Configuration

This project uses Google OAuth for authentication. You need to set up Google OAuth credentials:

1. **For Local Development**:
   - Copy `backend/appsettings.Development.template.json` to `backend/appsettings.Development.json`
   - Replace the placeholder values with your actual Google OAuth credentials:
     - `YOUR_GOOGLE_CLIENT_ID_HERE` → Your actual Google Client ID
     - `YOUR_GOOGLE_CLIENT_SECRET_HERE` → Your actual Google Client Secret
   - The `appsettings.Development.json` file is gitignored to keep secrets local

2. **For Production/GitHub**:
   - Google OAuth credentials are stored as GitHub Secrets:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
   - The application will automatically use these environment variables in production

#### Setting Up Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback` (for development)
     - `https://yourdomain.com/api/auth/callback` (for production)
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
5. **Copy the credentials**:
   - Copy the Client ID and Client Secret
   - Paste them into your `backend/appsettings.Development.json` file

#### Development Environment Setup

#### Step 1: Initial Setup
Before starting the application, you need to set up your development environment:

**Option A: Using Setup Scripts (Recommended)**
```bash
# On Windows
setup-dev.bat

# On Linux/Mac/Git Bash
./setup-dev.sh
```

**Option B: Manual Setup**
```bash
# Copy the template file
cp backend/appsettings.Development.template.json backend/appsettings.Development.json

# Edit the file and add your Google OAuth credentials
# Replace YOUR_GOOGLE_CLIENT_ID_HERE and YOUR_GOOGLE_CLIENT_SECRET_HERE
```

#### Step 2: Start the Application

**Windows (Command Prompt/PowerShell)**
```cmd
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start full development environment (database, backend, React dev server)
start-dev.bat

# Start only the database
start-dev.bat --db

# Start only the backend (requires database running)
start-dev.bat --backend

# Start only React dev server
start-dev.bat --frontend

# You can combine arguments to start any combination of services:
start-dev.bat --db --backend    # Start database and backend only
start-dev.bat --backend --frontend # Start backend and React dev server only
```

**Linux/Mac (Terminal)**
```bash
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start full development environment (database, backend, React dev server)
./start-dev.sh

# Start only the database
./start-dev.sh --db

# Start only the backend (requires database running)
./start-dev.sh --backend

# Start only React dev server
./start-dev.sh --frontend

# You can combine arguments to start any combination of services:
./start-dev.sh --db --backend    # Start database and backend only
./start-dev.sh --backend --frontend # Start backend and React dev server only
```

#### Script Modes Summary
| Mode/Combination         | Command (Windows)                    | Command (Linux/Mac)                | What it does                                                      |
|-------------------------|--------------------------------------|-----------------------------------|-------------------------------------------------------------------|
| Full Development        | start-dev.bat                        | ./start-dev.sh                    | Starts database (port 5432), backend (port 3000), frontend (port 3001) |
| Database only           | start-dev.bat --db                   | ./start-dev.sh --db               | Starts only the PostgreSQL database                               |
| Backend only            | start-dev.bat --backend              | ./start-dev.sh --backend          | Starts only the backend (requires database running)               |
| Frontend dev server     | start-dev.bat --frontend             | ./start-dev.sh --frontend         | Starts only React dev server (port 3001)                          |
| Custom (combine flags)  | start-dev.bat --db --backend         | ./start-dev.sh --db --backend     | Starts database and backend only                                  |

> **Note:** You can combine `--db`, `--backend`, and `--frontend` in any order to start any combination of services you need.

### Development Architecture

The application uses a **proxy development setup** for optimal development experience:

- **Database**: Runs on port 5432 (PostgreSQL)
- **Backend**: Runs on port 3000 with hot reload
- **React Dev Server**: Runs on port 3001 with hot reload
- **Proxy**: Backend forwards frontend requests to React dev server
- **Single Domain**: All requests go through `localhost:3000` for proper session management

This setup provides:
- ✅ **Hot reload** for both frontend and backend
- ✅ **Same-domain cookies** for authentication
- ✅ **No CORS issues** during development
- ✅ **Seamless development experience**

### Manual Setup (Alternative)

If you prefer to start services manually:

1. **Start Database**:
   ```bash
   docker run -d --name bloodsugar-postgres -e POSTGRES_DB=bloodsugar -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
   ```

2. **Start Backend**:
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```

3. **Start React Dev Server**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Access Points

- **Application**: http://localhost:5000 (main entry point)
- **Backend API**: http://localhost:5000/api
- **React Dev Server**: http://localhost:3000 (direct access, not needed)
- **Database**: localhost:5432
  - Database: `bloodsugar`
  - Username: `postgres`
  - Password: `password`

## Production Deployment

### Docker Deployment

The application is containerized and ready for production deployment. The Dockerfile creates a multi-stage build that:

1. **Builds the React frontend** and creates static files
2. **Builds the .NET backend** 
3. **Creates a final image** that serves both frontend and backend on port 3000

#### Quick Deployment

```bash
# Build the Docker image
docker build -t bloodsugar-app .

# Run the container
docker run -d \
  --name bloodsugar-app \
  -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=your_google_client_id \
  -e GOOGLE_CLIENT_SECRET=your_google_client_secret \
  -e ConnectionStrings__DefaultConnection="your_production_database_connection_string" \
  bloodsugar-app
```

#### Environment Variables for Production

Set these environment variables in your production environment:

```bash
# Required for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database connection
ConnectionStrings__DefaultConnection=your_production_database_connection_string

# Application settings
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:3000
```

#### Google OAuth Production Setup

1. **Update Google OAuth Console**:
   - Add your production domain to "Authorized redirect URIs":
     - `https://yourdomain.com/api/auth/callback`
   - Add your production domain to "Authorized JavaScript origins":
     - `https://yourdomain.com`

2. **Environment Variables**:
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your production environment
   - The application automatically detects the current domain and uses appropriate redirect URIs

#### Production Features

- **Automatic HTTPS Detection**: Cookies and security settings automatically adjust for HTTPS in production
- **Dynamic OAuth URLs**: Redirect URIs are automatically determined based on the current request
- **Static File Serving**: Frontend is built and served as static files by the backend
- **Single Port**: Everything runs on port 3000, eliminating CORS and session issues
- **Environment-Agnostic**: Works in any environment without configuration changes
- **Proxy Development**: Development environment uses proxy setup for hot reload and same-domain cookies

#### Cloud Platform Deployment

**Azure App Service**:
```bash
# Deploy to Azure
az webapp up --name your-app-name --resource-group your-resource-group --runtime "DOTNETCORE:9.0"
```

**AWS ECS/Fargate**:
```bash
# Build and push to ECR
docker build -t bloodsugar-app .
docker tag bloodsugar-app:latest your-ecr-repo:latest
docker push your-ecr-repo:latest
```

**Google Cloud Run**:
```bash
# Deploy to Cloud Run
gcloud run deploy bloodsugar-app --image gcr.io/your-project/bloodsugar-app --platform managed
```

### Production Database Setup

For production, use a managed PostgreSQL service:

- **Azure Database for PostgreSQL**
- **AWS RDS for PostgreSQL**
- **Google Cloud SQL**
- **Heroku Postgres**

Update the connection string in your production environment variables.

## Features

- **User Authentication**: Email/password registration and login
- **Blood Sugar Tracking**: Add, edit, and delete blood sugar records
- **User-Specific Data**: Each user only sees their own records
- **Analytics Dashboard**: Charts and statistics for blood sugar trends
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

### Common Issues

1. **Port Already in Use**: The scripts automatically kill processes using required ports before starting services
2. **Docker Not Running**: Make sure Docker Desktop is started before running the scripts
3. **Database Connection**: Ensure PostgreSQL container is running and accessible
4. **Google OAuth "Missing required parameter: client_id"**: 
   - Make sure you've copied `backend/appsettings.Development.template.json` to `backend/appsettings.Development.json`
   - Replace the placeholder values with your actual Google OAuth credentials
   - Ensure your Google OAuth redirect URIs include `http://localhost:5000/api/auth/callback`
5. **Google OAuth "redirect_uri_mismatch"**: 
   - Check that your Google OAuth console has the correct redirect URIs configured
   - For development: `http://localhost:5000/api/auth/callback`
   - For production: `https://yourdomain.com/api/auth/callback`
6. **React Dev Server Slow to Start**: On first run, React dev server may take 30-60 seconds to start
7. **Proxy Issues**: If you can't access the app, ensure both backend (port 5000) and React dev server (port 3000) are running
8. **Argument Parsing**: Ensure you're using the correct script for your platform (`.bat` for Windows, `.sh` for Linux/Mac)

### Cross-Platform Compatibility

The project provides platform-specific startup scripts:

- **Windows**: Use `start-dev.bat` (Command Prompt/PowerShell)
- **Ubuntu/Linux**: Use `./start-dev.sh` (native bash)
- **macOS**: Use `./start-dev.sh` (native bash)
- **Port Management**: Scripts automatically kill processes using required ports before starting services
- **Development Ports**: Backend runs on port 5000, React dev server on port 3000

> **Note**: Each platform uses its native script for optimal compatibility and performance.

## Production Email Sending with Mailjet

This project uses [Mailjet](https://www.mailjet.com/) to send emails in production (registration, password reset, etc.).

### Configuration

Add your Mailjet credentials to `backend/appsettings.json` (for production) and `backend/appsettings.Development.json` (for local testing):

```
"Mailjet": {
  "ApiKey": "YOUR_MAILJET_API_KEY",
  "ApiSecret": "YOUR_MAILJET_API_SECRET",
  "FromEmail": "noreply@yourdomain.com",
  "FromName": "Blood Sugar Tracker"
}
```

- **ApiKey** and **ApiSecret**: Get these from your Mailjet dashboard.
- **FromEmail**: The sender email address (must be validated in Mailjet).
- **FromName**: The sender name (e.g., "Blood Sugar Tracker").

### How it works
- In production, verification and reset codes are sent via Mailjet.
- In development, codes are returned in the API response for easy testing.

### Where to set keys
- For local dev: `backend/appsettings.Development.json`
- For production: `backend/appsettings.json` (or use environment variables in your cloud host)

### Mailjet Resources
- [Mailjet Dashboard](https://app.mailjet.com/)
- [Mailjet API Docs](https://dev.mailjet.com/email/guides/send-api-v3/)

## 🧪 Mailjet Test Emails for Cypress Testing

This project includes **advanced test email functionality** using Mailjet's sandbox mode for reliable Cypress testing.

### Key Features
- ✅ **Sandbox Mode**: Emails captured but not delivered to real users
- ✅ **API Retrieval**: Retrieve verification codes via Mailjet API
- ✅ **Cypress Integration**: Custom commands for email testing
- ✅ **Production Ready**: Works in both development and production

### Quick Setup
1. **Get Mailjet API Keys** from [Mailjet Dashboard](https://app.mailjet.com/account/api_keys)
2. **Verify Sender Email** in [Sender & Domains](https://app.mailjet.com/account/sender)
3. **Update Configuration** with your API keys
4. **Run Tests** with real email functionality

### Usage in Cypress Tests
```javascript
import { mailjetTestUtils } from '../support/mailjet-test-utils';

// Send test email and get verification code
mailjetTestUtils.waitForEmailCode('test@example.com', 10, 1000)
  .then((code) => {
    cy.get('input[name="code"]').type(code);
    cy.contains('Verify').click();
  });
```

### Benefits
- **Realistic Testing**: Uses actual Mailjet infrastructure
- **No Spam**: Sandbox mode prevents real email delivery
- **Reliable**: API-based retrieval is more reliable than email parsing
- **Cost-Effective**: Uses Mailjet's free tier (200 emails/day)

📖 **Full Documentation**: See [MAILJET_TEST_EMAILS.md](frontend/MAILJET_TEST_EMAILS.md) for complete setup and usage guide.

## Development

### Project Structure
```
bloodsugerhistory/
├── frontend/          # React application
├── backend/           # .NET API
├── start-dev.bat      # Windows startup script
├── start-dev.sh       # Linux/Mac startup script
└── README.md          # This file
```

### Database Migrations

The backend automatically runs migrations on startup. If you need to run migrations manually:

```bash
cd backend
dotnet ef database update
```

### Adding New Features

1. **Backend Changes**: Modify API endpoints in `backend/Program.cs`
2. **Frontend Changes**: Update React components in `frontend/src/`
3. **Database Changes**: Create new migrations with `dotnet ef migrations add <name>`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.