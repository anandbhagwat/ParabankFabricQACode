import { Page } from '@playwright/test';

export class ProfilePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private locators = {
        firstName: 'input[name="customer.firstName"]',
        lastName: 'input[name="customer.lastName"]',
        address: 'input[name="customer.address.street"]',
        city: 'input[name="customer.address.city"]',
        state: 'input[name="customer.address.state"]',
        zipCode: 'input[name="customer.address.zipCode"]',
        phone: 'input[name="customer.phoneNumber"]',
        updateButton: 'input[value="Update Profile"]',
        updateTitle: 'h1.title',
        successMessage: 'p.ng-scope'
    };

    // Navigate to profile update page
    async navigate() {
        await this.page.goto('/parabank/updateprofile.htm');
    }

    // Fill profile update form
    async fillProfileForm(profileInfo: {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        phone?: string;
    }) {
        if (profileInfo.firstName) {
            await this.page.fill(this.locators.firstName, profileInfo.firstName);
        }
        if (profileInfo.lastName) {
            await this.page.fill(this.locators.lastName, profileInfo.lastName);
        }
        if (profileInfo.address) {
            await this.page.fill(this.locators.address, profileInfo.address);
        }
        if (profileInfo.city) {
            await this.page.fill(this.locators.city, profileInfo.city);
        }
        if (profileInfo.state) {
            await this.page.fill(this.locators.state, profileInfo.state);
        }
        if (profileInfo.zipCode) {
            await this.page.fill(this.locators.zipCode, profileInfo.zipCode);
        }
        if (profileInfo.phone) {
            await this.page.fill(this.locators.phone, profileInfo.phone);
        }
    }

    // Submit profile update
    async submitUpdate() {
        await this.page.click(this.locators.updateButton);
    }

    // Verify update success
    async isUpdateSuccessful(): Promise<boolean> {
        return await this.page.isVisible(this.locators.updateTitle);
    }

    // Get success message
    async getSuccessMessage(): Promise<string> {
        return await this.page.textContent(this.locators.successMessage) || '';
    }

    // Get current profile information
    async getCurrentProfile(): Promise<{
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    }> {
        return {
            firstName: await this.page.inputValue(this.locators.firstName),
            lastName: await this.page.inputValue(this.locators.lastName),
            address: await this.page.inputValue(this.locators.address),
            city: await this.page.inputValue(this.locators.city),
            state: await this.page.inputValue(this.locators.state),
            zipCode: await this.page.inputValue(this.locators.zipCode),
            phone: await this.page.inputValue(this.locators.phone)
        };
    }

    // Complete profile update process
    async updateProfile(profileInfo: {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        phone?: string;
    }): Promise<{
        success: boolean;
        message?: string;
        currentProfile?: {
            firstName: string;
            lastName: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            phone: string;
        };
    }> {
        await this.navigate();
        await this.fillProfileForm(profileInfo);
        await this.submitUpdate();
        
        const success = await this.isUpdateSuccessful();
        if (success) {
            return {
                success,
                message: await this.getSuccessMessage(),
                currentProfile: await this.getCurrentProfile()
            };
        }
        
        return { success: false };
    }
} 