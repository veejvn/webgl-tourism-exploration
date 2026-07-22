import { test, expect } from '@playwright/test';

test.describe('Map and Destinations Features', () => {
  test.beforeEach(async ({ page }) => {
    // Start waiting for the API response BEFORE triggering the navigation to prevent race conditions
    const responsePromise = page.waitForResponse(/\/destinations/);
    await page.goto('/map');
    await responsePromise;
  });

  test('should load map container and show header title', async ({ page }) => {
    // Verify map page title and header are displayed
    await expect(page.locator('h1')).toContainText('Bản đồ Di sản Du lịch 3D');
    
    // Map container should be present and visible
    const mapContainer = page.locator('.mapboxgl-map');
    await expect(mapContainer).toBeVisible();
  });

  test('should load destination markers from API and plot on map', async ({ page }) => {
    // The seed data has 8 destinations (An Giang destinations)
    // Mapbox markers are standard DOM nodes created dynamically with emoji "📍"
    const markers = page.locator('text=📍');
    await expect(markers).toHaveCount(8);
  });

  test('should display detailed card when a destination marker is clicked', async ({ page }) => {
    const markers = page.locator('text=📍');
    
    // Dispatch the click event directly on the DOM element to bypass viewport/WebGL limitations
    await markers.first().dispatchEvent('click');

    // Verify detail card appears (Zustand sets selectedDest)
    const detailCard = page.locator('button:has-text("✕")').locator('..'); // locate by looking for close button parent
    await expect(detailCard).toBeVisible();

    // Verify detail elements (title, image, buttons)
    await expect(detailCard.locator('h2')).toBeVisible();
    await expect(detailCard.locator('img')).toBeVisible();
    
    const exploreBtn = detailCard.locator('button:has-text("Khám phá 3D")');
    const zoomBtn = detailCard.locator('button:has-text("Phóng to")');
    
    await expect(exploreBtn).toBeVisible();
    await expect(zoomBtn).toBeVisible();
  });

  test('should close detailed card when close button is clicked', async ({ page }) => {
    const markers = page.locator('text=📍');
    await markers.first().dispatchEvent('click');

    // Detail card is visible
    const detailCard = page.locator('button:has-text("✕")').locator('..');
    await expect(detailCard).toBeVisible();

    // Click the close '✕' button
    await page.click('button:has-text("✕")');

    // Detail card should be gone or hidden
    await expect(detailCard).not.toBeVisible();
  });

  test.skip('should redirect to 3D scene when clicking Khám phá 3D button', async ({ page }) => {
    // Register a real user first to get a valid token and session
    const uniqueEmail = `map.explore.user.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.fill('input[id="name"]', 'Map Explore User');
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for successful redirect to /map
    await page.waitForURL(/\/map/, { timeout: 10000 });

    // Verify greeting is visible
    await expect(page.locator('text=Xin chào,')).toContainText('Map Explore User');

    // Click the first marker
    const markers = page.locator('text=📍');
    await markers.first().dispatchEvent('click');

    // Click the explore button
    const detailCard = page.locator('button:has-text("✕")').locator('..');
    const exploreBtn = detailCard.locator('button:has-text("Khám phá 3D")');
    await exploreBtn.click();

    // Verify successful redirect to the 3D scene /explore?id=...
    await expect(page).toHaveURL(/\/explore\?id=.+/, { timeout: 10000 });
  });
});
