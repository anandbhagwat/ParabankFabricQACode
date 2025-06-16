import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { TestData } from '../utils/testData';

test.describe('Navigation Tests', () => {
    test('should verify global navigation menu after registration', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const userData = TestData.getDefaultUser();

        // Register a new user
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        // Verify successful registration and login
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Verify all navigation menu items are visible
        const menuItems = [
            'Open New Account',
            'Accounts Overview',
            'Transfer Funds',
            'Bill Pay',
            'Find Transactions',
            'Update Contact Info',
            'Request Loan',
            'Log Out'
        ];

        for (const item of menuItems) {
            await expect(page.getByRole('link', { name: item })).toBeVisible();
        }

        // Test navigation to each menu item
        for (const item of menuItems) {
            if (item === 'Log Out') continue; // Skip logout for now

            await page.getByRole('link', { name: item }).click();
            const pageTitle = await homePage.getPageTitle();
            expect(pageTitle).toBeTruthy();
            console.log(`Navigated to ${item}, page title: ${pageTitle}`);
        }
    });
}); 