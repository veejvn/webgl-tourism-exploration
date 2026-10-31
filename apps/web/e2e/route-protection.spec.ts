import { test, expect } from '@playwright/test';

test.describe('Route Protection and Auth Hydration', () => {
  test('should let unauthenticated users open /explore with a destination id', async ({ page }) => {
    // Go to home page to clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/explore?id=hue');

    await expect(page).toHaveURL(/\/explore\?id=hue$/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Cảnh 3D minh họa: Huế' })).toBeVisible();
  });

  test('should redirect authenticated users away from /login and /register to /map', async ({ page, context }) => {
    test.setTimeout(120000);
    // Pre-seed authenticated state in localStorage before loading the page
    const authState = {
      state: {
        token: 'mock-jwt-token-for-testing',
        user: {
          id: 'mock-id',
          email: 'mock@example.com',
          name: 'Mock User',
          role: 'USER'
        },
        isAuthenticated: true
      },
      version: 0
    };

    await context.addInitScript((state) => {
      localStorage.setItem('auth-storage', JSON.stringify(state));
      localStorage.setItem('token', state.state.token);
      localStorage.setItem('user', JSON.stringify(state.state.user));
    }, authState);

    // Try accessing /login while authenticated
    await page.goto('/login', { waitUntil: 'commit' });
    // Should auto-redirect to /map
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });

    // Try accessing /register while authenticated
    await page.goto('/register', { waitUntil: 'commit' });
    // Should auto-redirect to /map
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });
  });

  test('should hydrate auth state correctly on reload on /map without redirecting to login', async ({ page }) => {
    test.setTimeout(180000);
    // 1. Go to register to create a fresh user first
    const uniqueEmail = `reload.user.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.fill('input[id="name"]', 'Reload User');
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', 'password123');
    const registrationResponse = page.waitForResponse(
      (response) => response.url().endsWith('/auth/register') && response.request().method() === 'POST',
    );
    await page.click('button[type="submit"]');
    expect((await registrationResponse).status()).toBe(201);

    // 2. Wait for successful redirect to /map
    await expect(page).toHaveURL(/\/map/, { timeout: 60000 });

    // 3. Verify greeting is visible
    await expect(page.locator('text=Xin chào,')).toContainText('Reload User');

    // 4. Reload the page
    await page.evaluate(() => window.location.reload());

    // 5. We should still be on /map and the greeting should still be visible (auth state hydrated!)
    await expect.poll(() => page.url(), { timeout: 60000 }).toMatch(/\/map/);
    await expect(page.locator('text=Xin chào,')).toContainText('Reload User', { timeout: 60000 });
  });
});
