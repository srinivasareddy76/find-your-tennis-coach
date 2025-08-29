












import { test, expect } from '@playwright/test';
import axios from 'axios';

/**
 * End-to-End Integration Tests for Find Your Tennis Coach Platform
 * Tests complete user workflows and frontend-backend integration
 */

test.describe('Tennis Coach Platform Integration Tests', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  test.describe('Complete User Workflows', () => {
    
    test('should complete full coach discovery workflow', async ({ page }) => {
      // Step 1: Navigate to homepage
      await page.goto('/');
      await expect(page).toHaveTitle(/Find Your Tennis Coach/i);
      
      // Step 2: Wait for coaches to load from API
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Step 3: Verify coaches are displayed
      const coachCards = page.locator('.coach-card');
      const initialCount = await coachCards.count();
      expect(initialCount).toBeGreaterThan(0);
      
      // Step 4: Search for coaches in a specific location
      await page.fill('#location-search', 'New York');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Step 5: Verify search results
      const filteredCoaches = page.locator('.coach-card:visible');
      const filteredCount = await filteredCoaches.count();
      
      if (filteredCount > 0) {
        // Step 6: Select a coach and view details
        const selectedCoach = filteredCoaches.first();
        const coachName = await selectedCoach.locator('.coach-name').textContent();
        const coachLocation = await selectedCoach.locator('.coach-location').textContent();
        
        expect(coachName).toBeTruthy();
        expect(coachLocation?.toLowerCase()).toContain('new york');
        
        // Step 7: Attempt to contact the coach
        const contactBtn = selectedCoach.locator('.contact-btn');
        await expect(contactBtn).toBeVisible();
        
        // Handle the contact dialog
        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain('contact');
          await dialog.accept();
        });
        
        await contactBtn.click();
      }
      
      // Step 8: Clear search and verify all coaches return
      await page.fill('#location-search', '');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      const finalCount = await page.locator('.coach-card').count();
      expect(finalCount).toBe(initialCount);
    });

    test('should handle coach search with multiple filters', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Apply both location and specialty filters
      await page.fill('#location-search', 'Los Angeles');
      await page.fill('#specialty-search', 'Advanced');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Verify that results match both criteria
      const filteredCoaches = page.locator('.coach-card:visible');
      const count = await filteredCoaches.count();
      
      for (let i = 0; i < count; i++) {
        const coach = filteredCoaches.nth(i);
        const location = await coach.locator('.coach-location').textContent();
        const specialty = await coach.locator('.coach-specialty').textContent();
        
        expect(location?.toLowerCase()).toContain('los angeles');
        expect(specialty?.toLowerCase()).toContain('advanced');
      }
    });

    test('should maintain state during page interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Apply a search filter
      await page.fill('#location-search', 'Chicago');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Scroll down and back up
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      
      // Verify search filter is still applied
      const searchValue = await page.locator('#location-search').inputValue();
      expect(searchValue).toBe('Chicago');
      
      // Verify filtered results are still shown
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      for (let i = 0; i < count; i++) {
        const coach = visibleCoaches.nth(i);
        const location = await coach.locator('.coach-location').textContent();
        expect(location?.toLowerCase()).toContain('chicago');
      }
    });
  });

  test.describe('Frontend-Backend Data Consistency', () => {
    
    test('should display same coach data in UI as API returns', async ({ page }) => {
      // Get coaches from API
      const apiResponse = await axios.get(`${baseURL}/coaches`);
      expect(apiResponse.status).toBe(200);
      const apiCoaches = apiResponse.data;
      
      // Navigate to frontend
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Get coaches from UI
      const uiCoaches = await page.locator('.coach-card').all();
      
      // Compare counts
      expect(uiCoaches.length).toBe(apiCoaches.length);
      
      // Compare individual coach data
      for (let i = 0; i < Math.min(uiCoaches.length, apiCoaches.length); i++) {
        const uiCoach = uiCoaches[i];
        const apiCoach = apiCoaches[i];
        
        const uiName = await uiCoach.locator('.coach-name').textContent();
        const uiLocation = await uiCoach.locator('.coach-location').textContent();
        const uiSpecialty = await uiCoach.locator('.coach-specialty').textContent();
        
        expect(uiName?.trim()).toBe(apiCoach.name);
        expect(uiLocation?.trim()).toBe(apiCoach.location);
        expect(uiSpecialty?.trim()).toBe(apiCoach.specialty);
      }
    });

    test('should handle API errors gracefully in UI', async ({ page }) => {
      // Mock API to return error
      await page.route('**/coaches', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.goto('/');
      
      // Check that basic page structure still loads
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
      
      // The coaches section should handle the error gracefully
      // (This depends on how the frontend is implemented)
      await page.waitForTimeout(3000);
      
      // Check that no coaches are displayed or error message is shown
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBe(0);
    });

    test('should handle slow API responses', async ({ page }) => {
      // Mock API with delay
      await page.route('**/coaches', async route => {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
        const response = await route.fetch();
        route.fulfill({ response });
      });
      
      await page.goto('/');
      
      // Check that page loads basic structure immediately
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
      
      // Wait for coaches to eventually load
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBeGreaterThan(0);
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Basic functionality should work in all browsers
      await expect(page.locator('h1')).toBeVisible();
      
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBeGreaterThan(0);
      
      // Test search functionality
      await page.fill('#location-search', 'Miami');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Verify search works in all browsers
      const filteredCoaches = page.locator('.coach-card:visible');
      const filteredCount = await filteredCoaches.count();
      
      if (filteredCount > 0) {
        for (let i = 0; i < filteredCount; i++) {
          const coach = filteredCoaches.nth(i);
          const location = await coach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain('miami');
        }
      }
      
      console.log(`✅ Test passed in ${browserName}`);
    });
  });

  test.describe('Performance Integration', () => {
    
    test('should load and render coaches within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      
      // Wait for initial page load
      await page.waitForLoadState('networkidle');
      const pageLoadTime = Date.now() - startTime;
      
      // Wait for coaches to load
      const coachLoadStart = Date.now();
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      const coachLoadTime = Date.now() - coachLoadStart;
      
      // Performance assertions
      expect(pageLoadTime).toBeLessThan(5000); // Page should load within 5 seconds
      expect(coachLoadTime).toBeLessThan(10000); // Coaches should load within 10 seconds
      
      // Check that all coaches are rendered
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBeGreaterThan(0);
      
      console.log(`Page load time: ${pageLoadTime}ms`);
      console.log(`Coach load time: ${coachLoadTime}ms`);
      console.log(`Total coaches rendered: ${coachCount}`);
    });

    test('should handle multiple concurrent users', async ({ browser }) => {
      // Simulate multiple users accessing the site simultaneously
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext()
      ]);
      
      const pages = await Promise.all(
        contexts.map(context => context.newPage())
      );
      
      // All users navigate to the site simultaneously
      const startTime = Date.now();
      await Promise.all(
        pages.map(page => page.goto('/'))
      );
      
      // Wait for all pages to load coaches
      await Promise.all(
        pages.map(page => page.waitForSelector('.coach-card', { timeout: 15000 }))
      );
      
      const totalTime = Date.now() - startTime;
      
      // Verify all pages loaded successfully
      for (const page of pages) {
        const coachCount = await page.locator('.coach-card').count();
        expect(coachCount).toBeGreaterThan(0);
      }
      
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
      
      console.log(`Concurrent load time for 3 users: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(20000); // Should handle concurrent load within 20 seconds
    });
  });

  test.describe('Data Validation Integration', () => {
    
    test('should validate coach data integrity end-to-end', async ({ page }) => {
      // Get fresh data from API
      const apiResponse = await axios.get(`${baseURL}/coaches`);
      const coaches = apiResponse.data;
      
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Validate each coach's data integrity
      for (let i = 0; i < coaches.length; i++) {
        const coach = coaches[i];
        const uiCoach = page.locator('.coach-card').nth(i);
        
        // Check required fields are present and valid
        expect(coach.id).toBeTruthy();
        expect(coach.name).toBeTruthy();
        expect(coach.specialty).toBeTruthy();
        expect(coach.location).toBeTruthy();
        expect(typeof coach.rating).toBe('number');
        expect(coach.rating).toBeGreaterThanOrEqual(0);
        expect(coach.rating).toBeLessThanOrEqual(5);
        
        // Verify UI displays the data correctly
        const uiName = await uiCoach.locator('.coach-name').textContent();
        const uiLocation = await uiCoach.locator('.coach-location').textContent();
        const uiSpecialty = await uiCoach.locator('.coach-specialty').textContent();
        
        expect(uiName?.trim()).toBe(coach.name);
        expect(uiLocation?.trim()).toBe(coach.location);
        expect(uiSpecialty?.trim()).toBe(coach.specialty);
        
        // Verify rating display
        const ratingElement = uiCoach.locator('.coach-rating .stars');
        const ratingText = await ratingElement.textContent();
        const starCount = (ratingText?.match(/★/g) || []).length;
        expect(starCount).toBe(Math.floor(coach.rating));
      }
    });
  });
});












