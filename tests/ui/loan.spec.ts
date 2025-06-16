import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { LoanPage } from './pages/loan.page';
import { TestData } from '../utils/testData';

test.describe('Loan Request Tests', () => {
    test('should request and get approved for a loan', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const loanPage = new LoanPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open an account for down payment
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountId = await page.locator('#newAccountId').textContent();
        expect(accountId).toBeTruthy();

        // Request a loan
        await homePage.clickRequestLoan();
        await loanPage.fillLoanForm('10000.00', '1000.00', accountId!);
        await loanPage.submitLoanRequest();

        // Verify loan approval
        await expect(page.getByText('Loan Request Processed')).toBeVisible();
        const confirmation = await loanPage.getLoanConfirmation();
        expect(confirmation).toContain('Approved');

        // Verify new loan account
        const newAccountId = await loanPage.getNewAccountNumber();
        expect(newAccountId).toBeTruthy();
    });

    test('should be rejected for insufficient down payment', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const loanPage = new LoanPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open an account for down payment
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountId = await page.locator('#newAccountId').textContent();
        expect(accountId).toBeTruthy();

        // Request a loan with insufficient down payment
        await homePage.clickRequestLoan();
        await loanPage.fillLoanForm('10000.00', '100.00', accountId!);
        await loanPage.submitLoanRequest();

        // Verify loan rejection
        await expect(page.getByText('Loan Request Processed')).toBeVisible();
        const confirmation = await loanPage.getLoanConfirmation();
        expect(confirmation).toContain('Denied');
    });

    test('should show error for invalid loan amount', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const loanPage = new LoanPage(page);
        const userData = TestData.getDefaultUser();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open an account for down payment
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountId = await page.locator('#newAccountId').textContent();
        expect(accountId).toBeTruthy();

        // Try to request a loan with invalid amount
        await homePage.clickRequestLoan();
        await loanPage.fillLoanForm('-10000.00', '1000.00', accountId!);
        await loanPage.submitLoanRequest();

        // Verify error message
        await expect(page.getByText('Please enter a valid amount')).toBeVisible();
    });
}); 