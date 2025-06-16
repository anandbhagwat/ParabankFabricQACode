import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { TestData } from '../utils/testData';

test.describe('Registration Tests', () => {
    test('should register a new user successfully', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const userData = TestData.getDefaultUser();

        // Navigate to registration page
        await registerPage.navigateTo();

        // Fill out the registration form
        await registerPage.fillRegistrationForm(userData);

        // Submit the form
        await registerPage.submitForm();

        // Verify successful registration
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
    });

    test('should register multiple test users', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const testUsers = TestData.getTestUsers();

        for (const userData of testUsers) {
            // Navigate to registration page
            await registerPage.navigateTo();

            // Fill out the registration form
            await registerPage.fillRegistrationForm(userData);

            // Submit the form
            await registerPage.submitForm();

            // Verify successful registration
            await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

            // Logout for next user
            await page.getByRole('link', { name: 'Log Out' }).click();
        }
    });

    test('should show error for existing username', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const userData = TestData.getDefaultUser();

        // First registration
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Logout
        await page.getByRole('link', { name: 'Log Out' }).click();

        // Try to register with same username
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        // Verify error message
        await expect(page.getByText('This username already exists.')).toBeVisible();
    });
}); 