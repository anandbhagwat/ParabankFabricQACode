import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { generateUniqueUsername } from '../utils/helpers';

test.describe('User Registration', () => {
    test('should successfully register a new user', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        
        // Generate a unique username
        const username = await generateUniqueUsername(page);
        console.log('Generated unique username:', username);
        
        // Navigate to registration page
        await page.goto('/parabank/register.htm');
        
        // Fill registration form
        await registerPage.fillRegistrationForm({
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '1234567890',
            ssn: '123-45-6789',
            username: username,
            password: 'password123'
        });

        // Submit registration
        await registerPage.clickRegister();

        // Verify registration success
        const isSuccessful = await registerPage.isRegistrationSuccessful();
        expect(isSuccessful).toBeTruthy();

        // Get and verify welcome message
        const welcomeMessage = await registerPage.getWelcomeMessage();
        expect(welcomeMessage).toContain('Welcome');
        expect(welcomeMessage).toContain(username);
    });
}); 