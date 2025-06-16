import { Page } from '@playwright/test';

export class TransferPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        fromAccount: 'select#fromAccountId',
        toAccount: 'select#toAccountId',
        amount: 'input#amount',
        transferButton: 'input[value="Transfer"]',
        transferCompleteTitle: 'h1.title',
        transferAmount: 'span#amount'
    };

    // Navigate to transfer page
    async navigateTo(): Promise<void> {
        await this.page.goto('/parabank/transfer.htm');
    }

    // Fill transfer form
    async fillTransferForm(fromAccount: string, toAccount: string, amount: string): Promise<void> {
        await this.page.selectOption('select#fromAccountId', fromAccount);
        await this.page.selectOption('select#toAccountId', toAccount);
        await this.page.getByLabel('Amount:').fill(amount);
    }

    // Submit transfer
    async submitTransfer(): Promise<void> {
        await this.page.getByRole('button', { name: 'Transfer' }).click();
    }

    // Verify transfer success
    async isTransferSuccessful(): Promise<boolean> {
        const successMessage = await this.page.getByText('Transfer Complete!');
        return await successMessage.isVisible();
    }

    // Get transferred amount
    async getTransferredAmount(): Promise<string> {
        return await this.page.textContent(this.locators.transferAmount) || '';
    }

    // Complete transfer process
    async transferFunds(fromAccount: string, toAccount: string, amount: number): Promise<boolean> {
        await this.navigateTo();
        await this.fillTransferForm(fromAccount, toAccount, amount.toString());
        await this.submitTransfer();
        return await this.isTransferSuccessful();
    }
} 