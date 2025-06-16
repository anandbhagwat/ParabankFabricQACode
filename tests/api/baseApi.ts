import { test, APIRequestContext, request } from '@playwright/test';

export class BaseApi {
    protected request!: APIRequestContext;
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async init() {
        this.request = await request.newContext({
            baseURL: this.baseUrl,
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    async cleanup() {
        await this.request.dispose();
    }

    protected async get(endpoint: string) {
        return await this.request.get(endpoint);
    }

    protected async post(endpoint: string, data: any) {
        return await this.request.post(endpoint, {
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    protected async put(endpoint: string, data: any) {
        return await this.request.put(endpoint, {
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    protected async delete(endpoint: string) {
        return await this.request.delete(endpoint);
    }
} 