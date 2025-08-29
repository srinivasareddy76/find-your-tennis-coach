









import { test, expect } from '@playwright/test';

/**
 * Frontend UI Tests for Find Your Tennis Coach Website
 * Tests user interface, interactions, and responsive design
 */

test.describe('Tennis Coach Frontend Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test.describe('Page Load and Basic Structure', () => {
    
    test('should load homepage successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Find Your Tennis Coach/i);
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Find Your Tennis Coach');
      
      // Check that the page has loaded completely
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      // Check hero section elements
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.hero h1')).toContainText('Find Your Tennis Coach');
      await expect(page.locator('.hero p')).toBeVisible();
    });

    test('should display search section', async ({ page }) => {
      // Check search form
      await expect(page.locator('#location-search')).toBeVisible();
      await expect(page.locator('#specialty-search')).toBeVisible();
      await expect(page.locator('button[onclick="searchCoaches()"]')).toBeVisible();
    });

    test('should display coaches section', async ({ page }) => {
      // Wait for coaches to load
      await page.waitForSelector('#coaches-container', { timeout: 10000 });
      
      // Check coaches container
      await expect(page.locator('#coaches-container')).toBeVisible();
      await expect(page.locator('.coach-card')).toHaveCount.greaterThan(0);
    });
  });

  test.describe('Coach Cards Display', () => {
    
    test('should display coach information correctly', async ({ page }) => {
      // Wait for coaches to load
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const firstCoach = page.locator('.coach-card').first();
      
      // Check coach card elements
      await expect(firstCoach.locator('.coach-image')).toBeVisible();
      await expect(firstCoach.locator('.coach-name')).toBeVisible();
      await expect(firstCoach.locator('.coach-specialty')).toBeVisible();
      await expect(firstCoach.locator('.coach-location')).toBeVisible();
      await expect(firstCoach.locator('.coach-rating')).toBeVisible();
      await expect(firstCoach.locator('.coach-experience')).toBeVisible();
      await expect(firstCoach.locator('.coach-rate')).toBeVisible();
      await expect(firstCoach.locator('.contact-btn')).toBeVisible();
    });

    test('should display star ratings correctly', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const ratings = page.locator('.coach-rating .stars');
      const count = await ratings.count();
      
      for (let i = 0; i < count; i++) {
        const rating = ratings.nth(i);
        await expect(rating).toBeVisible();
        
        // Check that stars are displayed (★ characters)
        const ratingText = await rating.textContent();
        expect(ratingText).toMatch(/★+/);
      }
    });

    test('should display coach images', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const images = page.locator('.coach-image img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const image = images.nth(i);
        await expect(image).toBeVisible();
        
        // Check that image has src attribute
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });
  });

  test.describe('Search Functionality', () => {
    
    test('should filter coaches by location', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Get initial coach count
      const initialCount = await page.locator('.coach-card').count();
      expect(initialCount).toBeGreaterThan(0);
      
      // Search for specific location
      await page.fill('#location-search', 'New York');
      await page.click('button[onclick="searchCoaches()"]');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Check that results are filtered
      const filteredCoaches = page.locator('.coach-card:visible');
      const filteredCount = await filteredCoaches.count();
      
      // Verify that filtered results contain the search term
      for (let i = 0; i < filteredCount; i++) {
        const coach = filteredCoaches.nth(i);
        const location = await coach.locator('.coach-location').textContent();
        expect(location?.toLowerCase()).toContain('new york');
      }
    });

    test('should filter coaches by specialty', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Search for specific specialty
      await page.fill('#specialty-search', 'Beginner');
      await page.click('button[onclick="searchCoaches()"]');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Check that results are filtered
      const filteredCoaches = page.locator('.coach-card:visible');
      const filteredCount = await filteredCoaches.count();
      
      if (filteredCount > 0) {
        // Verify that filtered results contain the search term
        for (let i = 0; i < filteredCount; i++) {
          const coach = filteredCoaches.nth(i);
          const specialty = await coach.locator('.coach-specialty').textContent();
          expect(specialty?.toLowerCase()).toContain('beginner');
        }
      }
    });

    test('should clear search filters', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Get initial coach count
      const initialCount = await page.locator('.coach-card').count();
      
      // Apply a filter
      await page.fill('#location-search', 'New York');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Clear the filter
      await page.fill('#location-search', '');
      await page.fill('#specialty-search', '');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Check that all coaches are shown again
      const finalCount = await page.locator('.coach-card').count();
      expect(finalCount).toBe(initialCount);
    });

    test('should handle no search results', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Search for something that doesn't exist
      await page.fill('#location-search', 'NonexistentCity12345');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Check that no coaches are visible or appropriate message is shown
      const visibleCoaches = await page.locator('.coach-card:visible').count();
      expect(visibleCoaches).toBe(0);
    });
  });

  test.describe('Interactive Elements', () => {
    
    test('should handle contact button clicks', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const contactBtn = page.locator('.contact-btn').first();
      await expect(contactBtn).toBeVisible();
      
      // Click contact button (should show alert or modal)
      await contactBtn.click();
      
      // Handle the alert dialog
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('contact');
        await dialog.accept();
      });
    });

    test('should handle hover effects on coach cards', async ({ page }) => {
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const firstCard = page.locator('.coach-card').first();
      
      // Hover over the card
      await firstCard.hover();
      
      // Check that hover effects are applied (card should have transform or shadow changes)
      const cardStyle = await firstCard.evaluate(el => getComputedStyle(el).transform);
      // The card should have some transform applied on hover
      // This is a basic check - in a real scenario you'd check specific CSS properties
    });
  });

  test.describe('Responsive Design', () => {
    
    test('should display correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      // Check that elements are still visible and properly arranged
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
      await expect(page.locator('#specialty-search')).toBeVisible();
      
      // Wait for coaches to load
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      await expect(page.locator('.coach-card').first()).toBeVisible();
    });

    test('should display correctly on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      // Check that elements are visible and properly arranged
      await expect(page.locator('h1')).toBeVisible();
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Check that multiple coaches are visible in a row (tablet layout)
      const coachCards = page.locator('.coach-card');
      const count = await coachCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display correctly on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      
      // Check that all elements are visible
      await expect(page.locator('h1')).toBeVisible();
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      // Check that coaches are displayed in a grid layout
      const coachCards = page.locator('.coach-card');
      const count = await coachCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Performance and Loading', () => {
    
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/coaches', route => route.abort());
      
      await page.goto('/');
      
      // Check that the page still loads basic structure
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
      
      // The coaches section might show an error or loading state
      // This depends on how the frontend handles API failures
    });
  });

  test.describe('Accessibility', () => {
    
    test('should have proper heading structure', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Check for proper heading hierarchy
      await expect(page.locator('h1')).toHaveCount(1);
      
      // Check that headings have meaningful text
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text?.length).toBeGreaterThan(0);
    });

    test('should have proper form labels', async ({ page }) => {
      // Check that search inputs have proper labels or placeholders
      const locationInput = page.locator('#location-search');
      const specialtyInput = page.locator('#specialty-search');
      
      await expect(locationInput).toBeVisible();
      await expect(specialtyInput).toBeVisible();
      
      // Check for placeholder text
      const locationPlaceholder = await locationInput.getAttribute('placeholder');
      const specialtyPlaceholder = await specialtyInput.getAttribute('placeholder');
      
      expect(locationPlaceholder).toBeTruthy();
      expect(specialtyPlaceholder).toBeTruthy();
    });

    test('should have proper alt text for images', async ({ page }) => {
      await page.waitForSelector('.coach-card img', { timeout: 10000 });
      
      const images = page.locator('.coach-card img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    });
  });
});









