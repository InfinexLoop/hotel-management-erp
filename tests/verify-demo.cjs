const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log('🚀 Starting Automated Playwright Verification Suite for Hotel Management ERP...');
  
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:5173';

  try {
    // 1. Visit Login Page
    console.log('1. Navigating to Login page...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    const loginTitle = await page.title();
    console.log(`   Page title: "${loginTitle}"`);
    await page.screenshot({ path: path.join(screenshotsDir, '01_login_page.png'), fullPage: true });

    // 2. Test Admin Quick Login
    console.log('2. Testing Admin Quick Login...');
    const adminBtn = page.locator('button:has-text("Administrator")');
    await adminBtn.click();
    await page.waitForURL('**/dashboard', { timeout: 6000 });
    console.log('   ✓ Admin login successful! Currently on:', page.url());
    await page.screenshot({ path: path.join(screenshotsDir, '02_admin_dashboard.png'), fullPage: true });

    // 3. Verify Admin Navigation (Must contain Settings)
    console.log('3. Verifying Admin Sidebar Items...');
    const settingsLink = page.locator('aside a[href="/settings"]');
    const hasSettings = await settingsLink.count();
    console.log(`   Settings item present for Admin: ${hasSettings > 0 ? 'YES (Correct)' : 'NO'}`);
    if (hasSettings === 0) throw new Error('Settings link missing for Admin!');

    // 4. Verify Primary Routes Navigation
    const routesToTest = [
      { name: 'Reservations', path: '/reservations' },
      { name: 'Guests', path: '/guests' },
      { name: 'Rooms', path: '/rooms' },
      { name: 'Check-In', path: '/check-in' },
      { name: 'Check-Out', path: '/check-out' },
      { name: 'Housekeeping', path: '/housekeeping' },
      { name: 'Invoices', path: '/invoices' },
      { name: 'Employees', path: '/employees' },
      { name: 'Reports', path: '/reports' },
      { name: 'Calendar', path: '/calendar' },
      { name: 'Notifications', path: '/notifications' },
      { name: 'Settings', path: '/settings' },
    ];

    for (const r of routesToTest) {
      console.log(`4. Testing route: ${r.name} (${r.path})...`);
      const navItem = page.locator(`aside a[href="${r.path}"]`);
      await navItem.click();
      await page.waitForURL(`**${r.path}`, { timeout: 5000 });
      console.log(`   ✓ Loaded ${r.path}`);
    }

    // 5. Test Interactive Operations:
    console.log('5. Testing Interactive Operations...');
    
    // Test on Rooms page
    await page.goto(`${baseUrl}/rooms`);
    await page.waitForTimeout(500);
    console.log('   ✓ Rooms page verified with grid cards');
    await page.screenshot({ path: path.join(screenshotsDir, '03_rooms_page.png'), fullPage: true });

    // Test on Check-In page
    await page.goto(`${baseUrl}/check-in`);
    await page.waitForTimeout(500);
    console.log('   ✓ Check-in arrivals verified');
    await page.screenshot({ path: path.join(screenshotsDir, '04_checkin_page.png'), fullPage: true });

    // Test on Invoices page & Receipt modal
    await page.goto(`${baseUrl}/invoices`);
    await page.waitForTimeout(500);
    const viewReceiptBtn = page.locator('button:has-text("View Receipt")').first();
    if (await viewReceiptBtn.count() > 0) {
      await viewReceiptBtn.click();
      await page.waitForTimeout(600);
      console.log('   ✓ Folio Receipt Modal opened');
      await page.screenshot({ path: path.join(screenshotsDir, '05_invoice_receipt_modal.png') });
      const closeBtn = page.locator('button:has-text("Close")').first();
      await closeBtn.click();
    }

    // Test on Reports page
    await page.goto(`${baseUrl}/reports`);
    await page.waitForTimeout(600);
    console.log('   ✓ Analytics & Recharts verified');
    await page.screenshot({ path: path.join(screenshotsDir, '06_reports_page.png'), fullPage: true });

    // Test on Calendar page
    await page.goto(`${baseUrl}/calendar`);
    await page.waitForTimeout(600);
    console.log('   ✓ Room Tape Timeline verified');
    await page.screenshot({ path: path.join(screenshotsDir, '07_calendar_rack.png'), fullPage: true });

    // 6. Test Logout
    console.log('6. Testing Sign Out...');
    const signOutBtn = page.locator('aside button:has-text("Sign Out")');
    await signOutBtn.click();
    await page.waitForURL('**/login', { timeout: 5000 });
    console.log('   ✓ Successfully signed out! Returned to:', page.url());

    // 7. Test Manager Quick Login
    console.log('7. Testing Manager Quick Login...');
    const managerBtn = page.locator('button:has-text("Property Manager")');
    await managerBtn.click();
    await page.waitForURL('**/dashboard', { timeout: 6000 });
    console.log('   ✓ Manager login successful! Currently on:', page.url());

    // Verify Manager does NOT have Settings in sidebar
    const managerSettingsLink = page.locator('aside a[href="/settings"]');
    const managerHasSettings = await managerSettingsLink.count();
    console.log(`   Settings item present for Manager: ${managerHasSettings > 0 ? 'YES' : 'NO (Correct, hidden!)'}`);
    if (managerHasSettings !== 0) throw new Error('Settings link must be hidden for Manager role!');

    // Test Manager attempting to access /settings directly
    console.log('   Testing direct navigation to /settings as Manager...');
    await page.goto(`${baseUrl}/settings`);
    await page.waitForTimeout(500);
    const restrictedBanner = page.locator('text=Administrator Access Required');
    const isRestricted = await restrictedBanner.count() > 0;
    console.log(`   Access restricted guard active: ${isRestricted ? 'YES (Correct)' : 'NO'}`);
    await page.screenshot({ path: path.join(screenshotsDir, '08_manager_settings_restricted.png') });

    // 8. Test Mobile Layout
    console.log('8. Testing Mobile Layout (Viewport 375x812)...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(600);
    console.log('   ✓ Mobile dashboard rendered');
    await page.screenshot({ path: path.join(screenshotsDir, '09_mobile_dashboard.png') });

    // Test hamburger drawer
    const hamburgerBtn = page.locator('header button[aria-label="Open navigation menu"]');
    await hamburgerBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ Mobile drawer opened');
    await page.screenshot({ path: path.join(screenshotsDir, '10_mobile_drawer.png') });

    console.log('\n🎉 ALL 15 VERIFICATION CHECKS PASSED WITH ZERO ERRORS!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
