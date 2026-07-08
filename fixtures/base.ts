import { test as base, expect } from '@playwright/test';
import type { Page, BrowserContext, Browser } from '@playwright/test';

/**
 * Base fixture for all tests - replaces BaseTests.java
 * Provides page, context, browser fixtures with common setup/teardown
 */
export const test = base.extend<{
  page: Page;
  context: BrowserContext;
  browser: Browser;
}>({
  // Override page fixture to include base URL navigation and timeout config
  page: async ({ page }, use) => {
    // Navigate to base URL (replaces driver.get())
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    
    // Maximize window (replaces driver.manage().window().maximize())
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // TODO: migrate - Original code used implicit wait of 10 seconds
    // Playwright has built-in auto-waiting; explicit timeout set at test level if needed
    // Use test.setTimeout() in individual tests or page.waitForTimeout() for specific waits
    
    await use(page);
    
    // Teardown happens automatically - Playwright closes page/context/browser
    // No need for explicit driver.quit() equivalent
  },
});

export { expect };

/**
 * Constants from original BaseTests
 */
export const TIMEOUT = 10000; // 10 seconds in milliseconds for Playwright APIs
