@echo off
echo ========================================
echo Reorganizing Project Structure
echo ========================================
echo.

REM Create frontend directory
echo Creating frontend directory...
mkdir frontend 2>nul

REM Move React/Vite files to frontend
echo Moving frontend files...
move src frontend\ 2>nul
move node_modules frontend\ 2>nul
move public frontend\ 2>nul
move index.html frontend\ 2>nul
move package.json frontend\package.json.temp 2>nul
move package-lock.json frontend\package-lock.json.temp 2>nul
move tsconfig.json frontend\ 2>nul
move vite.config.ts frontend\ 2>nul
move tailwind.config.js frontend\ 2>nul
move postcss.config.js frontend\ 2>nul

REM Rename package files
echo Renaming package files...
cd frontend
if exist package.json.temp (
    del package.json 2>nul
    ren package.json.temp package.json
)
if exist package-lock.json.temp (
    del package-lock.json 2>nul
    ren package-lock.json.temp package-lock.json
)
cd ..

REM Create new root package.json
echo Creating root package.json...
(
echo {
echo   "name": "nidhi-track",
echo   "version": "1.0.0",
echo   "description": "AICTE Security Deposit Management Portal",
echo   "private": true,
echo   "scripts": {
echo     "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
echo     "dev:backend": "cd backend ^&^& npm run dev",
echo     "dev:frontend": "cd frontend ^&^^ npm run dev",
echo     "start:backend": "cd backend ^&^& npm start",
echo     "start:frontend": "cd frontend ^&^& npm run dev",
echo     "install:all": "npm install ^&^& cd backend ^&^& npm install ^&^& cd ../frontend ^&^& npm install"
echo   },
echo   "keywords": ["aicte", "fdr", "management"],
echo   "author": "Prakash",
echo   "license": "ISC"
echo }
) > package.json

echo.
echo ========================================
echo Reorganization Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install dependencies: npm run install:all
echo 2. Start backend: npm run dev:backend
echo 3. Start frontend: npm run dev:frontend
echo.
pause
