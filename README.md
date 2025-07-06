# Blood Sugar History Tracker

A comprehensive blood sugar tracking application with React frontend and .NET backend.

## Quick Start

### Prerequisites

- **Docker Desktop** - For PostgreSQL database
- **Node.js** (v16+) - For React frontend
- **.NET 9 SDK** - For backend API
- **Git Bash** (recommended) or **Command Prompt/PowerShell**

### Development Environment Setup

#### Option 1: Using Git Bash (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start all services
./start-dev.sh

# Or start database only
./start-dev.sh --db-only
```

#### Option 2: Using Windows Command Prompt/PowerShell
```cmd
# Clone the repository
git clone <repository-url>
cd bloodsugerhistory

# Start all services
start-dev.bat

# Or start database only
start-dev.bat --db-only
```

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
- **Backend API**: http://localhost:8080
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