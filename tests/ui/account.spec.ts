import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { TestData } from '../utils/testData';

test.describe('Account Tests', () => {
    test('should open a new account after registration', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const userData = TestData.getDefaultUser();

        // Register a new user
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        // Verify successful registration and login
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Navigate to Open New Account page
        await homePage.clickOpenNewAccount();

        // Select account type
        await page.selectOption('select#type', 'SAVINGS');

        // Click Open New Account button
        await page.getByRole('button', { name: 'Open New Account' }).click();

        // Verify account opened successfully
        await expect(page.getByText('Account Opened!')).toBeVisible();

        // Get the new account number
        const accountNumber = await page.locator('#newAccountId').textContent();
        expect(accountNumber).toBeTruthy();
        console.log('New account number:', accountNumber);
    });

    test('should view accounts overview after registration', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const userData = TestData.getDefaultUser();

        // Register a new user
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();

        // Verify successful registration and login
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Navigate to Accounts Overview
        await homePage.clickAccountsOverview();

        // Verify accounts overview page
        await expect(page.getByText('Accounts Overview')).toBeVisible();
        
        // Verify account details are displayed
        const accountDetails = await page.locator('table#accountTable').textContent();
        expect(accountDetails).toBeTruthy();
        console.log('Account details:', accountDetails);
    });
}); 