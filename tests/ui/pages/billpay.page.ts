import { Page } from '@playwright/test';
import { PayeeData } from '../../utils/testData';

export class BillPayPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        payeeName: 'input[name="payee.name"]',
        payeeAddress: 'input[name="payee.address.street"]',
        payeeCity: 'input[name="payee.address.city"]',
        payeeState: 'input[name="payee.address.state"]',
        payeeZipCode: 'input[name="payee.address.zipCode"]',
        payeePhone: 'input[name="payee.phoneNumber"]',
        payeeAccount: 'input[name="payee.accountNumber"]',
        verifyAccount: 'input[name="verifyAccount"]',
        amount: 'input[name="amount"]',
        fromAccount: 'select#fromAccountId',
        sendPaymentButton: 'input[value="Send Payment"]',
        paymentCompleteTitle: 'h1.title',
        paymentAmount: 'span#amount'
    };

    async navigateTo(): Promise<void> {
        await this.page.goto('/parabank/billpay.htm');
    }

    async fillPayeeForm(payeeData: PayeeData): Promise<void> {
        await this.page.getByLabel('Payee Name:').fill(payeeData.name);
        await this.page.getByLabel('Address:').fill(payeeData.address);
        await this.page.getByLabel('City:').fill(payeeData.city);
        await this.page.getByLabel('State:').fill(payeeData.state);
        await this.page.getByLabel('Zip Code:').fill(payeeData.zipCode);
        await this.page.getByLabel('Phone:').fill(payeeData.phone);
        await this.page.getByLabel('Account #:').fill(payeeData.accountNumber);
    }

    async fillPaymentForm(accountId: string, amount: string): Promise<void> {
        await this.page.getByLabel('Account #:').fill(accountId);
        await this.page.getByLabel('Amount:').fill(amount);
    }

    async submitPayment(): Promise<void> {
        await this.page.getByRole('button', { name: 'Send Payment' }).click();
    }

    async isPaymentSuccessful(): Promise<boolean> {
        const successMessage = await this.page.getByText('Bill Payment Complete');
        return await successMessage.isVisible();
    }

    async getPaymentConfirmation(): Promise<string> {
        const confirmationElement = await this.page.getByText(/Bill Payment to/);
        return await confirmationElement.textContent() || '';
    }

    // Complete bill payment process
    async payBill(
        payeeInfo: {
            name: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            phone: string;
            accountNumber: string;
        },
        amount: number,
        fromAccount: string
    ): Promise<boolean> {
        await this.navigateTo();
        await this.fillPayeeForm(payeeInfo);
        await this.fillPaymentForm(fromAccount, amount.toString());
        await this.submitPayment();
        return await this.isPaymentSuccessful();
    }
} 