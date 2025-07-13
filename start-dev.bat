@echo off
echo Starting Medical Tracker Development Environment...
echo.

echo Starting Frontend...
if not exist "node_modules" (
  echo Installing frontend dependencies...
  npm install
)
start "Frontend Dev Server" cmd /k "npm start"

echo Starting Backend...
cd backend
if not exist "bin" (
  echo Building backend...
  dotnet build
)
start "Backend Dev Server" cmd /k "dotnet run"
cd ..

echo.
echo Development servers are starting...
echo Frontend will be available at: http://localhost:55555
echo Backend will be available at: http://localhost:55556
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul
 