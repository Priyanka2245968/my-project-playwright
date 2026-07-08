import { test as base, expect } from '@playwright/test';
import type { Page, BrowserContext, Browser, TestInfo } from '@playwright/test';
import { ExcelUtils } from '../helpers/excel-utils';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Extended fixture that includes test listener functionality from TestListener.java
 * Merges screenshot capture, logging, and Excel result updates into test lifecycle hooks
 */
export const test = base.extend<{
  page: Page;
  context: BrowserContext;
  browser: Browser;
}>({{
  page: async ({ page }, use, testInfo) => {
    // onTestStart equivalent - log test start
    console.log(`I am in onTestStart method :${testInfo.title}: start`);
    
    // Navigate to base URL
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    
    // Maximize window
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Run the test
    await use(page);
    
    // afterEach hook - handle test result (onTestSuccess/onTestFailure/onTestSkipped)
    const status = testInfo.status;
    const testName = testInfo.title;
    
    if (status === 'passed') {
      console.log(`I am in onTestSuccess method :${testName}: succeed`);
      // TODO: migrate - Update Excel with PASSED status
      // Original code: ExcelUtils.setCellData("PASSED", ExcelUtils.rowNumber, ExcelUtils.columnNumber)
      // Requires row/column tracking context that doesn't exist in Playwright fixtures
      // Consider using test.info().annotations or custom reporter instead
    } else if (status === 'failed') {
      console.log(`I am in onTestFailure method :${testName} failed`);
      
      // Capture screenshot on failure
      const screenshotDir = path.join(testInfo.project.outputDir, 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const screenshotPath = path.join(screenshotDir, `${testInfo.title.replace(/\s+/g, '_')}-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: 'failure-screenshot',
        path: screenshotPath,
        contentType: 'image/png'
      });
      
      // TODO: migrate - Update Excel with FAILED status
      // Original code: ExcelUtils.setCellData("FAILED", ExcelUtils.rowNumber, ExcelUtils.columnNumber)
      // Requires row/column tracking context that doesn't exist in Playwright fixtures
    } else if (status === 'skipped') {
      console.log(`I am in onTestSkipped method :${testName}: skipped`);
      // TODO: migrate - Update Excel with SKIPPED status
      // Original code: ExcelUtils.setCellData("SKIPPED", ExcelUtils.rowNumber, ExcelUtils.columnNumber)
      // Requires row/column tracking context that doesn't exist in Playwright fixtures
    }
  },
});

/**
 * Test suite lifecycle hooks
 * Replaces ITestListener.onStart and ITestListener.onFinish
 */
export function setupTestSuiteLogging(suiteName: string) {
  return {
    beforeAll: async () => {
      console.log(`I am in onStart method :${suiteName}`);
    },
    afterAll: async () => {
      console.log(`I am in onFinish method :${suiteName}`);
    }
  };
}

export { expect };

/**
 * Constants from original BaseTests
 */
export const TIMEOUT = 10000; // 10 seconds in milliseconds for Playwright APIs