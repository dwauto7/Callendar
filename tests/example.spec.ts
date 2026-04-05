import { test, expect } from '@playwright/test';

const BASE_URL = 'https://app.beaconhorizons.io';

test.describe('Callendar Smoke Tests', () => {

  test('login page loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('dashboard loads after login', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard/**`);
    await expect(page.locator('text=Operations')).toBeVisible();
  });

  test('operations page loads with calendar', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/operations`);
    await expect(page.locator('text=Operations')).toBeVisible();
  });

  test('credits display is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Credits')).toBeVisible();
  });

});