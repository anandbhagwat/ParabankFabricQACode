import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { createTestUser } from '../utils/helpers';

test.describe('Profile Update Tests', () => {
    test('should update contact information', async ({ page }) => {
        const homePage = new HomePage(page);
        
        // Create test user and login
        const { username, password } = await createTestUser(page);
        
        // Navigate to update profile
        await homePage.clickUpdateContactInfo();
        
        // Update contact information
        const newPhone = '9876543210';
        const newAddress = '456 New St';
        const newCity = 'New City';
        const newState = 'New State';
        const newZip = '54321';
        
        await page.fill('input[name="customer.phoneNumber"]', newPhone);
        await page.fill('input[name="customer.address.street"]', newAddress);
        await page.fill('input[name="customer.address.city"]', newCity);
        await page.fill('input[name="customer.address.state"]', newState);
        await page.fill('input[name="customer.address.zipCode"]', newZip);
        
        // Submit update
        await page.click('input[value="Update Profile"]');
        
        // Verify update success
        await expect(page.locator('h1.title')).toContainText('Profile Updated');
        
        // Verify updated information
        await expect(page.locator('input[name="customer.phoneNumber"]')).toHaveValue(newPhone);
        await expect(page.locator('input[name="customer.address.street"]')).toHaveValue(newAddress);
        await expect(page.locator('input[name="customer.address.city"]')).toHaveValue(newCity);
        await expect(page.locator('input[name="customer.address.state"]')).toHaveValue(newState);
        await expect(page.locator('input[name="customer.address.zipCode"]')).toHaveValue(newZip);
    });
}); 