import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loggedInUsername: Locator;
  private readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loggedInUsername = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(userName: string, password: string): Promise<void> {
    await this.usernameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  get errorMessage(): Locator {
    // DemoQA renders the login failure message in a <p id="name">
    return this.page.locator('#name');
  }

  async expectLoggedInAs(userName: string): Promise<void> {
    // Successful login lands on /profile showing the username
    await expect(this.page).toHaveURL(/.*\/profile/);
    await expect(this.loggedInUsername).toHaveText(userName);
  }

  async expectStillOnLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/login/);
  }

  async expectSessionActive(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
  }
}
