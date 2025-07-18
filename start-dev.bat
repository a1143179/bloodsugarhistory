@echo off
echo Starting Medical Tracker Development Environment...
echo.

echo Checking port availability...

echo Checking port 3001 (Frontend)...
netstat -an | findstr ":3001 " | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ERROR: Port 3001 is already in use!
    echo Please stop the service using port 3001 and try again.
    pause
    exit /b 1
)
echo Port 3001 is available.

echo Checking port 3000 (Backend)...
netstat -an | findstr ":3000 " | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ERROR: Port 3000 is already in use!
    echo Please stop the service using port 3000 and try again.
    pause
    exit /b 1
)
echo Port 3000 is available.

echo All ports are available. Starting servers...
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
echo Starting backend server...
start "Backend Dev Server" cmd /k "dotnet run --urls http://localhost:3000"
cd ..

echo.
echo Development servers are starting in new windows...
echo Frontend will be available at: http://localhost:3001
echo Backend will be available at: http://localhost:3000
echo.
echo Script completed. Servers are running in separate windows. 