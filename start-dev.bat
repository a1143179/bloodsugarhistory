@echo off
echo Starting Medical Tracker Development Environment...
echo.

echo Starting Frontend...
cd frontend
start "Frontend Dev Server" cmd /k "start-dev.bat"
cd ..

echo Starting Backend...
cd backend
start "Backend Dev Server" cmd /k "start-dev.bat"
cd ..

echo.
echo Development servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:55556
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul 