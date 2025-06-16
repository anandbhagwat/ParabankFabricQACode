import { test, expect } from '@playwright/test';
import { BaseApi } from './baseApi';
import { TestData } from '../utils/testData';

interface Account {
    id: string;
    type: string;
    customerId: string;
}

export class AccountApi extends BaseApi {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async createAccount(customerId: string, type: string, fromAccountId: string) {
        return await this.post('/services_proxy/bank/createAccount', {
            customerId,
            newAccountType: type,
            fromAccountId
        });
    }

    async getAccounts(customerId: string) {
        return await this.get(`/services_proxy/bank/customers/${customerId}/accounts`);
    }

    async getAccount(accountId: string) {
        return await this.get(`/services_proxy/bank/accounts/${accountId}`);
    }

    async registerUser(userData: any) {
        const formData = new URLSearchParams();
        formData.append('customer.firstName', userData.firstName);
        formData.append('customer.lastName', userData.lastName);
        formData.append('customer.address.street', userData.address);
        formData.append('customer.address.city', userData.city);
        formData.append('customer.address.state', userData.state);
        formData.append('customer.address.zipCode', userData.zipCode);
        formData.append('customer.phoneNumber', userData.phone);
        formData.append('customer.ssn', userData.ssn);
        formData.append('customer.username', userData.username);
        formData.append('customer.password', userData.password);
        formData.append('repeatedPassword', userData.password);

        return await this.request.post('/parabank/register.htm', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });
    }
}

test.describe('Account API Tests', () => {
    let accountApi: AccountApi;
    const userData = TestData.getDefaultUser();

    test.beforeEach(async () => {
        accountApi = new AccountApi('http://parabank.parasoft.com/parabank');
        await accountApi.init();
    });

    test.afterEach(async () => {
        await accountApi.cleanup();
    });

    test('should create a new account', async () => {
        // First register a user and get customer ID
        const registerResponse = await accountApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();

        // Create a new account
        const createAccountResponse = await accountApi.createAccount(userData.username, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        expect(accountData.id).toBeTruthy();
        expect(accountData.type).toBe('SAVINGS');
    });

    test('should get customer accounts', async () => {
        // First register a user and get customer ID
        const registerResponse = await accountApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();

        // Create a new account
        const createAccountResponse = await accountApi.createAccount(userData.username, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        const accountId = accountData.id;

        // Get customer accounts
        const getAccountsResponse = await accountApi.getAccounts(userData.username);
        expect(getAccountsResponse.ok()).toBeTruthy();
        const accounts = await getAccountsResponse.json() as Account[];
        expect(Array.isArray(accounts)).toBeTruthy();
        expect(accounts.length).toBeGreaterThan(0);
        expect(accounts.find((acc: Account) => acc.id === accountId)).toBeTruthy();
    });

    test('should get account details', async () => {
        // First register a user and get customer ID
        const registerResponse = await accountApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();

        // Create a new account
        const createAccountResponse = await accountApi.createAccount(userData.username, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        const accountId = accountData.id;

        // Get account details
        const getAccountResponse = await accountApi.getAccount(accountId);
        expect(getAccountResponse.ok()).toBeTruthy();
        const account = await getAccountResponse.json() as Account;
        expect(account.id).toBe(accountId);
        expect(account.type).toBe('SAVINGS');
    });
}); 