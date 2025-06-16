import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { RegisterPage } from './pages/register.page';
import { BillPayPage } from './pages/billpay.page';
import { TestData } from '../utils/testData';

test.describe('Bill Pay Tests', () => {
    test('should add a new payee and make a payment', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const billPayPage = new BillPayPage(page);
        const userData = TestData.getDefaultUser();
        const payeeData = TestData.getDefaultPayee();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open a new account for payment
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountNumber = await page.locator('#newAccountId').textContent();
        expect(accountNumber).toBeTruthy();

        // Navigate to Bill Pay
        await homePage.clickBillPay();

        // Add payee and make payment
        await billPayPage.fillPayeeForm(payeeData);
        await billPayPage.fillPaymentForm(accountNumber!, '100.00');
        await billPayPage.submitPayment();

        // Verify payment success
        await expect(page.getByText('Bill Payment Complete')).toBeVisible();
        const confirmation = await billPayPage.getPaymentConfirmation();
        expect(confirmation).toContain(payeeData.name);
    });

    test('should make multiple payments to different payees', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const billPayPage = new BillPayPage(page);
        const userData = TestData.getDefaultUser();
        const testPayees = TestData.getTestPayees();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open a new account for payments
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountNumber = await page.locator('#newAccountId').textContent();
        expect(accountNumber).toBeTruthy();

        // Make payments to each payee
        for (const payee of testPayees) {
            await homePage.clickBillPay();
            await billPayPage.fillPayeeForm(payee);
            await billPayPage.fillPaymentForm(accountNumber!, '50.00');
            await billPayPage.submitPayment();

            // Verify payment success
            await expect(page.getByText('Bill Payment Complete')).toBeVisible();
            const confirmation = await billPayPage.getPaymentConfirmation();
            expect(confirmation).toContain(payee.name);
        }
    });

    test('should show error for invalid payment amount', async ({ page }) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const billPayPage = new BillPayPage(page);
        const userData = TestData.getDefaultUser();
        const payeeData = TestData.getDefaultPayee();

        // Register and login
        await registerPage.navigateTo();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitForm();
        await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();

        // Open a new account
        await homePage.clickOpenNewAccount();
        await page.selectOption('select#type', 'SAVINGS');
        await page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(page.getByText('Account Opened!')).toBeVisible();
        const accountNumber = await page.locator('#newAccountId').textContent();
        expect(accountNumber).toBeTruthy();

        // Try to make payment with invalid amount
        await homePage.clickBillPay();
        await billPayPage.fillPayeeForm(payeeData);
        await billPayPage.fillPaymentForm(accountNumber!, '-100.00');
        await billPayPage.submitPayment();

        // Verify error message
        await expect(page.getByText('Please enter a valid amount')).toBeVisible();
    });
}); 