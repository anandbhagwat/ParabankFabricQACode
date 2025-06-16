import { Page } from '@playwright/test';
import { UserData } from '../../utils/testData';

export class RegisterPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(): Promise<void> {
        await this.page.goto('/parabank/register.htm');
    }

    async fillRegistrationForm(userData: UserData): Promise<void> {
        await this.page.getByLabel('First Name:').fill(userData.firstName);
        await this.page.getByLabel('Last Name:').fill(userData.lastName);
        await this.page.getByLabel('Address:').fill(userData.address);
        await this.page.getByLabel('City:').fill(userData.city);
        await this.page.getByLabel('State:').fill(userData.state);
        await this.page.getByLabel('Zip Code:').fill(userData.zipCode);
        await this.page.getByLabel('Phone #:').fill(userData.phone);
        await this.page.getByLabel('SSN:').fill(userData.ssn);
        await this.page.getByLabel('Username:').fill(userData.username);
        await this.page.getByLabel('Password:').fill(userData.password);
        await this.page.getByLabel('Confirm:').fill(userData.password);
    }

    async submitForm(): Promise<void> {
        await this.page.getByRole('button', { name: 'Register' }).click();
    }

    async isRegistrationSuccessful(): Promise<boolean> {
        const successMessage = await this.page.getByText('Your account was created successfully. You are now logged in.');
        return await successMessage.isVisible();
    }

    async getWelcomeMessage(): Promise<string> {
        const welcomeElement = await this.page.getByText(/Welcome/);
        return await welcomeElement.textContent() || '';
    }
} 