import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  // Run tests in serial mode sequentially on a single worker
  test.describe.configure({ mode: 'serial' });

  const uniqueEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'Test User';

  test('should validate registration form fields', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check for inline validation errors
    await expect(page.locator('text=Email là bắt buộc')).toBeVisible();
    await expect(page.locator('text=Mật khẩu là bắt buộc')).toBeVisible();
    await expect(page.locator('text=Họ tên là bắt buộc')).toBeVisible();

    // Check invalid email format
    await page.fill('input[id="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email không hợp lệ')).toBeVisible();

    // Check password too short
    await page.fill('input[id="password"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Mật khẩu phải có ít nhất 6 ký tự')).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form with valid unique details
    await page.fill('input[id="name"]', testName);
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', testPassword);

    // Submit and wait for redirect to /map
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });

    // Verify localStorage auth items are set
    const userJson = await page.evaluate(() => localStorage.getItem('user'));
    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(token).toBeTruthy();
    expect(userJson).toBeTruthy();
    
    const user = JSON.parse(userJson || '{}');
    expect(user.email).toBe(uniqueEmail);
    expect(user.name).toBe(testName);
  });

  test('should validate login form fields', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check inline validation errors
    await expect(page.locator('text=Email là bắt buộc')).toBeVisible();
    await expect(page.locator('text=Mật khẩu là bắt buộc')).toBeVisible();

    // Check invalid email format
    await page.fill('input[id="email"]', 'notanemail');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email không hợp lệ')).toBeVisible();
  });

  test('should successfully login with registered user and logout', async ({ page }) => {
    await page.goto('/login');

    // Fill credentials using the user registered in the previous test
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', testPassword);

    // Submit and wait for redirect
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });

    // Verify welcome message and user state in localStorage
    await expect(page.locator('text=Xin chào,')).toContainText(testName);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Click logout
    await page.click('button:has-text("Đăng xuất")');

    // Verify redirect back to login and cleared storage
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    const clearedToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(clearedToken).toBeNull();
  });
});
