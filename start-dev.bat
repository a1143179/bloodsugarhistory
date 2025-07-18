@echo off
echo Starting Blood Sugar History Tracker (React App)...

REM Check if port 3000 is available
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo Port 3000 is already in use. Please close any applications using this port.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo Starting React development server...
echo The app will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the React development server
npm start

echo.
echo Development server stopped.
pause 