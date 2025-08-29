import { test, expect } from '@playwright/test';

test.describe('🎾 Find Your Tennis Coach - Demo Tests', () => {
  const baseUrl = process.env.BASE_URL || 'https://jsonplaceholder.typicode.com';

  test('should connect to demo API', async ({ request }) => {
    console.log(`Testing connection to: ${baseUrl}`);
    
    const response = await request.get(`${baseUrl}/posts/1`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    
    console.log('✅ Demo API connection successful');
  });

  test('should simulate coach data retrieval', async ({ request }) => {
    // Simulate getting coaches data using users endpoint
    const response = await request.get(`${baseUrl}/users`);
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Simulate coach data structure
    const coach = users[0];
    expect(coach).toHaveProperty('name');
    expect(coach).toHaveProperty('email');
    
    console.log(`✅ Retrieved ${users.length} demo coaches`);
  });

  test('should test API performance', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${baseUrl}/posts`);
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(3000); // Less than 3 seconds
    
    console.log(`✅ API response time: ${responseTime}ms`);
  });

  test('should simulate search functionality', async ({ request }) => {
    // Simulate searching for coaches by location using posts
    const response = await request.get(`${baseUrl}/posts?userId=1`);
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    
    console.log(`✅ Search simulation returned ${posts.length} results`);
  });
});
