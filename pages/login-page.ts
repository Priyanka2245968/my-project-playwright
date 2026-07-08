import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ExcelUtils } from '../helpers/excel-utils';

/**
 * LoginPage - handles authentication and login form interactions
 */
export class LoginPage extends BasePage {
  // Locators - constructor-initialized from @FindBy annotations
  private readonly userName: Locator;
  private readonly password: Locator;
  private readonly missingUsernameErrorMessage: Locator;
  private readonly missingPasswordErrorMessage: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Map @FindBy annotations to Playwright locators
    this.userName = this.page.locator('[name="username"]');
    this.password = this.page.locator('[name="password"]');
    this.missingUsernameErrorMessage = this.page.locator('xpath=//*[@class=\'oxd-form\']/div[1]/div/span');
    this.missingPasswordErrorMessage = this.page.locator('xpath=//*[@class=\'oxd-form\']/div[2]/div/span');
    this.loginButton = this.page.locator('xpath=//*[@class=\'oxd-form\']/div[3]/button');
    this.errorMessage = this.page.locator('xpath=//*[@id=\'app\']/div[1]/div/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/p');
  }

  /**
   * Performs login action with provided credentials
   * @param strUserName - Username to enter
   * @param strPassword - Password to enter
   */
  async login(strUserName: string, strPassword: string): Promise<void> {
    await this.userName.fill(strUserName);
    await this.password.fill(strPassword);
    await this.loginButton.click();
  }

  /**
   * Gets the missing username error message text
   * @returns Error message text
   */
  async getMissingUsernameText(): Promise<string> {
    return await this.missingUsernameErrorMessage.textContent() ?? '';
  }

  /**
   * Gets the missing password error message text
   * @returns Error message text
   */
  async getMissingPasswordText(): Promise<string> {
    return await this.missingPasswordErrorMessage.textContent() ?? '';
  }

  /**
   * Gets the general error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() ?? '';
  }

  /**
   * Saves test results to Excel (from original Selenium implementation)
   * @param row - Row number for Excel cell
   * @param column - Column number for Excel cell
   * @returns this for method chaining
   */
  saveTestResults(row: number, column: number): LoginPage {
    // TODO: migrate — Original code sets static rowNumber/columnNumber on ExcelUtils.
    // The migrated ExcelUtils doesn't have these static fields. This method is used by
    // TestListener to track result locations. Consider:
    // 1. Storing row/column in test.info().annotations
    // 2. Implementing custom reporter that tracks results
    // 3. Removing Excel-based result tracking in favor of Playwright's built-in HTML reporter
    // For now, this is a no-op to allow tests to compile.
    return this;
  }
}
