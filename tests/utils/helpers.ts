import { Page } from '@playwright/test';

export async function createTestUser(page: Page): Promise<{ username: string; password: string }> {
    const username = 'anand_test_user';
    const password = 'password123';

    // Navigate to registration page
    await page.goto('/parabank/register.htm');
    
    // Fill registration form
    await page.fill('input[name="customer.firstName"]', 'Anand');
    await page.fill('input[name="customer.lastName"]', 'Bhagwat');
    await page.fill('input[name="customer.address.street"]', 'Kharadi');
    await page.fill('input[name="customer.address.city"]', 'Pune');
    await page.fill('input[name="customer.address.state"]', 'Maharashtra');
    await page.fill('input[name="customer.address.zipCode"]', '411014');
    await page.fill('input[name="customer.phoneNumber"]', '9876543210');
    await page.fill('input[name="customer.ssn"]', '123-45-6789');
    await page.fill('input[name="customer.username"]', username);
    await page.fill('input[name="customer.password"]', password);
    await page.fill('input[name="repeatedPassword"]', password);
    
    // Submit registration
    await page.click('input[value="Register"]');
    
    // Wait for either success or error message
    await page.waitForSelector('p.welcome, span.error', { timeout: 10000 });
    
    // Check if registration was successful
    const errorVisible = await page.isVisible('span.error');
    if (errorVisible) {
        // If user already exists, try to login
        await page.goto('/parabank/login.htm');
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="password"]', password);
        await page.click('input[value="Log In"]');
        await page.waitForSelector('a[href*="logout"]', { timeout: 5000 });
    }
    
    return { username, password };
}

export async function generateUniqueUsername(page: Page): Promise<string> {
    let username: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
        username = generateRandomUsername();
        console.log(`Attempt ${attempts + 1}: Trying username: ${username}`);
        
        try {
            // Navigate to registration page
            await page.goto('/parabank/register.htm');
            
            // Fill all registration details first
            await page.fill('input[name="customer.firstName"]', 'Anand');
            await page.fill('input[name="customer.lastName"]', 'Bhagwat');
            await page.fill('input[name="customer.address.street"]', 'Kharadi');
            await page.fill('input[name="customer.address.city"]', 'Pune');
            await page.fill('input[name="customer.address.state"]', 'Maharashtra');
            await page.fill('input[name="customer.address.zipCode"]', '411014');
            await page.fill('input[name="customer.phoneNumber"]', '9876543210');
            await page.fill('input[name="customer.ssn"]', '123-45-6789');
            await page.fill('input[name="customer.username"]', username);
            await page.fill('input[name="customer.password"]', 'password123');
            await page.fill('input[name="repeatedPassword"]', 'password123');
            
            // Submit registration
            await page.click('input[value="Register"]');
            
            // Wait for either success or error message
            await page.waitForSelector('p.welcome, span.error', { timeout: 10000 });
            
            // Check for welcome message first
            const welcomeVisible = await page.isVisible('p.welcome');
            if (welcomeVisible) {
                console.log(`Successfully registered with username: ${username}`);
                isUnique = true;
                return username;
            }
            
            // If welcome message not found, check for error message
            const errorVisible = await page.isVisible('span.error');
            if (errorVisible) {
                const errorText = await page.textContent('span.error');
                console.log(`Registration error: ${errorText}`);
                
                // If it's not a username exists error, throw it
                if (!errorText?.includes('username already exists')) {
                    throw new Error(`Registration failed: ${errorText}`);
                }
            }
            
            attempts++;
            // Add a longer delay between attempts
            await page.waitForTimeout(2000);
            
        } catch (error) {
            console.error('Error during registration attempt:', error);
            attempts++;
            await page.waitForTimeout(2000);
        }
    }
    
    throw new Error('Could not generate a unique username after multiple attempts');
}

function generateRandomUsername(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    const randomString = Math.random().toString(36).substring(2, 10);
    return `anand_${timestamp}_${random}_${randomString}`;
}

export function generateRandomAmount(): number {
    return Math.floor(Math.random() * 1000) + 1;
} 