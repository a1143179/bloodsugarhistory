@echo off
echo Starting Medical Tracker Development Environment...
echo.

echo Starting Frontend...
if not exist "node_modules" (
  echo Installing frontend dependencies...
  npm install
)
start /b "Frontend Dev Server" cmd /c "npm start"

echo Waiting for frontend to start...
timeout /t 3 /nobreak >nul

echo Starting Backend...
cd backend
if not exist "bin" (
  echo Building backend...
  dotnet build
)
start /b "Backend Dev Server" cmd /c "dotnet run"
cd ..

echo.
echo Development servers are starting...
echo Frontend will be available at: http://localhost:55555
echo Backend will be available at: http://localhost:55556
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul
 