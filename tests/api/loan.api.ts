import { test, expect } from '@playwright/test';
import { BaseApi } from './baseApi';
import { TestData } from '../utils/testData';

interface LoanRequest {
    customerId: string;
    amount: string;
    downPayment: string;
    fromAccountId: string;
}

interface LoanResponse {
    id: string;
    amount: string;
    downPayment: string;
    fromAccountId: string;
    status: string;
}

export class LoanApi extends BaseApi {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async requestLoan(loanRequest: LoanRequest) {
        return await this.post('/services_proxy/bank/requestLoan', loanRequest);
    }

    async getLoanStatus(loanId: string) {
        return await this.get(`/services_proxy/bank/loans/${loanId}`);
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

test.describe('Loan Request API Tests', () => {
    let loanApi: LoanApi;
    const userData = TestData.getDefaultUser();

    test.beforeEach(async () => {
        loanApi = new LoanApi('http://parabank.parasoft.com/parabank');
        await loanApi.init();
    });

    test.afterEach(async () => {
        await loanApi.cleanup();
    });

    test('should approve loan request with sufficient down payment', async () => {
        // First register a user and get customer ID
        const registerResponse = await loanApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const customerId = (await registerResponse.json()).id;

        // Create account for down payment
        const createAccountResponse = await loanApi.createAccount(customerId, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        const accountId = accountData.id;

        // Request loan
        const loanRequest: LoanRequest = {
            customerId,
            amount: '10000.00',
            downPayment: '2000.00',
            fromAccountId: accountId
        };

        const loanResponse = await loanApi.requestLoan(loanRequest);
        expect(loanResponse.ok()).toBeTruthy();
        const loanData = await loanResponse.json() as LoanResponse;
        expect(loanData.id).toBeTruthy();
        expect(loanData.amount).toBe('10000.00');
        expect(loanData.downPayment).toBe('2000.00');
        expect(loanData.status).toBe('APPROVED');
    });

    test('should reject loan request with insufficient down payment', async () => {
        // First register a user and get customer ID
        const registerResponse = await loanApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const customerId = (await registerResponse.json()).id;

        // Create account for down payment
        const createAccountResponse = await loanApi.createAccount(customerId, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        const accountId = accountData.id;

        // Request loan with insufficient down payment
        const loanRequest: LoanRequest = {
            customerId,
            amount: '10000.00',
            downPayment: '100.00',
            fromAccountId: accountId
        };

        const loanResponse = await loanApi.requestLoan(loanRequest);
        expect(loanResponse.ok()).toBeTruthy();
        const loanData = await loanResponse.json() as LoanResponse;
        expect(loanData.id).toBeTruthy();
        expect(loanData.status).toBe('DENIED');
    });

    test('should fail when requesting loan with invalid amount', async () => {
        // First register a user and get customer ID
        const registerResponse = await loanApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const customerId = (await registerResponse.json()).id;

        // Create account for down payment
        const createAccountResponse = await loanApi.createAccount(customerId, 'SAVINGS', '');
        expect(createAccountResponse.ok()).toBeTruthy();
        const accountData = await createAccountResponse.json();
        const accountId = accountData.id;

        // Request loan with invalid amount
        const loanRequest: LoanRequest = {
            customerId,
            amount: '-10000.00',
            downPayment: '2000.00',
            fromAccountId: accountId
        };

        const loanResponse = await loanApi.requestLoan(loanRequest);
        expect(loanResponse.ok()).toBeFalsy();
    });
}); 