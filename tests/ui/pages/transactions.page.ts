import { Page } from '@playwright/test';

export class TransactionsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        accountId: 'select#accountId',
        transactionType: 'select#criteria.transactionType',
        amount: 'input#criteria.amount',
        dateRange: {
            fromDate: 'input#criteria.fromDate',
            toDate: 'input#criteria.toDate'
        },
        findButton: 'button[type="submit"]',
        resultsTitle: 'h1.title',
        transactionTable: 'table#transactionTable tbody tr',
        transactionAmount: 'td.ng-binding'
    };

    async navigateTo(): Promise<void> {
        await this.page.goto('/parabank/findtrans.htm');
    }

    async searchByDateRange(accountId: string, fromDate: string, toDate: string): Promise<void> {
        await this.page.selectOption('select#accountId', accountId);
        await this.page.getByLabel('Find By Date Range:').click();
        await this.page.getByLabel('From Date:').fill(fromDate);
        await this.page.getByLabel('To Date:').fill(toDate);
        await this.page.getByRole('button', { name: 'Find Transactions' }).click();
    }

    async searchByAmount(accountId: string, amount: string): Promise<void> {
        await this.page.selectOption('select#accountId', accountId);
        await this.page.getByLabel('Find By Amount:').click();
        await this.page.getByLabel('Amount:').fill(amount);
        await this.page.getByRole('button', { name: 'Find Transactions' }).click();
    }

    async getTransactionResults(): Promise<string> {
        const resultsElement = await this.page.locator('table#transactionTable');
        return await resultsElement.textContent() || '';
    }

    async isTransactionFound(): Promise<boolean> {
        const noResults = await this.page.getByText('No transactions found.');
        return !(await noResults.isVisible());
    }

    // Fill transaction search criteria
    async fillSearchCriteria(criteria: {
        accountId: string;
        amount?: number;
        fromDate?: string;
        toDate?: string;
        transactionType?: string;
    }) {
        await this.page.selectOption(this.locators.accountId, criteria.accountId);
        
        if (criteria.amount) {
            await this.page.fill(this.locators.amount, criteria.amount.toString());
        }
        
        if (criteria.fromDate) {
            await this.page.fill(this.locators.dateRange.fromDate, criteria.fromDate);
        }
        
        if (criteria.toDate) {
            await this.page.fill(this.locators.dateRange.toDate, criteria.toDate);
        }
        
        if (criteria.transactionType) {
            await this.page.selectOption(this.locators.transactionType, criteria.transactionType);
        }
    }

    // Submit search
    async submitSearch() {
        await this.page.click(this.locators.findButton);
    }

    // Verify search results
    async areResultsFound(): Promise<boolean> {
        return await this.page.isVisible(this.locators.resultsTitle);
    }

    // Complete transaction search
    async findTransactions(criteria: {
        accountId: string;
        amount?: number;
        fromDate?: string;
        toDate?: string;
        transactionType?: string;
    }): Promise<Array<{
        date: string;
        description: string;
        type: string;
        amount: string;
    }>> {
        await this.navigateTo();
        await this.fillSearchCriteria(criteria);
        await this.submitSearch();
        return await this.getTransactionResults();
    }
} 