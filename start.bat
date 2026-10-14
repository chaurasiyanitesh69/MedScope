@echo off
REM MedScope launcher for Windows — double-click this file, or run: start.bat
REM Starts serve.py with whichever Python is available. No packages needed.
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py serve.py %*
) else (
  python serve.py %*
)
