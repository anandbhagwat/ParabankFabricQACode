import { Page } from '@playwright/test';

export async function generateUniqueUsername(page: Page): Promise<string> {
    let username: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
        username = generateRandomUsername();
        console.log(`Attempt ${attempts + 1}: Trying username: ${username}`);
        
        // Check if username exists
        await page.goto('/parabank/register.htm');
        await page.fill('input[name="customer.username"]', username);
        await page.click('input[value="Register"]');
        
        // Wait for either success or error message
        await page.waitForSelector('p.welcome, span.error', { timeout: 5000 });
        
        // Check for error message
        const errorVisible = await page.isVisible('span.error');
        if (!errorVisible) {
            console.log(`Successfully generated unique username: ${username}`);
            isUnique = true;
            return username;
        }
        
        // Get the error message
        const errorText = await page.textContent('span.error');
        console.log(`Username ${username} is not unique: ${errorText}`);
        
        attempts++;
        // Add a small delay between attempts
        await page.waitForTimeout(1000);
    }
    
    throw new Error('Could not generate a unique username after multiple attempts');
}

function generateRandomUsername(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 100000);
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${timestamp}_${random}_${randomString}`;
}

export function generateRandomAmount(): number {
    return Math.floor(Math.random() * 1000) + 1;
} 