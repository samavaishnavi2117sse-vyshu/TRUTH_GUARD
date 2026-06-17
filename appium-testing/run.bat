@echo off
setlocal enabledelayedexpansion

echo ==========================================================
echo   🛡️  TRUTHGUARD ANDROID — APPIUM TEST RUNNER LAUNCHER
echo ==========================================================

:: Set Java and Android SDK paths
echo Configured JAVA_HOME and Android SDK paths...
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\HP\AppData\Local\Android\Sdk"

:: Update PATH
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

:: Check if Python is installed in venv, if not create venv
if not exist "venv" (
    echo Virtual environment 'venv' not found. Creating virtual environment...
    "C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe" -m venv venv
    if !errorlevel! neq 0 (
        echo Error: Failed to create python virtual environment.
        exit /b 1
    )
)

:: Install dependencies
echo Installing requirements...
venv\Scripts\pip.exe install -r requirements.txt
if !errorlevel! neq 0 (
    echo Error: Failed to install pip requirements.
    exit /b 1
)

:: Execute tests
echo Launching Appium Test Suite...
venv\Scripts\python.exe test.py
if !errorlevel! neq 0 (
    echo Error: Test execution failed.
    exit /b 1
)

echo.
echo ✨ Execution completed successfully!
pause
