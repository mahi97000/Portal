@echo off
title EDIZ IT Institute - PC Software Builder
echo ===================================================
echo   Building EDIZ IT Institute PC Software (.exe)...
echo ===================================================
cd /d "%~dp0Desktop_App"
echo Packaging Windows Installer and Portable Executable...
call npm.cmd run build
echo.
echo ===================================================
echo   Build completed!
echo   Installer & Portable .exe are in: Desktop_App\dist
echo ===================================================
pause
