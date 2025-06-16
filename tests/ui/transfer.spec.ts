import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { TransferPage } from './pages/transfer.page';
import { TestData } from '../utils/testData';

test.describe('Transfer Funds Tests', () => {
    test('should transfer funds between accounts', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transferPage = new TransferPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open two accounts
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const fromAccount = await page.locator('#newAccountId').textContent();
        expect(fromAccount).toBeTruthy();

        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'CHECKING');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const toAccount = await page.locator('#newAccountId').textContent();
        expect(toAccount).toBeTruthy();

        // Navigate to Transfer Funds
        await homePage.clickTransferFunds();

        // Make transfer
        await transferPage.fillTransferForm(fromAccount!, toAccount!, '50.00');
        await transferPage.submitTransfer();

        // Verify transfer success
        await expect(page.getByText('Transfer Complete!')).toBeVisible();
        const confirmation = await page.getByText(/Transfer of/).textContent();
        expect(confirmation).toContain('50.00');
    });

    test('should show error for insufficient funds', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transferPage = new TransferPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open two accounts
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const fromAccount = await page.locator('#newAccountId').textContent();
        expect(fromAccount).toBeTruthy();

        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'CHECKING');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const toAccount = await page.locator('#newAccountId').textContent();
        expect(toAccount).toBeTruthy();

        // Try to transfer more than available balance
        await homePage.clickTransferFunds();
        await transferPage.fillTransferForm(fromAccount!, toAccount!, '1000000.00');
        await transferPage.submitTransfer();

        // Verify error message
        await expect(page.getByText('Insufficient funds')).toBeVisible();
    });

    test('should verify account balances after transfer', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transferPage = new TransferPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open two accounts
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const fromAccount = await page.locator('#newAccountId').textContent();
        expect(fromAccount).toBeTruthy();

        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'CHECKING');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const toAccount = await page.locator('#newAccountId').textContent();
        expect(toAccount).toBeTruthy();

        // Get initial balances
        await homePage.clickAccountsOverview();
        const initialFromBalance = await page.locator(`tr:has-text("${fromAccount}") td:last-child`).textContent() || '0';
        const initialToBalance = await page.locator(`tr:has-text("${toAccount}") td:last-child`).textContent() || '0';

        // Make transfer
        await homePage.clickTransferFunds();
        await transferPage.fillTransferForm(fromAccount!, toAccount!, '50.00');
        await transferPage.submitTransfer();
        await expect(page.getByText('Transfer Complete!')).toBeVisible();

        // Verify new balances
        await homePage.clickAccountsOverview();
        const newFromBalance = await page.locator(`tr:has-text("${fromAccount}") td:last-child`).textContent() || '0';
        const newToBalance = await page.locator(`tr:has-text("${toAccount}") td:last-child`).textContent() || '0';

        expect(parseFloat(newFromBalance)).toBe(parseFloat(initialFromBalance) - 50.00);
        expect(parseFloat(newToBalance)).toBe(parseFloat(initialToBalance) + 50.00);
    });
}); 