
/**
 * TruthGuard Web Application - Selenium E2E Test Suite
 * 135 Test Cases covering all modules and user flows
 * Report: Selenium_E2E_Report_TruthGuard.xlsx
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ExcelJS = require('exceljs');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const REPORT_FILE = path.join(__dirname, `Selenium_E2E_Report_TruthGuard_${new Date().toISOString().replace(/[:.]/g, '-').slice(0,19)}.xlsx`);
const WEB_APP_DIR = path.join(__dirname, '../web-app');

let serverProcess = null;
let driver = null;
const results = [];
let suiteStart = Date.now();

// ─── COLORS ───────────────────────────────────────────────────────────────────
const COLORS = {
  headerBg:   '1A1A2E',   // Dark navy
  headerText: 'FFFFFF',
  subHeaderBg:'16213E',
  moduleBg:   '0F3460',
  moduleText: 'E94560',
  passedBg:   'D4EDDA',
  passedText: '155724',
  failedBg:   'F8D7DA',
  failedText: '721C24',
  skippedBg:  'FFF3CD',
  skippedText:'856404',
  rowAlt:     'F8F9FA',
  rowNorm:    'FFFFFF',
  accent:     '0F3460',
  statPass:   '28A745',
  statFail:   'DC3545',
  statTotal:  '17A2B8',
  border:     'BDC3C7',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function log(status, id, name, duration, err = '') {
  const icon = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⚠️';
  console.log(`  ${icon} [${id}] ${name} (${duration}ms)${err ? ' → ' + err.substring(0, 80) : ''}`);
}

function record(module, id, name, desc, status, duration, error = '') {
  results.push({ module, id, name, desc, status, duration, error });
  log(status, id, name, duration, error);
}

async function tc(module, id, name, desc, fn) {
  const t0 = Date.now();
  try {
    await fn();
    record(module, id, name, desc, 'PASSED', Date.now() - t0);
  } catch (e) {
    record(module, id, name, desc, 'FAILED', Date.now() - t0, e.message || String(e));
  }
}

async function navigateTo(screen) {
  const navId = { home: 'nav-home', verify: 'nav-verify', trending: 'nav-trending', dashboard: 'nav-dashboard', about: 'nav-about' }[screen];
  await driver.findElement(By.id(navId)).click();
  await driver.sleep(400);
}

async function goHome() {
  await driver.get(BASE_URL);
  await driver.sleep(800);
}

async function analyzeNews(text) {
  await navigateTo('verify');
  const input = await driver.findElement(By.id('news-input'));
  await input.clear();
  await input.sendKeys(text);
  await driver.findElement(By.id('analyze-btn')).click();
  await driver.sleep(500);
}

// ─── SERVER ───────────────────────────────────────────────────────────────────
function startServer() {
  return new Promise((resolve) => {
    console.log('\n🚀 Starting TruthGuard Web Server...');
    serverProcess = spawn('node', [path.join(WEB_APP_DIR, 'server.js')], {
      env: { ...process.env, PORT },
    });
    serverProcess.stdout.on('data', (d) => {
      process.stdout.write(`  [server] ${d}`);
      if (d.toString().includes('running on')) resolve();
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`  [server-err] ${d}`));
    setTimeout(resolve, 8000);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TEST SUITES
// ═══════════════════════════════════════════════════════════════════════════════
async function runTests() {
  const opts = new chrome.Options()
    .addArguments('--headless=new', '--no-sandbox', '--disable-gpu',
                  '--disable-dev-shm-usage', '--window-size=1400,900');

  console.log('\n🧪 Initializing Chrome WebDriver (headless)...');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

  // ── MODULE 1: PAGE LOAD & GLOBAL STRUCTURE (TC-001 – TC-012) ──────────────
  console.log('\n📋 MODULE 1: Page Load & Global Structure');
  await goHome();

  await tc('Page Load', 'TC-001', 'App loads successfully', 'Navigate to BASE_URL and expect no errors', async () => {
    const url = await driver.getCurrentUrl();
    if (!url.startsWith(BASE_URL)) throw new Error(`Unexpected URL: ${url}`);
  });

  await tc('Page Load', 'TC-002', 'Browser tab title correct', 'Title must contain TruthGuard', async () => {
    const title = await driver.getTitle();
    if (!title.includes('TruthGuard')) throw new Error(`Got title: "${title}"`);
  });

  await tc('Page Load', 'TC-003', 'Sidebar exists in DOM', 'aside.sidebar element present', async () => {
    await driver.findElement(By.css('aside.sidebar'));
  });

  await tc('Page Load', 'TC-004', 'Main content area exists', 'main.main-content element present', async () => {
    await driver.findElement(By.css('main.main-content'));
  });

  await tc('Page Load', 'TC-005', 'App container wraps layout', 'div.app-container present', async () => {
    await driver.findElement(By.css('div.app-container'));
  });

  await tc('Page Load', 'TC-006', 'All 5 screens exist in DOM', 'All screen-* sections present', async () => {
    const ids = ['screen-home','screen-verify','screen-trending','screen-dashboard','screen-about'];
    for (const id of ids) await driver.findElement(By.id(id));
  });

  await tc('Page Load', 'TC-007', 'Home screen active on load', '#screen-home has "active" class', async () => {
    const cls = await driver.findElement(By.id('screen-home')).getAttribute('class');
    if (!cls.includes('active')) throw new Error(`Home screen not active. Classes: ${cls}`);
  });

  await tc('Page Load', 'TC-008', 'Only one screen active on load', 'Exactly 1 screen-section has active class', async () => {
    const actives = await driver.findElements(By.css('.screen-section.active'));
    if (actives.length !== 1) throw new Error(`Expected 1 active screen, got ${actives.length}`);
  });

  await tc('Page Load', 'TC-009', 'Page has viewport meta tag', 'Responsive meta tag present', async () => {
    const meta = await driver.findElement(By.css('meta[name="viewport"]'));
    const content = await meta.getAttribute('content');
    if (!content.includes('width=device-width')) throw new Error('Viewport meta incorrect');
  });

  await tc('Page Load', 'TC-010', 'Google Fonts linked', 'Outfit/Jakarta Sans font stylesheet present', async () => {
    const links = await driver.findElements(By.css('link[href*="fonts.googleapis.com"]'));
    if (links.length === 0) throw new Error('No Google Fonts link found');
  });

  await tc('Page Load', 'TC-011', 'CSS stylesheet linked', 'style.css link present', async () => {
    const link = await driver.findElement(By.css('link[href="style.css"]'));
    if (!link) throw new Error('style.css not linked');
  });

  await tc('Page Load', 'TC-012', 'JS app module linked', 'app.js script module present', async () => {
    const script = await driver.findElement(By.css('script[src="app.js"]'));
    if (!script) throw new Error('app.js script not found');
  });

  // ── MODULE 2: SIDEBAR NAVIGATION (TC-013 – TC-030) ───────────────────────
  console.log('\n📋 MODULE 2: Sidebar Navigation');
  await goHome();

  await tc('Navigation', 'TC-013', 'Sidebar logo icon visible', 'Shield emoji logo area present', async () => {
    const logo = await driver.findElement(By.css('.logo-area'));
    if (!await logo.isDisplayed()) throw new Error('Logo area not displayed');
  });

  await tc('Navigation', 'TC-014', 'Sidebar TRUTHGUARD logo text', '.logo-text contains TRUTHGUARD', async () => {
    const text = await driver.findElement(By.css('.logo-text')).getText();
    if (text !== 'TRUTHGUARD') throw new Error(`Got: "${text}"`);
  });

  await tc('Navigation', 'TC-015', 'Sidebar has 5 nav links', '.nav-links contains 5 a.nav-item elements', async () => {
    const items = await driver.findElements(By.css('.nav-links a.nav-item'));
    if (items.length !== 5) throw new Error(`Expected 5, got ${items.length}`);
  });

  await tc('Navigation', 'TC-016', 'Home nav link present', 'id=nav-home exists', async () => {
    await driver.findElement(By.id('nav-home'));
  });

  await tc('Navigation', 'TC-017', 'Verify nav link present', 'id=nav-verify exists', async () => {
    await driver.findElement(By.id('nav-verify'));
  });

  await tc('Navigation', 'TC-018', 'Trending nav link present', 'id=nav-trending exists', async () => {
    await driver.findElement(By.id('nav-trending'));
  });

  await tc('Navigation', 'TC-019', 'Dashboard nav link present', 'id=nav-dashboard exists', async () => {
    await driver.findElement(By.id('nav-dashboard'));
  });

  await tc('Navigation', 'TC-020', 'About nav link present', 'id=nav-about exists', async () => {
    await driver.findElement(By.id('nav-about'));
  });

  await tc('Navigation', 'TC-021', 'Home nav active on load', '#nav-home has active class initially', async () => {
    const cls = await driver.findElement(By.id('nav-home')).getAttribute('class');
    if (!cls.includes('active')) throw new Error(`nav-home not active: ${cls}`);
  });

  await tc('Navigation', 'TC-022', 'Click Verify nav → verify screen', 'Verify screen becomes active', async () => {
    await driver.findElement(By.id('nav-verify')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-verify')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Verify screen not active after nav click');
  });

  await tc('Navigation', 'TC-023', 'Click Trending nav → trending screen', 'Trending screen becomes active', async () => {
    await driver.findElement(By.id('nav-trending')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-trending')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Trending screen not active');
  });

  await tc('Navigation', 'TC-024', 'Click Dashboard nav → dashboard screen', 'Dashboard screen becomes active', async () => {
    await driver.findElement(By.id('nav-dashboard')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-dashboard')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Dashboard screen not active');
  });

  await tc('Navigation', 'TC-025', 'Click About nav → about screen', 'About screen becomes active', async () => {
    await driver.findElement(By.id('nav-about')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-about')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('About screen not active');
  });

  await tc('Navigation', 'TC-026', 'Click Home nav returns to home', 'Home screen becomes active again', async () => {
    await driver.findElement(By.id('nav-home')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-home')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Home screen not active after return');
  });

  await tc('Navigation', 'TC-027', 'Active nav class changes on click', 'nav-verify has active class after click', async () => {
    await driver.findElement(By.id('nav-verify')).click();
    await driver.sleep(300);
    const cls = await driver.findElement(By.id('nav-verify')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('nav-verify not active after click');
  });

  await tc('Navigation', 'TC-028', 'Previous nav loses active class', 'nav-home loses active after clicking verify', async () => {
    const cls = await driver.findElement(By.id('nav-home')).getAttribute('class');
    if (cls.includes('active')) throw new Error('nav-home still active after navigating away');
  });

  await tc('Navigation', 'TC-029', 'Only 1 screen active after nav', 'Exactly 1 .screen-section.active after click', async () => {
    await driver.findElement(By.id('nav-trending')).click();
    await driver.sleep(300);
    const actives = await driver.findElements(By.css('.screen-section.active'));
    if (actives.length !== 1) throw new Error(`${actives.length} screens active`);
  });

  await tc('Navigation', 'TC-030', 'Sidebar version label visible', '.version-label present in sidebar footer', async () => {
    const el = await driver.findElement(By.css('.sidebar-footer .version-label'));
    const t = await el.getText();
    if (!t.includes('Version')) throw new Error(`Got: "${t}"`);
  });

  // ── MODULE 3: HOME SCREEN (TC-031 – TC-050) ───────────────────────────────
  console.log('\n📋 MODULE 3: Home Screen');
  await goHome();

  await tc('Home', 'TC-031', 'Hero shield badge visible', '.shield-badge emoji element present', async () => {
    const el = await driver.findElement(By.css('.shield-badge'));
    if (!await el.isDisplayed()) throw new Error('Shield badge not visible');
  });

  await tc('Home', 'TC-032', 'Hero title "TRUTHGUARD" visible', 'h1.hero-title text is TRUTHGUARD', async () => {
    const t = await driver.findElement(By.css('h1.hero-title')).getText();
    if (t !== 'TRUTHGUARD') throw new Error(`Got: "${t}"`);
  });

  await tc('Home', 'TC-033', 'Hero subtitle visible', '.hero-subtitle contains AI Powered', async () => {
    const t = await driver.findElement(By.css('.hero-subtitle')).getText();
    if (!t.includes('AI Powered')) throw new Error(`Got: "${t}"`);
  });

  await tc('Home', 'TC-034', 'Quick Actions card visible', '.quick-actions-card.glass-card present', async () => {
    const el = await driver.findElement(By.css('.quick-actions-card'));
    if (!await el.isDisplayed()) throw new Error('Quick actions card not visible');
  });

  await tc('Home', 'TC-035', 'Quick Actions heading text', 'h3 inside quick-actions-card says "Quick Actions"', async () => {
    const t = await driver.findElement(By.css('.quick-actions-card h3')).getText();
    if (!t.includes('Quick Actions')) throw new Error(`Got: "${t}"`);
  });

  await tc('Home', 'TC-036', '"Verify News" quick button exists', '#btn-goto-verify present', async () => {
    await driver.findElement(By.id('btn-goto-verify'));
  });

  await tc('Home', 'TC-037', '"Trending News" quick button exists', '#btn-goto-trending present', async () => {
    await driver.findElement(By.id('btn-goto-trending'));
  });

  await tc('Home', 'TC-038', '"View Dashboard" quick button exists', '#btn-goto-dashboard present', async () => {
    await driver.findElement(By.id('btn-goto-dashboard'));
  });

  await tc('Home', 'TC-039', '"About Us" quick button exists', '#btn-goto-about present', async () => {
    await driver.findElement(By.id('btn-goto-about'));
  });

  await tc('Home', 'TC-040', 'Mini stats row visible', '.mini-stats-row present on home', async () => {
    const el = await driver.findElement(By.css('.mini-stats-row'));
    if (!await el.isDisplayed()) throw new Error('Mini stats row not displayed');
  });

  await tc('Home', 'TC-041', 'Home shows 2 mini stat cards', '.mini-stat-card count is 2', async () => {
    const cards = await driver.findElements(By.css('.mini-stat-card'));
    if (cards.length !== 2) throw new Error(`Got ${cards.length} mini stat cards`);
  });

  await tc('Home', 'TC-042', '"Verified Articles" stat label visible', 'stat-quick-verified element present', async () => {
    await driver.findElement(By.id('stat-quick-verified'));
  });

  await tc('Home', 'TC-043', 'Initial verified count is 25', '#stat-quick-verified text is "25"', async () => {
    const t = await driver.findElement(By.id('stat-quick-verified')).getText();
    if (t !== '25') throw new Error(`Got: "${t}"`);
  });

  await tc('Home', 'TC-044', '"System Accuracy" stat visible', '#stat-quick-accuracy element present', async () => {
    await driver.findElement(By.id('stat-quick-accuracy'));
  });

  await tc('Home', 'TC-045', 'Initial system accuracy is 92%', '#stat-quick-accuracy text is "92%"', async () => {
    const t = await driver.findElement(By.id('stat-quick-accuracy')).getText();
    if (t !== '92%') throw new Error(`Got: "${t}"`);
  });

  await tc('Home', 'TC-046', 'Quick btn "Verify News" navigates to verify', 'btn-goto-verify click activates verify screen', async () => {
    await driver.findElement(By.id('btn-goto-verify')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-verify')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Verify screen not active after quick btn click');
  });

  await goHome();
  await tc('Home', 'TC-047', 'Quick btn "Trending News" navigates', 'btn-goto-trending click activates trending screen', async () => {
    await driver.findElement(By.id('btn-goto-trending')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-trending')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Trending screen not active after quick btn click');
  });

  await goHome();
  await tc('Home', 'TC-048', 'Quick btn "View Dashboard" navigates', 'btn-goto-dashboard click activates dashboard', async () => {
    await driver.findElement(By.id('btn-goto-dashboard')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-dashboard')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('Dashboard screen not active after quick btn click');
  });

  await goHome();
  await tc('Home', 'TC-049', 'Quick btn "About Us" navigates', 'btn-goto-about click activates about screen', async () => {
    await driver.findElement(By.id('btn-goto-about')).click();
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('screen-about')).getAttribute('class');
    if (!cls.includes('active')) throw new Error('About screen not active after quick btn click');
  });

  await tc('Home', 'TC-050', 'Sidebar visible on all screens', 'sidebar visible on about screen', async () => {
    const sidebar = await driver.findElement(By.css('aside.sidebar'));
    if (!await sidebar.isDisplayed()) throw new Error('Sidebar hidden on about screen');
  });

  // ── MODULE 4: VERIFY NEWS SCREEN (TC-051 – TC-085) ───────────────────────
  console.log('\n📋 MODULE 4: Verify News Screen');
  await goHome();
  await navigateTo('verify');

  await tc('Verify', 'TC-051', 'Verify screen section exists', 'id=screen-verify in DOM', async () => {
    await driver.findElement(By.id('screen-verify'));
  });

  await tc('Verify', 'TC-052', '"Verify News" heading visible', 'h2.section-title contains Verify News', async () => {
    const t = await driver.findElement(By.css('#screen-verify h2.section-title')).getText();
    if (!t.includes('Verify')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-053', 'Verify screen description visible', '.section-desc text present', async () => {
    const t = await driver.findElement(By.css('#screen-verify .section-desc')).getText();
    if (!t || t.length < 10) throw new Error('Description too short or missing');
  });

  await tc('Verify', 'TC-054', 'Input card (glass card) visible', '.input-card.glass-card present', async () => {
    await driver.findElement(By.css('.input-card'));
  });

  await tc('Verify', 'TC-055', 'Textarea element exists', 'id=news-input textarea present', async () => {
    const el = await driver.findElement(By.id('news-input'));
    const tag = await el.getTagName();
    if (tag !== 'textarea') throw new Error(`Expected textarea, got ${tag}`);
  });

  await tc('Verify', 'TC-056', 'Textarea has placeholder text', 'placeholder attribute is set', async () => {
    const ph = await driver.findElement(By.id('news-input')).getAttribute('placeholder');
    if (!ph || ph.length < 5) throw new Error(`Placeholder missing or too short: "${ph}"`);
  });

  await tc('Verify', 'TC-057', '"Paste News Here" label exists', 'label for news-input present', async () => {
    const t = await driver.findElement(By.css('label[for="news-input"]')).getText();
    if (!t.includes('Paste')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-058', 'Analyze button exists', 'id=analyze-btn button present', async () => {
    await driver.findElement(By.id('analyze-btn'));
  });

  await tc('Verify', 'TC-059', 'Analyze button text is "Analyze"', 'button text matches', async () => {
    const t = await driver.findElement(By.id('analyze-btn')).getText();
    if (t !== 'Analyze') throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-060', 'Result card hidden initially', '#result-card has "hidden" class on load', async () => {
    const cls = await driver.findElement(By.id('result-card')).getAttribute('class');
    if (!cls.includes('hidden')) throw new Error(`result-card not hidden. Classes: ${cls}`);
  });

  await tc('Verify', 'TC-061', 'Empty submit triggers alert', 'alert shown when no text entered', async () => {
    const input = await driver.findElement(By.id('news-input'));
    await input.clear();
    await driver.findElement(By.id('analyze-btn')).click();
    await driver.sleep(300);
    try {
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      await alert.accept();
      if (!alertText) throw new Error('Alert text was empty');
    } catch (e) {
      if (e.name === 'NoAlertOpenError' || e.message.includes('no such alert')) {
        throw new Error('No alert appeared for empty submission');
      }
      throw e;
    }
  });

  // Fake keyword tests
  const fakeKeywords = ['fake', 'hoax', 'rumor', 'clickbait', 'shocking'];
  const tcIds = ['TC-062','TC-063','TC-064','TC-065','TC-066'];
  for (let i = 0; i < fakeKeywords.length; i++) {
    const kw = fakeKeywords[i];
    const id = tcIds[i];
    await tc('Verify', id, `Keyword "${kw}" triggers Fake result`, `Input containing "${kw}" → Likely Fake News`, async () => {
      await goHome();
      await analyzeNews(`This is a ${kw} news story about something`);
      const t = await driver.findElement(By.id('result-title')).getText();
      if (!t.includes('Likely Fake')) throw new Error(`Got: "${t}"`);
    });
  }

  await tc('Verify', 'TC-067', 'Fake result confidence is 88%', 'result-confidence contains 88%', async () => {
    await goHome();
    await analyzeNews('This story is total fake and misleading');
    const t = await driver.findElement(By.id('result-confidence')).getText();
    if (!t.includes('88%')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-068', 'Fake result recommendation exists', 'result-recommendation contains "trusted sources"', async () => {
    const t = await driver.findElement(By.id('result-recommendation')).getText();
    if (!t.toLowerCase().includes('trusted')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-069', 'Genuine news shows "Likely Genuine News"', 'neutral text → Likely Genuine News', async () => {
    await goHome();
    await analyzeNews('NASA scientists have launched a new satellite to monitor climate change worldwide.');
    const t = await driver.findElement(By.id('result-title')).getText();
    if (!t.includes('Likely Genuine')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-070', 'Genuine result confidence is 94%', 'result-confidence contains 94%', async () => {
    const t = await driver.findElement(By.id('result-confidence')).getText();
    if (!t.includes('94%')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-071', 'Genuine recommendation says "appears reliable"', 'recommendation text verified', async () => {
    const t = await driver.findElement(By.id('result-recommendation')).getText();
    if (!t.toLowerCase().includes('reliable')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-072', 'Result card visible after analysis', 'result-card loses hidden class', async () => {
    const cls = await driver.findElement(By.id('result-card')).getAttribute('class');
    if (cls.includes('hidden')) throw new Error('Result card still hidden after analysis');
  });

  await tc('Verify', 'TC-073', '"Analysis Result" heading in card', 'h3.result-header contains Analysis Result', async () => {
    const t = await driver.findElement(By.css('#result-card h3.result-header')).getText();
    if (!t.includes('Analysis Result')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-074', 'Result title element exists', 'id=result-title in DOM', async () => {
    await driver.findElement(By.id('result-title'));
  });

  await tc('Verify', 'TC-075', 'Result confidence element exists', 'id=result-confidence in DOM', async () => {
    await driver.findElement(By.id('result-confidence'));
  });

  await tc('Verify', 'TC-076', 'Result recommendation element exists', 'id=result-recommendation in DOM', async () => {
    await driver.findElement(By.id('result-recommendation'));
  });

  await tc('Verify', 'TC-077', 'Result card has divider element', 'hr.divider inside result-card', async () => {
    await driver.findElement(By.css('#result-card hr.divider'));
  });

  await tc('Verify', 'TC-078', 'UPPERCASE fake keyword detected', '"FAKE" (uppercase) triggers Likely Fake', async () => {
    await goHome();
    await analyzeNews('THIS IS TOTALLY FAKE AND MISLEADING');
    const t = await driver.findElement(By.id('result-title')).getText();
    if (!t.includes('Likely Fake')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-079', 'Mixed-case keyword detected', '"FaKe" triggers Likely Fake', async () => {
    await goHome();
    await analyzeNews('This news is FaKe and dangerous');
    const t = await driver.findElement(By.id('result-title')).getText();
    if (!t.includes('Likely Fake')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-080', 'Keyword at end of long text detected', 'Fake keyword at end still triggers', async () => {
    await goHome();
    await analyzeNews('A very long news article about many things happening in the world today and tomorrow and after that, but it is ultimately fake');
    const t = await driver.findElement(By.id('result-title')).getText();
    if (!t.includes('Likely Fake')) throw new Error(`Got: "${t}"`);
  });

  await tc('Verify', 'TC-081', 'Re-analyze with new text works', 'Second analysis clears and updates result', async () => {
    await goHome();
    await analyzeNews('Real scientific discovery announced by researchers');
    const t1 = await driver.findElement(By.id('result-title')).getText();
    await driver.findElement(By.id('news-input')).clear();
    await driver.findElement(By.id('news-input')).sendKeys('This is a shocking hoax story');
    await driver.findElement(By.id('analyze-btn')).click();
    await driver.sleep(500);
    const t2 = await driver.findElement(By.id('result-title')).getText();
    if (t1 === t2) throw new Error('Result did not change on second analysis');
  });

  await tc('Verify', 'TC-082', 'Fake stat increments in dashboard', 'After fake analysis, dashboard-fake count increases', async () => {
    await navigateTo('dashboard');
    await driver.sleep(300);
    const initial = parseInt(await driver.findElement(By.id('dashboard-fake')).getText());
    // Use navigateTo (not goHome) to avoid page reload which resets in-memory stats
    await navigateTo('verify');
    const input = await driver.findElement(By.id('news-input'));
    await input.clear();
    await input.sendKeys('More shocking rumors in today news story');
    await driver.findElement(By.id('analyze-btn')).click();
    await driver.sleep(500);
    await navigateTo('dashboard');
    await driver.sleep(300);
    const updated = parseInt(await driver.findElement(By.id('dashboard-fake')).getText());
    if (updated <= initial) throw new Error(`Fake count not incremented: ${initial} → ${updated}`);
  });

  await tc('Verify', 'TC-083', 'True stat increments in dashboard', 'After genuine analysis, dashboard-true count increases', async () => {
    await navigateTo('dashboard');
    await driver.sleep(300);
    const initial = parseInt(await driver.findElement(By.id('dashboard-true')).getText());
    // Use navigateTo (not goHome) to avoid page reload which resets in-memory stats
    await navigateTo('verify');
    const inp = await driver.findElement(By.id('news-input'));
    await inp.clear();
    await inp.sendKeys('Scientists confirm water found on Mars surface officially');
    await driver.findElement(By.id('analyze-btn')).click();
    await driver.sleep(500);
    await navigateTo('dashboard');
    await driver.sleep(300);
    const updated = parseInt(await driver.findElement(By.id('dashboard-true')).getText());
    if (updated <= initial) throw new Error(`True count not incremented: ${initial} → ${updated}`);
  });

  await tc('Verify', 'TC-084', 'Total verified increments in dashboard', 'dashboard-total increases after analysis', async () => {
    await navigateTo('dashboard');
    await driver.sleep(300);
    const initial = parseInt(await driver.findElement(By.id('dashboard-total')).getText());
    // Use navigateTo (not goHome) to avoid page reload which resets in-memory stats
    await navigateTo('verify');
    const input = await driver.findElement(By.id('news-input'));
    await input.clear();
    await input.sendKeys('Climate report shows record temperatures worldwide in 2026');
    await driver.findElement(By.id('analyze-btn')).click();
    await driver.sleep(500);
    await navigateTo('dashboard');
    await driver.sleep(300);
    const updated = parseInt(await driver.findElement(By.id('dashboard-total')).getText());
    if (updated <= initial) throw new Error(`Total not incremented: ${initial} → ${updated}`);
  });

  await tc('Verify', 'TC-085', 'Home mini-stats update after analysis', 'stat-quick-verified increases after analysis', async () => {
    await goHome();
    const initial = parseInt(await driver.findElement(By.id('stat-quick-verified')).getText());
    await analyzeNews('Scientific breakthrough in renewable energy technology');
    await navigateTo('home');
    await driver.sleep(300);
    const updated = parseInt(await driver.findElement(By.id('stat-quick-verified')).getText());
    if (updated <= initial) throw new Error(`Home stat not updated: ${initial} → ${updated}`);
  });

  // ── MODULE 5: TRENDING NEWS SCREEN (TC-086 – TC-100) ─────────────────────
  console.log('\n📋 MODULE 5: Trending News Screen');
  await goHome();
  await navigateTo('trending');

  await tc('Trending', 'TC-086', 'Trending screen section exists', 'id=screen-trending in DOM', async () => {
    await driver.findElement(By.id('screen-trending'));
  });

  await tc('Trending', 'TC-087', '"📰 Trending News" heading visible', 'h2.section-title contains Trending News', async () => {
    const t = await driver.findElement(By.css('#screen-trending h2.section-title')).getText();
    if (!t.includes('Trending')) throw new Error(`Got: "${t}"`);
  });

  await tc('Trending', 'TC-088', 'Trending description text present', '.section-desc text exists and has content', async () => {
    const t = await driver.findElement(By.css('#screen-trending .section-desc')).getText();
    if (!t || t.length < 5) throw new Error('Description missing');
  });

  await tc('Trending', 'TC-089', 'Trending list container exists', 'id=trending-list-container present', async () => {
    await driver.findElement(By.id('trending-list-container'));
  });

  await tc('Trending', 'TC-090', 'Exactly 5 news cards rendered', '.news-card count is 5', async () => {
    const cards = await driver.findElements(By.css('.news-card'));
    if (cards.length !== 5) throw new Error(`Expected 5 cards, got ${cards.length}`);
  });

  await tc('Trending', 'TC-091', 'News cards have glass-card class', 'All cards have glass-card styling', async () => {
    const cards = await driver.findElements(By.css('.news-card.glass-card'));
    if (cards.length !== 5) throw new Error(`Expected 5 glass cards, got ${cards.length}`);
  });

  await tc('Trending', 'TC-092', 'BBC news card present', 'Source text "BBC" visible in trending list', async () => {
    const sources = await driver.findElements(By.css('.news-source'));
    const texts = await Promise.all(sources.map(s => s.getText()));
    if (!texts.some(t => t.includes('BBC'))) throw new Error('BBC source not found');
  });

  await tc('Trending', 'TC-093', 'Reuters news card present', 'Source text "Reuters" visible', async () => {
    const sources = await driver.findElements(By.css('.news-source'));
    const texts = await Promise.all(sources.map(s => s.getText()));
    if (!texts.some(t => t.includes('Reuters'))) throw new Error('Reuters not found');
  });

  await tc('Trending', 'TC-094', 'NASA news card present', 'Source text "NASA" visible', async () => {
    const sources = await driver.findElements(By.css('.news-source'));
    const texts = await Promise.all(sources.map(s => s.getText()));
    if (!texts.some(t => t.includes('NASA'))) throw new Error('NASA not found');
  });

  await tc('Trending', 'TC-095', 'Bloomberg news card present', 'Source text "Bloomberg" visible', async () => {
    const sources = await driver.findElements(By.css('.news-source'));
    const texts = await Promise.all(sources.map(s => s.getText()));
    if (!texts.some(t => t.includes('Bloomberg'))) throw new Error('Bloomberg not found');
  });

  await tc('Trending', 'TC-096', 'UNESCO news card present', 'Source text "UNESCO" visible', async () => {
    const sources = await driver.findElements(By.css('.news-source'));
    const texts = await Promise.all(sources.map(s => s.getText()));
    if (!texts.some(t => t.includes('UNESCO'))) throw new Error('UNESCO not found');
  });

  await tc('Trending', 'TC-097', '1st card title correct', '"Scientists discover" in 1st card', async () => {
    const titles = await driver.findElements(By.css('.news-title'));
    const t = await titles[0].getText();
    if (!t.includes('Scientists discover')) throw new Error(`Got: "${t}"`);
  });

  await tc('Trending', 'TC-098', '2nd card title correct', '"AI transforming healthcare" in 2nd card', async () => {
    const titles = await driver.findElements(By.css('.news-title'));
    const t = await titles[1].getText();
    if (!t.includes('AI transforming')) throw new Error(`Got: "${t}"`);
  });

  await tc('Trending', 'TC-099', '3rd card title correct', '"Space mission" in 3rd card', async () => {
    const titles = await driver.findElements(By.css('.news-title'));
    const t = await titles[2].getText();
    if (!t.includes('Space mission')) throw new Error(`Got: "${t}"`);
  });

  await tc('Trending', 'TC-100', '4th card title correct', '"Global economy" in 4th card', async () => {
    const titles = await driver.findElements(By.css('.news-title'));
    const t = await titles[3].getText();
    if (!t.includes('Global economy')) throw new Error(`Got: "${t}"`);
  });

  // ── MODULE 6: DASHBOARD SCREEN (TC-101 – TC-115) ─────────────────────────
  console.log('\n📋 MODULE 6: Dashboard Screen');
  await goHome();
  await navigateTo('dashboard');

  await tc('Dashboard', 'TC-101', 'Dashboard screen section exists', 'id=screen-dashboard in DOM', async () => {
    await driver.findElement(By.id('screen-dashboard'));
  });

  await tc('Dashboard', 'TC-102', '"📊 Dashboard" heading visible', 'h2 contains Dashboard', async () => {
    const t = await driver.findElement(By.css('#screen-dashboard h2.section-title')).getText();
    if (!t.includes('Dashboard')) throw new Error(`Got: "${t}"`);
  });

  await tc('Dashboard', 'TC-103', 'Dashboard description visible', '.section-desc present with text', async () => {
    const t = await driver.findElement(By.css('#screen-dashboard .section-desc')).getText();
    if (!t || t.length < 5) throw new Error('Description missing');
  });

  await tc('Dashboard', 'TC-104', 'Stats grid has 4 cards', '.stats-grid contains 4 .stat-card elements', async () => {
    const cards = await driver.findElements(By.css('.stats-grid .stat-card'));
    if (cards.length !== 4) throw new Error(`Expected 4, got ${cards.length}`);
  });

  await tc('Dashboard', 'TC-105', '"Articles Verified" label visible', '.stat-label contains Articles Verified', async () => {
    const labels = await driver.findElements(By.css('.stat-label'));
    const texts = await Promise.all(labels.map(l => l.getText()));
    if (!texts.some(t => t.includes('Articles Verified'))) throw new Error('Label not found');
  });

  await tc('Dashboard', 'TC-106', '"True News" label visible', '.stat-label contains True News', async () => {
    const labels = await driver.findElements(By.css('.stat-label'));
    const texts = await Promise.all(labels.map(l => l.getText()));
    if (!texts.some(t => t.includes('True News'))) throw new Error('True News label not found');
  });

  await tc('Dashboard', 'TC-107', '"Fake News" label visible', '.stat-label contains Fake News', async () => {
    const labels = await driver.findElements(By.css('.stat-label'));
    const texts = await Promise.all(labels.map(l => l.getText()));
    if (!texts.some(t => t.includes('Fake News'))) throw new Error('Fake News label not found');
  });

  await tc('Dashboard', 'TC-108', 'Accuracy stat label visible', '.stat-label contains Accuracy', async () => {
    const labels = await driver.findElements(By.css('.stat-label'));
    const texts = await Promise.all(labels.map(l => l.getText()));
    if (!texts.some(t => t.toLowerCase().includes('accuracy'))) throw new Error('Accuracy label not found');
  });

  await tc('Dashboard', 'TC-109', '#dashboard-total element exists', 'id=dashboard-total present', async () => {
    await driver.findElement(By.id('dashboard-total'));
  });

  await tc('Dashboard', 'TC-110', '#dashboard-true element exists', 'id=dashboard-true present', async () => {
    await driver.findElement(By.id('dashboard-true'));
  });

  await tc('Dashboard', 'TC-111', '#dashboard-fake element exists', 'id=dashboard-fake present', async () => {
    await driver.findElement(By.id('dashboard-fake'));
  });

  await tc('Dashboard', 'TC-112', '#dashboard-accuracy element exists', 'id=dashboard-accuracy present', async () => {
    await driver.findElement(By.id('dashboard-accuracy'));
  });

  await tc('Dashboard', 'TC-113', 'Accuracy value ends in %', 'dashboard-accuracy text contains %', async () => {
    const t = await driver.findElement(By.id('dashboard-accuracy')).getText();
    if (!t.includes('%')) throw new Error(`Got: "${t}"`);
  });

  await tc('Dashboard', 'TC-114', 'Dashboard details card visible', '.dashboard-details.glass-card present', async () => {
    const el = await driver.findElement(By.css('.dashboard-details'));
    if (!await el.isDisplayed()) throw new Error('Dashboard details not visible');
  });

  await tc('Dashboard', 'TC-115', '"Cloud Firestore" text in details', 'Database source text verified', async () => {
    const t = await driver.findElement(By.css('.dashboard-details')).getText();
    if (!t.includes('Cloud Firestore')) throw new Error(`Got: "${t}"`);
  });

  // ── MODULE 7: ABOUT SCREEN (TC-116 – TC-130) ─────────────────────────────
  console.log('\n📋 MODULE 7: About Screen');
  await goHome();
  await navigateTo('about');

  await tc('About', 'TC-116', 'About screen section exists', 'id=screen-about in DOM', async () => {
    await driver.findElement(By.id('screen-about'));
  });

  await tc('About', 'TC-117', 'About icon visible', '.about-icon element present and displayed', async () => {
    const el = await driver.findElement(By.css('.about-icon'));
    if (!await el.isDisplayed()) throw new Error('About icon not displayed');
  });

  await tc('About', 'TC-118', '"TruthGuard" about title visible', 'h2.about-title text is TruthGuard', async () => {
    const t = await driver.findElement(By.css('h2.about-title')).getText();
    if (t !== 'TruthGuard') throw new Error(`Got: "${t}"`);
  });

  await tc('About', 'TC-119', 'System Information heading visible', '"System Information" h3 present', async () => {
    const t = await driver.findElement(By.css('.about-details h3')).getText();
    if (!t.includes('System Information')) throw new Error(`Got: "${t}"`);
  });

  await tc('About', 'TC-120', 'About info list has 4 items', 'ul.about-info-list has 4 li elements', async () => {
    const items = await driver.findElements(By.css('.about-info-list li'));
    if (items.length !== 4) throw new Error(`Expected 4 items, got ${items.length}`);
  });

  await tc('About', 'TC-121', '"AI Powered Fake News Detection App" text', 'Description list item text correct', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('AI Powered Fake News Detection App')) throw new Error(`Got: "${t}"`);
  });

  await tc('About', 'TC-122', 'Version "1.0" visible', 'About info shows Version : 1.0', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('1.0')) throw new Error(`Version not found in: "${t}"`);
  });

  await tc('About', 'TC-123', '"Educational Purpose" text visible', 'Purpose list item contains educational', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('Educational Purpose')) throw new Error(`Got: "${t}"`);
  });

  await tc('About', 'TC-124', '"Node.js" in technology stack', 'Tech stack item contains Node.js', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('Node.js')) throw new Error(`Node.js not in text: "${t}"`);
  });

  await tc('About', 'TC-125', '"Firebase" in technology stack', 'Tech stack item contains Firebase', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('Firebase')) throw new Error(`Firebase not in text`);
  });

  await tc('About', 'TC-126', 'Copyright text visible', '.about-copyright contains TruthGuard 2026', async () => {
    const t = await driver.findElement(By.css('.about-copyright')).getText();
    if (!t.includes('TruthGuard 2026')) throw new Error(`Got: "${t}"`);
  });

  await tc('About', 'TC-127', '"© " copyright symbol present', 'Copyright text has © symbol', async () => {
    const t = await driver.findElement(By.css('.about-copyright')).getText();
    if (!t.includes('©')) throw new Error(`Copyright symbol missing: "${t}"`);
  });

  await tc('About', 'TC-128', 'About details glass card present', '.about-details.glass-card exists', async () => {
    await driver.findElement(By.css('.about-details'));
  });

  await tc('About', 'TC-129', '"Description:" label in about list', 'First li has Description: label', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('Description:')) throw new Error(`Description label missing`);
  });

  await tc('About', 'TC-130', '"Version:" label in about list', 'Version label present in info list', async () => {
    const t = await driver.findElement(By.css('.about-details')).getText();
    if (!t.includes('Version:')) throw new Error(`Version label missing`);
  });

  // ── MODULE 8: END-TO-END FLOWS (TC-131 – TC-140) ─────────────────────────
  console.log('\n📋 MODULE 8: End-to-End User Flows');

  await tc('E2E Flow', 'TC-131', 'Full fake news flow: Home→Verify→Dashboard', 'Fake count in dashboard increments', async () => {
    await goHome();
    await navigateTo('dashboard');
    const fakeBefore = parseInt(await driver.findElement(By.id('dashboard-fake')).getText());
    await goHome();
    await analyzeNews('Shocking hoax exposed by media today');
    await navigateTo('dashboard');
    await driver.sleep(400);
    const fakeAfter = parseInt(await driver.findElement(By.id('dashboard-fake')).getText());
    if (fakeAfter <= fakeBefore) throw new Error(`Fake: ${fakeBefore} → ${fakeAfter}`);
  });

  await tc('E2E Flow', 'TC-132', 'Full genuine flow: Home→Verify→Dashboard', 'True count increments correctly', async () => {
    await goHome();
    await navigateTo('dashboard');
    const trueBefore = parseInt(await driver.findElement(By.id('dashboard-true')).getText());
    await goHome();
    await analyzeNews('Medical researchers confirm new treatment for rare disease');
    await navigateTo('dashboard');
    await driver.sleep(400);
    const trueAfter = parseInt(await driver.findElement(By.id('dashboard-true')).getText());
    if (trueAfter <= trueBefore) throw new Error(`True: ${trueBefore} → ${trueAfter}`);
  });

  await tc('E2E Flow', 'TC-133', 'Stats consistency: true+fake=total-25', 'Sum matches total minus initial 25', async () => {
    await goHome();
    await navigateTo('dashboard');
    const total = parseInt(await driver.findElement(By.id('dashboard-total')).getText());
    const trueN = parseInt(await driver.findElement(By.id('dashboard-true')).getText());
    const fakeN = parseInt(await driver.findElement(By.id('dashboard-fake')).getText());
    if ((trueN + fakeN) !== total) throw new Error(`${trueN} + ${fakeN} ≠ ${total}`);
  });

  await tc('E2E Flow', 'TC-134', 'Navigate all 5 screens sequentially', 'All screens activate without error', async () => {
    await goHome();
    const navOrder = ['home', 'verify', 'trending', 'dashboard', 'about'];
    const screenIds = ['screen-home', 'screen-verify', 'screen-trending', 'screen-dashboard', 'screen-about'];
    for (let i = 0; i < navOrder.length; i++) {
      await navigateTo(navOrder[i]);
      const cls = await driver.findElement(By.id(screenIds[i])).getAttribute('class');
      if (!cls.includes('active')) throw new Error(`${screenIds[i]} not active`);
    }
  });

  await tc('E2E Flow', 'TC-135', 'Home mini-stats and dashboard stats match', 'Both stat-quick-verified and dashboard-total are equal', async () => {
    await goHome();
    const homeStat = await driver.findElement(By.id('stat-quick-verified')).getText();
    await navigateTo('dashboard');
    const dashStat = await driver.findElement(By.id('dashboard-total')).getText();
    if (homeStat !== dashStat) throw new Error(`Home: ${homeStat}, Dashboard: ${dashStat}`);
  });

  console.log('\n✅ All tests completed.');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EXCEL REPORT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
async function generateReport() {
  console.log('\n📊 Generating Excel Report...');
  const wb = new ExcelJS.Workbook();
  wb.creator = 'TruthGuard Selenium Suite';
  wb.created = new Date();

  // ── Summary Sheet ──────────────────────────────────────────────────────────
  const summary = wb.addWorksheet('📋 Summary', { views: [{ showGridLines: false }] });

  const passed  = results.filter(r => r.status === 'PASSED').length;
  const failed  = results.filter(r => r.status === 'FAILED').length;
  const total   = results.length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const duration = ((Date.now() - suiteStart) / 1000).toFixed(1);

  // Title banner
  summary.mergeCells('A1:H1');
  const titleCell = summary.getCell('A1');
  titleCell.value = '🛡️  TRUTHGUARD WEB APPLICATION  —  SELENIUM E2E TEST REPORT';
  titleCell.font   = { name: 'Outfit', size: 18, bold: true, color: { argb: `FF${COLORS.headerText}` } };
  titleCell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.headerBg}` } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  summary.getRow(1).height = 52;

  // Subtitle bar
  summary.mergeCells('A2:H2');
  const subCell = summary.getCell('A2');
  subCell.value = `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}  |  Engine: Node.js + Selenium WebDriver 4.x  |  Browser: Google Chrome (Headless)`;
  subCell.font  = { name: 'Plus Jakarta Sans', size: 10, color: { argb: 'FFB0C4DE' } };
  subCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.subHeaderBg}` } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  summary.getRow(2).height = 26;

  summary.addRow([]);

  // KPI Stat boxes (row 4)
  const kpis = [
    { label: 'TOTAL TESTS', value: total,    fg: COLORS.statTotal, col: 'B' },
    { label: 'PASSED',      value: passed,   fg: COLORS.statPass,  col: 'D' },
    { label: 'FAILED',      value: failed,   fg: COLORS.statFail,  col: 'F' },
    { label: 'PASS RATE',   value: `${passRate}%`, fg: COLORS.accent, col: 'H' },
  ];
  for (const kpi of kpis) {
    summary.mergeCells(`${kpi.col}4:${kpi.col}5`);
    const c = summary.getCell(`${kpi.col}4`);
    c.value     = kpi.value;
    c.font      = { name: 'Outfit', size: 28, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${kpi.fg}` } };
    c.alignment = { vertical: 'middle', horizontal: 'center' };

    const lrow = parseInt(kpi.col.charCodeAt(0)) + 2; // unused: using next row approach
    summary.mergeCells(`${kpi.col}6:${kpi.col}6`);
    const labelCell = summary.getCell(`${kpi.col}6`);
    labelCell.value = kpi.label;
    labelCell.font  = { name: 'Plus Jakarta Sans', size: 9, bold: true, color: { argb: `FF${kpi.fg}` } };
    labelCell.alignment = { horizontal: 'center' };
  }
  summary.getRow(4).height = 44;
  summary.getRow(5).height = 44;
  summary.getRow(6).height = 18;

  summary.addRow([]);
  summary.addRow([]);

  // Execution details table
  const detailsHeaders = [
    ['Test Suite', 'TruthGuard Web Application E2E'],
    ['Target URL', `http://localhost:${PORT}`],
    ['Total Test Cases', total],
    ['Passed', passed],
    ['Failed', failed],
    ['Pass Rate', `${passRate}%`],
    ['Total Duration', `${duration}s`],
    ['Browser', 'Google Chrome (Headless)'],
    ['WebDriver', 'selenium-webdriver 4.x'],
    ['Test Framework', 'Node.js Custom Runner'],
    ['Report Generated', new Date().toLocaleString('en-IN')],
  ];

  summary.addRow(['', 'EXECUTION DETAILS', '', '', '', '', '', '']);
  const detTitleRow = summary.lastRow;
  detTitleRow.height = 26;
  summary.mergeCells(`B${detTitleRow.number}:H${detTitleRow.number}`);
  summary.getCell(`B${detTitleRow.number}`).font = { name: 'Plus Jakarta Sans', bold: true, size: 12, color: { argb: `FF${COLORS.accent}` } };
  summary.getCell(`B${detTitleRow.number}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EEF7' } };

  for (const [label, value] of detailsHeaders) {
    summary.addRow(['', label, '', value]);
    const r = summary.lastRow;
    r.height = 20;
    r.getCell(2).font = { name: 'Plus Jakarta Sans', bold: true, size: 10 };
    r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } };
    r.getCell(4).font = { name: 'Plus Jakarta Sans', size: 10 };
    summary.mergeCells(`D${r.number}:H${r.number}`);
  }

  // Module summary section
  summary.addRow([]);
  const moduleRow = summary.addRow(['', 'MODULE BREAKDOWN', '', '', '', '', '', '']);
  summary.mergeCells(`B${moduleRow.number}:H${moduleRow.number}`);
  summary.getCell(`B${moduleRow.number}`).font = { name: 'Plus Jakarta Sans', bold: true, size: 12, color: { argb: `FF${COLORS.accent}` } };
  summary.getCell(`B${moduleRow.number}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EEF7' } };
  moduleRow.height = 26;

  const modules = [...new Set(results.map(r => r.module))];
  const modHeaderRow = summary.addRow(['', 'Module', '', 'Total', 'Passed', 'Failed', 'Pass Rate', '']);
  modHeaderRow.height = 22;
  ['B','D','E','F','G'].forEach(col => {
    const c = summary.getCell(`${col}${modHeaderRow.number}`);
    c.font = { name: 'Plus Jakarta Sans', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.accent}` } };
    c.alignment = { horizontal: 'center' };
  });

  for (const mod of modules) {
    const modResults = results.filter(r => r.module === mod);
    const mPass = modResults.filter(r => r.status === 'PASSED').length;
    const mFail = modResults.filter(r => r.status === 'FAILED').length;
    const mRate = Math.round((mPass / modResults.length) * 100);
    const mRow = summary.addRow(['', mod, '', modResults.length, mPass, mFail, `${mRate}%`, '']);
    mRow.height = 20;
    mRow.getCell(2).font = { name: 'Plus Jakarta Sans', size: 10, bold: true };
    mRow.getCell(4).alignment = mRow.getCell(5).alignment = mRow.getCell(6).alignment = mRow.getCell(7).alignment = { horizontal: 'center' };
    mRow.getCell(5).font = { name: 'Plus Jakarta Sans', size: 10, color: { argb: `FF${COLORS.statPass}` } };
    mRow.getCell(6).font = { name: 'Plus Jakarta Sans', size: 10, color: { argb: `FF${COLORS.statFail}` } };
    mRow.getCell(7).font = { name: 'Plus Jakarta Sans', size: 10, bold: true };
  }

  summary.columns = [
    { width: 2 }, { width: 30 }, { width: 4 }, { width: 18 },
    { width: 14 }, { width: 14 }, { width: 14 }, { width: 2 }
  ];

  // ── Test Cases Sheet ────────────────────────────────────────────────────────
  const tcSheet = wb.addWorksheet('🧪 Test Cases', { views: [{ showGridLines: true, state: 'frozen', ySplit: 3 }] });

  // Title banner
  tcSheet.mergeCells('A1:G1');
  const tcTitle = tcSheet.getCell('A1');
  tcTitle.value = '🛡️  TRUTHGUARD — ALL TEST CASES DETAIL';
  tcTitle.font  = { name: 'Outfit', size: 15, bold: true, color: { argb: `FF${COLORS.headerText}` } };
  tcTitle.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.headerBg}` } };
  tcTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  tcSheet.getRow(1).height = 44;

  // Info bar
  tcSheet.mergeCells('A2:G2');
  const tcInfo = tcSheet.getCell('A2');
  tcInfo.value = `Total: ${total} | Passed: ${passed} | Failed: ${failed} | Pass Rate: ${passRate}% | Duration: ${duration}s`;
  tcInfo.font  = { name: 'Plus Jakarta Sans', size: 10, color: { argb: 'FFFFFFFF' } };
  tcInfo.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.subHeaderBg}` } };
  tcInfo.alignment = { vertical: 'middle', horizontal: 'center' };
  tcSheet.getRow(2).height = 22;

  // Column headers
  const headers = ['#', 'Test ID', 'Module', 'Test Case Name', 'Description', 'Status', 'Duration (ms)', 'Error / Notes'];
  tcSheet.addRow(headers);
  const hRow = tcSheet.lastRow;
  hRow.height = 30;
  hRow.eachCell((cell, col) => {
    cell.font      = { name: 'Plus Jakarta Sans', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.accent}` } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    cell.border    = { bottom: { style: 'medium', color: { argb: `FF${COLORS.moduleText}` } } };
  });

  // Data rows, grouped by module
  let rowIndex = 0;
  let currentModule = null;
  for (const r of results) {
    rowIndex++;

    // Module header separator
    if (r.module !== currentModule) {
      currentModule = r.module;
      const sepRow = tcSheet.addRow(['', '', r.module.toUpperCase(), '', '', '', '', '']);
      sepRow.height = 24;
      tcSheet.mergeCells(`C${sepRow.number}:H${sepRow.number}`);
      sepRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.moduleBg}` } };
        cell.font = { name: 'Plus Jakarta Sans', bold: true, size: 10, color: { argb: `FF${COLORS.moduleText}` } };
      });
    }

    const isPass  = r.status === 'PASSED';
    const fillCol = isPass ? COLORS.passedBg : COLORS.failedBg;
    const statFg  = isPass ? COLORS.passedText : COLORS.failedText;
    const rowBg   = rowIndex % 2 === 0 ? COLORS.rowAlt : COLORS.rowNorm;

    const dataRow = tcSheet.addRow([rowIndex, r.id, r.module, r.name, r.desc, r.status, r.duration, r.error || '']);
    dataRow.height = 22;

    dataRow.eachCell((cell, colNum) => {
      cell.font   = { name: 'Plus Jakarta Sans', size: 10 };
      cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${rowBg}` } };
      cell.border = {
        top:    { style: 'thin', color: { argb: `FF${COLORS.border}` } },
        bottom: { style: 'thin', color: { argb: `FF${COLORS.border}` } },
        left:   { style: 'thin', color: { argb: `FF${COLORS.border}` } },
        right:  { style: 'thin', color: { argb: `FF${COLORS.border}` } },
      };
      if (colNum === 1 || colNum === 2) cell.alignment = { horizontal: 'center' };
      if (colNum === 7) cell.alignment = { horizontal: 'right' };
      if (colNum === 6) {
        cell.font = { name: 'Plus Jakarta Sans', bold: true, size: 10, color: { argb: `FF${statFg}` } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${fillCol}` } };
        cell.alignment = { horizontal: 'center' };
      }
      if (colNum === 8 && r.error) {
        cell.font = { name: 'Plus Jakarta Sans', size: 9, color: { argb: `FF${COLORS.failedText}` } };
        cell.alignment = { wrapText: true };
      }
    });
  }

  tcSheet.columns = [
    { width: 5  },  // #
    { width: 10 },  // ID
    { width: 16 },  // Module
    { width: 40 },  // Name
    { width: 50 },  // Description
    { width: 14 },  // Status
    { width: 14 },  // Duration
    { width: 55 },  // Error
  ];

  // ── Failed Tests Sheet ──────────────────────────────────────────────────────
  const failedResults = results.filter(r => r.status === 'FAILED');
  if (failedResults.length > 0) {
    const failSheet = wb.addWorksheet('❌ Failed Tests', { views: [{ showGridLines: true }] });

    failSheet.mergeCells('A1:G1');
    const fTitle = failSheet.getCell('A1');
    fTitle.value = `❌  FAILED TEST CASES — ${failedResults.length} Failures`;
    fTitle.font  = { name: 'Outfit', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    fTitle.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.statFail}` } };
    fTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    failSheet.getRow(1).height = 40;

    failSheet.addRow(['#', 'Test ID', 'Module', 'Test Case Name', 'Status', 'Duration (ms)', 'Error Message']);
    const fHeader = failSheet.lastRow;
    fHeader.height = 26;
    fHeader.eachCell(cell => {
      cell.font  = { name: 'Plus Jakarta Sans', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.accent}` } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    failedResults.forEach((r, i) => {
      const row = failSheet.addRow([i + 1, r.id, r.module, r.name, r.status, r.duration, r.error]);
      row.height = 30;
      row.eachCell((cell, col) => {
        cell.font   = { name: 'Plus Jakarta Sans', size: 10 };
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLORS.failedBg}` } };
        if (col === 5) { cell.font = { name: 'Plus Jakarta Sans', bold: true, size: 10, color: { argb: `FF${COLORS.failedText}` } }; cell.alignment = { horizontal: 'center' }; }
        if (col === 7) { cell.alignment = { wrapText: true }; cell.font = { name: 'Plus Jakarta Sans', size: 9, color: { argb: `FF${COLORS.failedText}` } }; }
      });
    });

    failSheet.columns = [
      { width: 5 }, { width: 10 }, { width: 16 }, { width: 42 },
      { width: 12 }, { width: 14 }, { width: 60 }
    ];
  }

  await wb.xlsx.writeFile(REPORT_FILE);
  console.log(`\n📄 Excel report saved → ${REPORT_FILE}`);
  return REPORT_FILE;
}

// ─── MARKDOWN SUMMARY (for GitHub Actions Step Summary) ──────────────────────
function generateMarkdownSummary() {
  const passed   = results.filter(r => r.status === 'PASSED').length;
  const failed   = results.filter(r => r.status === 'FAILED').length;
  const total    = results.length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const duration = ((Date.now() - suiteStart) / 1000).toFixed(1);
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const passBadge = passRate === 100 ? '🟢' : passRate >= 80 ? '🟡' : '🔴';

  let md = `# 🛡️ TruthGuard Web — Selenium E2E Test Report\n\n`;
  md += `> **Generated:** ${timestamp} &nbsp;|&nbsp; **Browser:** Google Chrome (Headless) &nbsp;|&nbsp; **Engine:** Node.js + Selenium WebDriver 4.x\n\n`;
  md += `---\n\n`;

  // KPI summary table
  md += `## 📊 Results Summary\n\n`;
  md += `| ${passBadge} Pass Rate | 📋 Total Tests | ✅ Passed | ❌ Failed | ⏱️ Duration |\n`;
  md += `|:-----------:|:--------------:|:---------:|:---------:|:----------:|\n`;
  md += `| **${passRate}%** | **${total}** | **${passed}** | **${failed}** | **${duration}s** |\n\n`;

  // Module breakdown table
  const modules = [...new Set(results.map(r => r.module))];
  md += `## 📋 Module Breakdown\n\n`;
  md += `| Module | Tests | ✅ Passed | ❌ Failed | Pass Rate |\n`;
  md += `|--------|:-----:|:---------:|:---------:|:---------:|\n`;
  for (const mod of modules) {
    const modRes   = results.filter(r => r.module === mod);
    const mPass    = modRes.filter(r => r.status === 'PASSED').length;
    const mFail    = modRes.filter(r => r.status === 'FAILED').length;
    const mRate    = Math.round((mPass / modRes.length) * 100);
    const mIcon    = mFail === 0 ? '✅' : '❌';
    md += `| ${mIcon} ${mod} | ${modRes.length} | ${mPass} | ${mFail} | ${mRate}% |\n`;
  }
  md += `\n`;

  // Failed tests (if any)
  const failedList = results.filter(r => r.status === 'FAILED');
  if (failedList.length > 0) {
    md += `## ❌ Failed Test Cases\n\n`;
    md += `| Test ID | Module | Test Name | Error |\n`;
    md += `|---------|--------|-----------|-------|\n`;
    for (const r of failedList) {
      const errSnippet = (r.error || '').replace(/\|/g, '\\|').substring(0, 120);
      md += `| \`${r.id}\` | ${r.module} | ${r.name} | \`${errSnippet}\` |\n`;
    }
    md += `\n`;
  } else {
    md += `## 🎉 All Tests Passed!\n\n`;
    md += `> All **${total}** test cases passed successfully with a **${passRate}%** pass rate.\n\n`;
  }

  md += `---\n`;
  md += `*Report also available as a downloadable Excel artifact — see the **Artifacts** section below this run.*\n`;

  const summaryFile = path.join(__dirname, 'test-summary.md');
  fs.writeFileSync(summaryFile, md, 'utf8');
  console.log(`\n📝 Markdown summary saved → ${summaryFile}`);
  return summaryFile;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   🛡️  TRUTHGUARD WEB — SELENIUM E2E TEST RUNNER');
  console.log('═══════════════════════════════════════════════════════════');

  await startServer();

  try {
    await runTests();
  } catch (err) {
    console.error('\n🔴 Critical runner error:', err.message);
  } finally {
    if (driver) {
      console.log('\n🧹 Closing Chrome WebDriver...');
      await driver.quit();
    }
    if (serverProcess) {
      console.log('🧹 Stopping web server...');
      serverProcess.kill();
    }

    const passed  = results.filter(r => r.status === 'PASSED').length;
    const failed  = results.filter(r => r.status === 'FAILED').length;
    const total   = results.length;
    const duration = ((Date.now() - suiteStart) / 1000).toFixed(1);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`  📊 RESULTS  |  Total: ${total}  ✅ Passed: ${passed}  ❌ Failed: ${failed}`);
    console.log(`  ⏱️  Duration: ${duration}s  |  Pass Rate: ${Math.round((passed/total)*100)}%`);
    console.log('═══════════════════════════════════════════════════════════');

    await generateReport();
    generateMarkdownSummary();

    console.log('\n✨ Testing complete! Open the .xlsx report or check the GitHub Actions Summary for full details.\n');
  }
}

main();
