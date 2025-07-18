@echo off
echo Starting Redirect Page Test Environment...
echo.

echo Installing http-server if not available...
npm install -g http-server 2>nul

echo Starting local server for redirect page...
cd public
start /b "Local Redirect Server" cmd /c "http-server -p 3000 -o"

echo.
echo Redirect page is now available at: http://localhost:3000
echo This will show the redirect page that counts down to https://medicaltracker.azurewebsites.net
echo.
echo Press any key to exit this script (server will continue running)...
pause >nul
 