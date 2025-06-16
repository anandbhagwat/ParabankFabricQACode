import { Page } from '@playwright/test';

export class AccountPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        accountType: 'select#type',
        openAccountButton: 'input[value="Open New Account"]',
        newAccountId: 'a#newAccountId',
        accountOpenedMessage: 'p.ng-scope',
        accountsOverviewTitle: 'h1.title',
        accountList: 'table#accountTable tbody tr',
        accountBalance: 'td.balance'
    };

    // Open new account
    async openNewAccount(accountType: 'SAVINGS' | 'CHECKING'): Promise<string> {
        await this.page.selectOption(this.locators.accountType, accountType);
        await this.page.click(this.locators.openAccountButton);
        await this.page.waitForSelector(this.locators.newAccountId);
        return await this.page.textContent(this.locators.newAccountId) || '';
    }

    // Verify account opened
    async isAccountOpened(): Promise<boolean> {
        return await this.page.isVisible(this.locators.accountOpenedMessage);
    }

    // Get account balance
    async getAccountBalance(accountId: string): Promise<string> {
        const accountRow = await this.page.locator(`tr:has-text("${accountId}")`);
        return await accountRow.locator(this.locators.accountBalance).textContent() || '';
    }

    // Get all accounts
    async getAllAccounts(): Promise<Array<{ id: string; type: string; balance: string }>> {
        const accounts = [];
        const rows = await this.page.locator(this.locators.accountList).all();
        
        for (const row of rows) {
            const id = await row.locator('td a').textContent() || '';
            const type = await row.locator('td:nth-child(2)').textContent() || '';
            const balance = await row.locator('td:nth-child(3)').textContent() || '';
            accounts.push({ id, type, balance });
        }
        
        return accounts;
    }

    // Verify account in overview
    async isAccountInOverview(accountId: string): Promise<boolean> {
        return await this.page.isVisible(`a[href*="activity.htm?id=${accountId}"]`);
    }
} 