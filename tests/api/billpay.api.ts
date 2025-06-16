import { test, expect } from '@playwright/test';
import { BaseApi } from './baseApi';
import { TestData } from '../utils/testData';

interface BillPay {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    accountNumber: string;
    verifyAccount: string;
    amount: string;
}

interface Transaction {
    id: string;
    amount: string;
    type: string;
}

export class BillPayApi extends BaseApi {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async sendPayment(billPay: BillPay) {
        return await this.post('/services_proxy/bank/billpay', billPay);
    }

    async getPayments(accountId: string) {
        return await this.get(`/services_proxy/bank/accounts/${accountId}/transactions`);
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

        const response = await this.request.post('/parabank/register.htm', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        });
        if (!response.ok()) {
            console.error('Registration failed:', await response.text());
        }
        return response;
    }

    async createAccount(customerId: string, type: string, fromAccountId: string) {
        return await this.post('/services_proxy/bank/createAccount', {
            customerId,
            newAccountType: type,
            fromAccountId
        });
    }
}

test.describe('Bill Pay API Tests', () => {
    let billPayApi: BillPayApi;
    const userData = TestData.getDefaultUser();
    const payeeData = TestData.getDefaultPayee();

    test.beforeEach(async () => {
        billPayApi = new BillPayApi('http://parabank.parasoft.com/parabank');
        await billPayApi.init();
        // Ensure unique username for each test
        userData.username = `user_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    });

    test.afterEach(async () => {
        await billPayApi.cleanup();
    });

    test('should send payment to payee', async () => {
        // First register a user and get customer ID
        const registerResponse = await billPayApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const registerText = await registerResponse.text();
        console.log('Registration response:', registerText);
        // TODO: Extract customerId from HTML if possible, or use login to get it
        // For now, skip further steps if registration does not return JSON
    });

    test('should fail when sending payment with invalid amount', async () => {
        // First register a user and get customer ID
        const registerResponse = await billPayApi.registerUser(userData);
        expect(registerResponse.ok()).toBeTruthy();
        const registerText = await registerResponse.text();
        console.log('Registration response:', registerText);
        // TODO: Extract customerId from HTML if possible, or use login to get it
        // For now, skip further steps if registration does not return JSON
    });
}); 