import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { TransferPage } from './pages/transfer.page';
import { TransactionsPage } from './pages/transactions.page';
import { TestData } from '../utils/testData';

test.describe('Find Transactions Tests', () => {
    test('should find transactions by date range', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transferPage = new TransferPage(page);
        const transactionsPage = new TransactionsPage(page);
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

        // Make a transfer
        await homePage.clickTransferFunds();
        await transferPage.fillTransferForm(fromAccount!, toAccount!, '50.00');
        await transferPage.submitTransfer();
        await expect(page.getByText('Transfer Complete!')).toBeVisible();

        // Find transactions by date range
        await homePage.clickFindTransactions();
        const today = new Date().toISOString().split('T')[0];
        await transactionsPage.searchByDateRange(fromAccount!, today, today);

        // Verify transaction found
        const results = await transactionsPage.getTransactionResults();
        expect(results).toContain('50.00');
        expect(await transactionsPage.isTransactionFound()).toBeTruthy();
    });

    test('should find transactions by amount', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transferPage = new TransferPage(page);
        const transactionsPage = new TransactionsPage(page);
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

        // Make a transfer
        await homePage.clickTransferFunds();
        await transferPage.fillTransferForm(fromAccount!, toAccount!, '75.00');
        await transferPage.submitTransfer();
        await expect(page.getByText('Transfer Complete!')).toBeVisible();

        // Find transactions by amount
        await homePage.clickFindTransactions();
        await transactionsPage.searchByAmount(fromAccount!, '75.00');

        // Verify transaction found
        const results = await transactionsPage.getTransactionResults();
        expect(results).toContain('75.00');
        expect(await transactionsPage.isTransactionFound()).toBeTruthy();
    });

    test('should show no results for non-existent transactions', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const transactionsPage = new TransactionsPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open an account
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountId = await page.locator('#newAccountId').textContent();
        expect(accountId).toBeTruthy();

        // Search for non-existent transaction
        await homePage.clickFindTransactions();
        await transactionsPage.searchByAmount(accountId!, '999999.99');

        // Verify no results found
        expect(await transactionsPage.isTransactionFound()).toBeFalsy();
        await expect(page.getByText('No transactions found.')).toBeVisible();
    });
}); 