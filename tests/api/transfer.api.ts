import { test, expect } from '@playwright/test';
import { BaseApi } from './baseApi';
import { TestData } from '../utils/testData';

interface Transfer {
    fromAccountId: string;
    toAccountId: string;
    amount: string;
}

interface Account {
    id: string;
    balance: number;
    type: string;
}

export class TransferApi extends BaseApi {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async transferFunds(transfer: Transfer) {
        return await this.post('/services_proxy/bank/transfer', transfer);
    }

    async getAccountBalance(accountId: string) {
        return await this.get(`/services_proxy/bank/accounts/${accountId}`);
    }

    async registerUser(userData: any) {
        return await this.post('/services_proxy/bank/register', {
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            zipCode: userData.zipCode,
            phoneNumber: userData.phone,
            ssn: userData.ssn,
            username: userData.username,
            password: userData.password
        });
    }

    async createAccount(customerId: string, type: string, fromAccountId: string) {
        return await this.post('/services_proxy/bank/createAccount', {
            customerId,
            newAccountType: type,
            fromAccountId
        });
    }
}

test.describe('Transfer Funds API Tests', () => {
    let transferApi: TransferApi;
    const userData = TestData.getDefaultUser();

    test.beforeEach(async () => {
        transferApi = new TransferApi('http://parabank.parasoft.com/parabank');
        await transferApi.init();
    });

    test.afterEach(async () => {
        await transferApi.cleanup();
    });

    test('should transfer funds between accounts', async () => {
        // First register a user and get customer ID
        const registerResponse = await transferApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const customerId = (await registerResponse.json()).id;

        // Create source account
        const createSourceAccountResponse = await transferApi.createAccount(customerId, 'SAVINGS', '');
        expect(createSourceAccountResponse.ok()).toBeTruthy();
        const sourceAccountData = await createSourceAccountResponse.json();
        const sourceAccountId = sourceAccountData.id;

        // Create destination account
        const createDestAccountResponse = await transferApi.createAccount(customerId, 'CHECKING', '');
        expect(createDestAccountResponse.ok()).toBeTruthy();
        const destAccountData = await createDestAccountResponse.json();
        const destAccountId = destAccountData.id;

        // Get initial balances
        const initialSourceBalanceResponse = await transferApi.getAccountBalance(sourceAccountId);
        const initialDestBalanceResponse = await transferApi.getAccountBalance(destAccountId);
        const initialSourceBalance = await initialSourceBalanceResponse.json() as Account;
        const initialDestBalance = await initialDestBalanceResponse.json() as Account;

        // Transfer funds
        const transfer: Transfer = {
            fromAccountId: sourceAccountId,
            toAccountId: destAccountId,
            amount: '50.00'
        };

        const transferResponse = await transferApi.transferFunds(transfer);
        expect(transferResponse.ok()).toBeTruthy();
        const transferData = await transferResponse.json();
        expect(transferData.id).toBeTruthy();
        expect(transferData.amount).toBe('50.00');

        // Verify balances after transfer
        const finalSourceBalanceResponse = await transferApi.getAccountBalance(sourceAccountId);
        const finalDestBalanceResponse = await transferApi.getAccountBalance(destAccountId);
        const finalSourceBalance = await finalSourceBalanceResponse.json() as Account;
        const finalDestBalance = await finalDestBalanceResponse.json() as Account;

        expect(finalSourceBalance.balance).toBe(initialSourceBalance.balance - 50.00);
        expect(finalDestBalance.balance).toBe(initialDestBalance.balance + 50.00);
    });

    test('should fail when transferring with insufficient funds', async () => {
        // First register a user and get customer ID
        const registerResponse = await transferApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const customerId = (await registerResponse.json()).id;

        // Create source account
        const createSourceAccountResponse = await transferApi.createAccount(customerId, 'SAVINGS', '');
        expect(createSourceAccountResponse.ok()).toBeTruthy();
        const sourceAccountData = await createSourceAccountResponse.json();
        const sourceAccountId = sourceAccountData.id;

        // Create destination account
        const createDestAccountResponse = await transferApi.createAccount(customerId, 'CHECKING', '');
        expect(createDestAccountResponse.ok()).toBeTruthy();
        const destAccountData = await createDestAccountResponse.json();
        const destAccountId = destAccountData.id;

        // Try to transfer more than available balance
        const transfer: Transfer = {
            fromAccountId: sourceAccountId,
            toAccountId: destAccountId,
            amount: '999999.99'
        };

        const transferResponse = await transferApi.transferFunds(transfer);
        expect(transferResponse.ok()).toBeFalsy();
    });
}); 