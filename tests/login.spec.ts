import { expect } from '@playwright/test';
import { test } from '../fixtures/test-listener';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Verify valid credentials allow user to login successfully', async ({ page, loginPage, homePage }) => {
    await loginPage.login('Admin', 'admin123');
    await expect(homePage.homePageUserName).toBeVisible();
  });
});
