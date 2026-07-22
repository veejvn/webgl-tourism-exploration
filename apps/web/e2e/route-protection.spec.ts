import { test, expect } from '@playwright/test';

test.describe('Route Protection and Auth Hydration', () => {
  test('should redirect unauthenticated users from /explore to /login', async ({ page }) => {
    // Go to home page to clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Try accessing a protected route: /explore
    await page.goto('/explore');

    // Should be intercepted by client hydration and redirected to login page with correct redirect param
    await expect(page).toHaveURL(/\/login\?redirect=(%2F|\/)explore/, { timeout: 10000 });
  });

  test('should redirect authenticated users away from /login and /register to /map', async ({ page, context }) => {
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
    await page.goto('/login');
    // Should auto-redirect to /map
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });

    // Try accessing /register while authenticated
    await page.goto('/register');
    // Should auto-redirect to /map
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });
  });

  test('should hydrate auth state correctly on reload on /map without redirecting to login', async ({ page }) => {
    // 1. Go to register to create a fresh user first
    const uniqueEmail = `reload.user.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.fill('input[id="name"]', 'Reload User');
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Wait for successful redirect to /map
    await page.waitForURL(/\/map/, { timeout: 10000 });

    // 3. Verify greeting is visible
    await expect(page.locator('text=Xin chào,')).toContainText('Reload User');

    // 4. Reload the page
    await page.reload();

    // 5. We should still be on /map and the greeting should still be visible (auth state hydrated!)
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });
    await expect(page.locator('text=Xin chào,')).toContainText('Reload User', { timeout: 10000 });
  });
});
