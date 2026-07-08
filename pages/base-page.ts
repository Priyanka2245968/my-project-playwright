import { Page } from '@playwright/test';

/**
 * Base page class for all page objects.
 * Provides common page functionality and establishes patterns for derived classes.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {
    // Playwright handles element initialization automatically via locators
    // No need for PageFactory.initElements equivalent
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}