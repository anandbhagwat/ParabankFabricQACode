import { Page } from '@playwright/test';

export class RegisterPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private firstNameInput = 'input[name="customer.firstName"]';
    private lastNameInput = 'input[name="customer.lastName"]';
    private addressInput = 'input[name="customer.address.street"]';
    private cityInput = 'input[name="customer.address.city"]';
    private stateInput = 'input[name="customer.address.state"]';
    private zipCodeInput = 'input[name="customer.address.zipCode"]';
    private phoneInput = 'input[name="customer.phoneNumber"]';
    private ssnInput = 'input[name="customer.ssn"]';
    private usernameInput = 'input[name="customer.username"]';
    private passwordInput = 'input[name="customer.password"]';
    private confirmPasswordInput = 'input[name="repeatedPassword"]';
    private registerButton = 'input[value="Register"]';
    private welcomeMessage = 'p.welcome';
    private errorMessage = 'span.error';

    // Actions
    async fillRegistrationForm(userData: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
        ssn: string;
        username: string;
        password: string;
    }) {
        await this.page.fill(this.firstNameInput, userData.firstName);
        await this.page.fill(this.lastNameInput, userData.lastName);
        await this.page.fill(this.addressInput, userData.address);
        await this.page.fill(this.cityInput, userData.city);
        await this.page.fill(this.stateInput, userData.state);
        await this.page.fill(this.zipCodeInput, userData.zipCode);
        await this.page.fill(this.phoneInput, userData.phone);
        await this.page.fill(this.ssnInput, userData.ssn);
        await this.page.fill(this.usernameInput, userData.username);
        await this.page.fill(this.passwordInput, userData.password);
        await this.page.fill(this.confirmPasswordInput, userData.password);
    }

    async clickRegister() {
        await this.page.click(this.registerButton);
        // Wait for navigation and network to be idle
        await this.page.waitForLoadState('networkidle');
        // Add a small delay to ensure the page has time to process
        await this.page.waitForTimeout(1000);
    }

    async isRegistrationSuccessful(): Promise<boolean> {
        try {
            // Wait for either success or error message
            await this.page.waitForSelector(`${this.welcomeMessage}, ${this.errorMessage}`, { timeout: 10000 });
            
            // Check for welcome message
            const welcomeVisible = await this.page.isVisible(this.welcomeMessage);
            if (welcomeVisible) {
                return true;
            }

            // If welcome message not found, check for error message
            const errorVisible = await this.page.isVisible(this.errorMessage);
            if (errorVisible) {
                const errorText = await this.page.textContent(this.errorMessage);
                console.log('Registration error:', errorText);
            }

            return false;
        } catch (error) {
            console.log('Error during registration verification:', error);
            return false;
        }
    }

    async getWelcomeMessage(): Promise<string | null> {
        return await this.page.textContent(this.welcomeMessage);
    }
} 