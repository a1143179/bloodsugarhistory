# Blood Sugar History Tracker

A comprehensive blood sugar tracking application with React frontend and .NET backend.

## Quick Start

### Prerequisites

- **Docker Desktop** - For PostgreSQL database
- **Node.js** (v16+) - For React frontend
- **.NET 9 SDK** - For backend API
- **Git Bash** (recommended) or **Command Prompt/PowerShell**

### Environment Setup

#### Google OAuth Configuration

This project uses Google OAuth for authentication. You need to set up Google OAuth credentials:

1. **For Local Development**:
   - Copy `backend/appsettings.Development.template.json` to `backend/appsettings.Development.json`
   - Add your Google OAuth Client ID and Client Secret to the file
   - The `appsettings.Development.json` file is gitignored to keep secrets local

2. **For Production/GitHub**:
   - Google OAuth credentials are stored as GitHub Secrets:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
   - The application will automatically use these environment variables in production

#### Development Environment Setup

#### Option 1: Using Git Bash (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start all services (database, backend, frontend build)
./start-dev.sh

# Start only the database
./start-dev.sh --db

# Start only the backend (requires database running)
./start-dev.sh --backend

# Build frontend and copy static files to backend (no servers started)
./start-dev.sh --frontend

# You can combine arguments to start any combination of services:
./start-dev.sh --db --backend    # Start database and backend only
./start-dev.sh --backend --frontend # Start backend and build frontend only
```

#### Option 2: Using Windows Command Prompt/PowerShell
```cmd
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start all services (database, backend, frontend build)
start-dev.bat

# Start only the database
start-dev.bat --db

# Start only the backend (requires database running)
start-dev.bat --backend

# Build frontend and copy static files to backend (no servers started)
start-dev.bat --frontend

# You can combine arguments to start any combination of services:
start-dev.bat --db --backend    # Start database and backend only
start-dev.bat --backend --frontend # Start backend and build frontend only
```

#### Script Modes Summary
| Mode/Combination         | Command (Linux/Mac)                | Command (Windows)                | What it does                                                      |
|-------------------------|-------------------------------------|----------------------------------|-------------------------------------------------------------------|
| Full                    | ./start-dev.sh                      | start-dev.bat                    | Starts database, backend, builds frontend, serves everything       |
| Database only           | ./start-dev.sh --db                 | start-dev.bat --db               | Starts only the PostgreSQL database                               |
| Backend only            | ./start-dev.sh --backend            | start-dev.bat --backend          | Starts only the backend (requires database running)               |
| Frontend only           | ./start-dev.sh --frontend           | start-dev.bat --frontend         | Builds frontend and copies static files to backend (no servers)    |
| Custom (combine flags)  | ./start-dev.sh --db --backend       | start-dev.bat --db --backend     | Starts database and backend only                                  |
| Custom (combine flags)  | ./start-dev.sh --backend --frontend | start-dev.bat --backend --frontend| Starts backend and builds frontend only                           |

> **Note:** You can combine `--db`, `--backend`, and `--frontend` in any order to start any combination of services you need.

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

3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432
  - Database: `bloodsugar`
  - Username: `postgres`
  - Password: `password`

## Features

- **User Authentication**: Email/password registration and login
- **Blood Sugar Tracking**: Add, edit, and delete blood sugar records
- **User-Specific Data**: Each user only sees their own records
- **Analytics Dashboard**: Charts and statistics for blood sugar trends
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

### Common Issues

1. **Port Already in Use**: The scripts will detect and offer to kill processes using required ports
2. **Docker Not Running**: Make sure Docker Desktop is started before running the scripts
3. **Git Bash lsof Error**: The updated scripts now use Windows-compatible commands
4. **Database Connection**: Ensure PostgreSQL container is running and accessible

### Windows-Specific Notes

- **Git Bash**: Use `./start-dev.sh` (updated to work with Windows commands)
- **Command Prompt**: Use `start-dev.bat`
- **PowerShell**: Use `start-dev.bat` or `./start-dev.sh`
- **Port Checking**: Scripts use `netstat` instead of `lsof` for Windows compatibility

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
├── start-dev.sh       # Git Bash startup script
├── start-dev.bat      # Windows startup script
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