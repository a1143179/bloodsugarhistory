@echo off
setlocal enabledelayedexpansion

REM Check Node.js is installed
for /f "delims=" %%V in ('node --version 2^>nul') do set NODE_VERSION=%%V
if not defined NODE_VERSION (
  echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/ or restart your terminal after installation.
  exit /b 1
)
echo Node.js version: !NODE_VERSION!

echo Starting React development server on port 3001...
cd frontend
if not exist "node_modules" (
  echo Installing frontend dependencies...
  npm install
)
set PORT=3001
start "frontend" npm start
cd ..
echo.
echo Frontend started successfully! Access it at http://localhost:3001 