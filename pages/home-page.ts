import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  readonly homePageUserName: Locator;

  constructor(page: Page) {
    super(page);
    this.homePageUserName = this.page.locator("//*[@id='app']/div[1]/div[1]/header/div[1]/div[1]/span/h6");
  }

  async getHomePageText(): Promise<string> {
    const text = await this.homePageUserName.textContent();
    return text || '';
  }
}