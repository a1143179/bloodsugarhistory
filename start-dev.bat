@echo off
echo Starting Medical Tracker Development Environment...
echo.

echo Starting Frontend...
if not exist "node_modules" (
  echo Installing frontend dependencies...
  npm install
)
start "Frontend Dev Server" cmd /k "set PORT=3001 && npm start"

echo Waiting for frontend to start...
timeout /t 3 /nobreak >nul

echo Starting Backend...
cd backend
if not exist "bin" (
  echo Building backend...
  dotnet build
)
start "Backend Dev Server" cmd /k "dotnet run --urls http://localhost:3000"
cd ..

echo.
echo Development servers are starting in new windows...
echo Frontend will be available at: http://localhost:3001
echo Backend will be available at: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running in their windows)...
pause >nul
 