import * as fs from 'fs';
import * as path from 'path';

export interface UserData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
}

export interface PayeeData {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    accountNumber: string;
}

export class TestData {
    private static readonly DATA_DIR = path.join(__dirname, '../data');
    private static readonly USERS_FILE = path.join(TestData.DATA_DIR, 'users.json');
    private static readonly PAYEES_FILE = path.join(TestData.DATA_DIR, 'payees.json');

    private static readJsonFile<T>(filePath: string): T {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
    }

    static getDefaultUser(): UserData {
        const data = this.readJsonFile<{ defaultUser: UserData }>(this.USERS_FILE);
        return data.defaultUser;
    }

    static getTestUsers(): UserData[] {
        const data = this.readJsonFile<{ testUsers: UserData[] }>(this.USERS_FILE);
        return data.testUsers;
    }

    static getDefaultPayee(): PayeeData {
        const data = this.readJsonFile<{ defaultPayee: PayeeData }>(this.PAYEES_FILE);
        return data.defaultPayee;
    }

    static getTestPayees(): PayeeData[] {
        const data = this.readJsonFile<{ testPayees: PayeeData[] }>(this.PAYEES_FILE);
        return data.testPayees;
    }

    static getRandomAmount(min: number = 1, max: number = 1000): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): string {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    }

    static getRandomPhone(): string {
        return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    }

    static getRandomSSN(): string {
        const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const part2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const part3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${part1}-${part2}-${part3}`;
    }

    static getRandomZipCode(): string {
        return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    }
} 