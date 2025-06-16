import { Page } from '@playwright/test';

export class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators for navigation menu items
    private navMenuItems = {
        openNewAccount: 'a[href*="openaccount"]',
        accountsOverview: 'a[href*="overview"]',
        transferFunds: 'a[href*="transfer"]',
        billPay: 'a[href*="billpay"]',
        findTransactions: 'a[href*="findtrans"]',
        updateContactInfo: 'a[href*="updateprofile"]',
        requestLoan: 'a[href*="requestloan"]',
        logout: 'a[href*="logout"]'
    };

    // Verify if user is logged in
    async isLoggedIn(): Promise<boolean> {
        return await this.page.isVisible('a[href*="logout"]');
    }

    // Click on navigation menu items
    async clickOpenNewAccount() {
        await this.page.click(this.navMenuItems.openNewAccount);
    }

    async clickAccountsOverview() {
        await this.page.click(this.navMenuItems.accountsOverview);
    }

    async clickTransferFunds() {
        await this.page.click(this.navMenuItems.transferFunds);
    }

    async clickBillPay() {
        await this.page.click(this.navMenuItems.billPay);
    }

    async clickFindTransactions() {
        await this.page.click(this.navMenuItems.findTransactions);
    }

    async clickUpdateContactInfo() {
        await this.page.click(this.navMenuItems.updateContactInfo);
    }

    async clickRequestLoan() {
        await this.page.click(this.navMenuItems.requestLoan);
    }

    async clickLogout() {
        await this.page.click(this.navMenuItems.logout);
    }

    // Verify if navigation menu items are visible
    async areNavMenuItemsVisible(): Promise<boolean> {
        for (const item of Object.values(this.navMenuItems)) {
            if (!await this.page.isVisible(item)) {
                return false;
            }
        }
        return true;
    }

    // Get the current page title
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
} 