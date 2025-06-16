import { Page } from '@playwright/test';

export class LoanPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        amount: 'input#amount',
        downPayment: 'input#downPayment',
        fromAccount: 'select#fromAccountId',
        applyButton: 'input[value="Apply Now"]',
        loanRequestTitle: 'h1.title',
        loanId: 'td#loanId',
        loanStatus: 'td#loanStatus',
        loanResponse: 'p.ng-scope'
    };

    async navigateTo(): Promise<void> {
        await this.page.goto('/parabank/requestloan.htm');
    }

    async fillLoanForm(amount: string, downPayment: string, fromAccount: string): Promise<void> {
        await this.page.getByLabel('Loan Amount:').fill(amount);
        await this.page.getByLabel('Down Payment:').fill(downPayment);
        await this.page.selectOption('select#fromAccountId', fromAccount);
    }

    async submitLoanRequest(): Promise<void> {
        await this.page.getByRole('button', { name: 'Apply Now' }).click();
    }

    async isLoanApproved(): Promise<boolean> {
        const successMessage = await this.page.getByText('Loan Request Processed');
        return await successMessage.isVisible();
    }

    async getLoanConfirmation(): Promise<string> {
        const confirmationElement = await this.page.getByText(/Loan Request Processed/);
        return await confirmationElement.textContent() || '';
    }

    async getNewAccountNumber(): Promise<string> {
        const accountElement = await this.page.locator('#newAccountId');
        return await accountElement.textContent() || '';
    }

    // Get loan ID
    async getLoanId(): Promise<string> {
        return await this.page.textContent(this.locators.loanId) || '';
    }

    // Get loan status
    async getLoanStatus(): Promise<string> {
        return await this.page.textContent(this.locators.loanStatus) || '';
    }

    // Get loan response message
    async getLoanResponse(): Promise<string> {
        return await this.page.textContent(this.locators.loanResponse) || '';
    }

    // Complete loan request process
    async requestLoan(amount: number, downPayment: number, fromAccount: string): Promise<{
        success: boolean;
        loanId?: string;
        status?: string;
        response?: string;
    }> {
        await this.navigateTo();
        await this.fillLoanForm(amount.toString(), downPayment.toString(), fromAccount);
        await this.submitLoanRequest();
        
        const success = await this.isLoanApproved();
        if (success) {
            return {
                success,
                loanId: await this.getLoanId(),
                status: await this.getLoanStatus(),
                response: await this.getLoanResponse()
            };
        }
        
        return { success: false };
    }
} 