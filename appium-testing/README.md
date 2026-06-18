# 📱 TruthGuard Android — Appium E2E Test Suite

A complete end-to-end testing suite for the **TruthGuard Android application** built with Python + Appium 2.x + UIAutomator2.  
Mirrors the quality and report format of the Selenium suite in `TruthGuard-Web/selenium-testing/`.

---

## 📂 Folder Structure

```
appium-testing/
├── test.py                          ← Main test runner (135 test cases)
├── requirements.txt                 ← Python dependencies
├── run.bat                          ← One-click Windows launcher
├── README.md                        ← This file
├── test-summary.md                  ← Generated Markdown report (after run)
├── Appium_E2E_Report_*.xlsx         ← Generated Excel reports (after run)
└── venv/                            ← Python virtual environment (auto-created)
```

---

## 🧪 Test Coverage — 135 Test Cases, 8 Modules

| # | Module | Tests | What is Tested |
|---|--------|------:|----------------|
| 1 | **App Launch & Home Screen** | 22 | Launch, all 4 nav buttons, back navigation |
| 2 | **Verify News — UI Structure** | 18 | Input field, Analyze button, result card appearance |
| 3 | **Verify News — Analysis Logic** | 35 | Genuine/Fake detection, all 5 keywords × 3 cases, boundary inputs |
| 4 | **Trending News Screen** | 25 | All 5 cards (BBC/Reuters/NASA/Bloomberg/UNESCO), scroll, persistence |
| 5 | **Dashboard Screen** | 15 | All 4 stat cards (Articles Verified=25, True=18, Fake=7, Accuracy=92%) |
| 6 | **About Screen** | 11 | All card texts, copyright, shield emoji, re-entry persistence |
| 7 | **Device & Orientation** | 4 | Landscape/portrait rotation, Home key, screen-off/wake |
| 8 | **End-to-End Flows** | 5 | Full fake/genuine user journeys, all-screens cycle, state-reset check |

**Total: 135 test cases**

---

## ⚙️ Prerequisites

### Local (Windows)

| Requirement | Notes |
|---|---|
| Python 3.9+ | [python.org](https://www.python.org/) |
| Android Studio + SDK | API level 33 |
| AVD named `Pixel_6` | Create in AVD Manager |
| Node.js 18+ | [nodejs.org](https://nodejs.org/) |
| Appium 2.x | `npm install -g appium` |
| UIAutomator2 driver | `appium driver install uiautomator2` |
| TruthGuard Debug APK | Built with `./gradlew assembleDebug` |

### CI (GitHub Actions)

Everything is handled by `.github/workflows/android-tests.yml` — no manual setup needed.

---

## 🚀 Running Locally (Windows)

### Option 1 — One-click launcher
```bat
cd appium-testing
run.bat
```

### Option 2 — Manual
```bat
# 1. Create venv and install deps
python -m venv venv
venv\Scripts\pip install -r requirements.txt

# 2. Start Appium server (separate terminal)
npx appium --port 4723 --address 127.0.0.1

# 3. Start emulator (if not already running)
%ANDROID_HOME%\emulator\emulator.exe -avd Pixel_6

# 4. Build APK (from project root)
gradlew assembleDebug

# 5. Run tests
venv\Scripts\python test.py
```

---

## 📊 Reports

After every run, two reports are generated in this folder:

| Report | Description |
|---|---|
| `Appium_E2E_Report_TruthGuard_YYYYMMDD_HHMMSS.xlsx` | Full Excel report with 3 sheets: Summary, Test Cases, Failed Tests |
| `test-summary.md` | Markdown summary (also pushed to GitHub Actions Step Summary) |

### Excel Report Sheets
- **📊 Summary** — KPI boxes (Total / Passed / Failed / Pass Rate), execution details, module breakdown table  
- **🧪 Test Cases** — All 135 rows grouped by module with colour-coded PASSED/FAILED status  
- **❌ Failed Tests** — Appears only when failures exist; lists error messages for quick debugging  

---

## 🌐 CI — GitHub Actions

The workflow at [`.github/workflows/android-tests.yml`](../.github/workflows/android-tests.yml):

1. Builds the Debug APK with Gradle
2. Boots an Android API 33 emulator via `reactivecircus/android-emulator-runner@v2`
3. Starts Appium 2.11.5 server
4. Runs `test.py`
5. Publishes the Markdown summary to the **Actions Step Summary** tab
6. Uploads the Excel report as a downloadable **Artifact**

---

## 🔧 Configuration

Environment variables respected by `test.py`:

| Variable | Default (Windows) | Purpose |
|---|---|---|
| `ANDROID_HOME` | `C:\Users\HP\AppData\Local\Android\Sdk` | Android SDK root |
| `APK_PATH` | `app/build/outputs/apk/debug/app-debug.apk` | Path to the debug APK |
| `AVD_NAME` | `Pixel_6` | Emulator AVD name |
| `CI` | `false` | Set to `true` in CI to skip local emulator/Appium start |

---

## 📋 App Screens Under Test

| Screen | Route | Key Elements Tested |
|---|---|---|
| **Home** | `/home` | 🛡️ emoji, TRUTHGUARD title, AI subtitle, Version 1.0, 4 nav buttons |
| **Verify News** | `/verify` | OutlinedTextField, Paste News Here label, Analyze button, result card |
| **Trending News** | `/trending` | 📰 header, 5 news cards (title + source for each) |
| **Dashboard** | `/dashboard` | 📊 header, Articles Verified=25, True News=18, Fake News=7, Accuracy=92% |
| **About** | `/about` | 🛡️ emoji, TruthGuard title, version card, technology stack, © 2025 |
