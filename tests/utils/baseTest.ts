import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../ui/pages/login.page';
import { HomePage } from '../ui/pages/home.page';
import { AccountPage } from '../ui/pages/account.page';
import { TransferPage } from '../ui/pages/transfer.page';
import { BillPayPage } from '../ui/pages/billpay.page';
import { TransactionsPage } from '../ui/pages/transactions.page';
import { LoanPage } from '../ui/pages/loan.page';
import { ProfilePage } from '../ui/pages/profile.page';
import { TestData, UserData } from './testData';
import { createTestUser } from './helpers';

// Extend the base test with custom fixtures
export const test = base.extend<{
    loginPage: LoginPage;
    homePage: HomePage;
    accountPage: AccountPage;
    transferPage: TransferPage;
    billPayPage: BillPayPage;
    transactionsPage: TransactionsPage;
    loanPage: LoanPage;
    profilePage: ProfilePage;
    testUser: UserData;
}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },
    transferPage: async ({ page }, use) => {
        await use(new TransferPage(page));
    },
    billPayPage: async ({ page }, use) => {
        await use(new BillPayPage(page));
    },
    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page));
    },
    loanPage: async ({ page }, use) => {
        await use(new LoanPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    testUser: async ({ page }, use) => {
        const userData = TestData.getDefaultUser();
        await createTestUser(page);
        await use(userData);
    }
});

export { expect } from '@playwright/test'; 