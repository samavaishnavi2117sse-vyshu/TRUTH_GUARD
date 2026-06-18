@echo off
setlocal enabledelayedexpansion

:: Move to script directory
cd /d "%~dp0"

echo.
echo ==========================================================
echo    TRUTHGUARD ANDROID -- APPIUM E2E TEST RUNNER
echo    135 Test Cases  ^|  8 Modules  ^|  Python 3.12 + Appium
echo ==========================================================
echo.

:: ── Java + Android SDK paths ───────────────────────────────────────────────
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\HP\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

echo [1/5] Environment configured.
echo   JAVA_HOME    = %JAVA_HOME%
echo   ANDROID_HOME = %ANDROID_HOME%
echo.

:: ── Virtual environment ────────────────────────────────────────────────────
if not exist "venv" (
    echo [2/5] Creating Python virtual environment...
    python -m venv venv
    if !errorlevel! neq 0 (
        echo ERROR: Failed to create virtual environment. Ensure Python 3.9+ is installed.
        pause & exit /b 1
    )
    echo       venv created successfully.
) else (
    echo [2/5] Virtual environment already exists.
)
echo.

:: ── Install / update dependencies ─────────────────────────────────────────
echo [3/5] Installing / updating dependencies...
venv\Scripts\pip.exe install --upgrade -r "%~dp0requirements.txt" --quiet
if !errorlevel! neq 0 (
    echo ERROR: pip install failed.
    pause & exit /b 1
)
echo       Dependencies ready.
echo.

:: ── Pre-flight checks ─────────────────────────────────────────────────────
echo [4/5] Pre-flight checks...

where adb >nul 2>&1
if !errorlevel! neq 0 (
    echo   [WARN] adb not found in PATH -- using SDK path.
)
"%ANDROID_HOME%\platform-tools\adb.exe" devices
echo.

where appium >nul 2>&1
if %errorlevel% neq 0 (
    echo   [INFO] Installing Appium globally.
    call npm install -g appium@3.0.0-rc.2
    if !errorlevel! neq 0 (
        echo   [ERROR] Failed to install Appium.
        pause & exit /b 1
    )
    call appium driver install uiautomator2
) else (
    echo   [INFO] Appium already installed.
)
echo   Appium version:
appium -v
echo.

:: ── Run tests ─────────────────────────────────────────────────────────────
echo [5/5] Launching Appium E2E Test Suite...
echo ----------------------------------------------------------
venv\Scripts\python.exe test.py
set EXIT_CODE=!errorlevel!
echo ----------------------------------------------------------

if !EXIT_CODE! neq 0 (
    echo.
    echo ERROR: Test runner exited with code !EXIT_CODE!
    echo Check the log above and the generated .xlsx report.
) else (
    echo.
    echo Testing complete! Open the Appium_E2E_Report_*.xlsx file for the full report.
)

echo.
pause
