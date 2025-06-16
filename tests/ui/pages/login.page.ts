import { Page } from '@playwright/test';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        usernameInput: 'input[name="username"]',
        passwordInput: 'input[name="password"]',
        loginButton: 'input[value="Log In"]',
        errorMessage: 'p.error',
        welcomeMessage: 'p.welcome'
    };

    // Navigate to login page
    async navigate() {
        await this.page.goto('/parabank/login.htm');
    }

    // Fill login form
    async fillLoginForm(username: string, password: string) {
        await this.page.fill(this.locators.usernameInput, username);
        await this.page.fill(this.locators.passwordInput, password);
    }

    // Click login button
    async clickLogin() {
        await this.page.click(this.locators.loginButton);
    }

    // Check if login was successful
    async isLoginSuccessful(): Promise<boolean> {
        return await this.page.isVisible(this.locators.welcomeMessage);
    }

    // Get error message if login failed
    async getErrorMessage(): Promise<string | null> {
        return await this.page.textContent(this.locators.errorMessage);
    }

    // Complete login process
    async login(username: string, password: string): Promise<boolean> {
        await this.navigate();
        await this.fillLoginForm(username, password);
        await this.clickLogin();
        return await this.isLoginSuccessful();
    }
} 