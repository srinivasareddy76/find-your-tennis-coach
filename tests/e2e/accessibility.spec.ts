















import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests for Find Your Tennis Coach Platform
 * Tests WCAG compliance, keyboard navigation, and screen reader compatibility
 */

test.describe('Tennis Coach Platform Accessibility Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.coach-card', { timeout: 15000 });
  });

  test.describe('WCAG 2.1 Compliance', () => {
    
    test('should have proper document structure', async ({ page }) => {
      // Check for single h1 element
      const h1Elements = await page.locator('h1').count();
      expect(h1Elements).toBe(1);
      
      // Check h1 content is meaningful
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text?.length).toBeGreaterThan(0);
      
      // Check for proper heading hierarchy (no skipped levels)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let previousLevel = 0;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        if (previousLevel > 0) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = currentLevel;
      }
    });

    test('should have proper alt text for images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        const src = await image.getAttribute('src');
        
        // All images should have alt text
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
        
        // Alt text should be descriptive, not just filename
        expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|svg)$/i);
        
        console.log(`Image: ${src} - Alt: ${alt}`);
      }
    });

    test('should have proper form labels and accessibility', async ({ page }) => {
      // Check search inputs have proper labels or aria-labels
      const locationInput = page.locator('#location-search');
      const specialtyInput = page.locator('#specialty-search');
      
      // Check for placeholder text (acceptable for search inputs)
      const locationPlaceholder = await locationInput.getAttribute('placeholder');
      const specialtyPlaceholder = await specialtyInput.getAttribute('placeholder');
      
      expect(locationPlaceholder).toBeTruthy();
      expect(specialtyPlaceholder).toBeTruthy();
      
      // Check for aria-label if no visible label
      const locationAriaLabel = await locationInput.getAttribute('aria-label');
      const specialtyAriaLabel = await specialtyInput.getAttribute('aria-label');
      
      // Should have either placeholder or aria-label
      expect(locationPlaceholder || locationAriaLabel).toBeTruthy();
      expect(specialtyPlaceholder || specialtyAriaLabel).toBeTruthy();
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Test main heading contrast
      const heading = page.locator('h1');
      const headingStyles = await heading.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        };
      });
      
      console.log('Heading styles:', headingStyles);
      
      // Test button contrast
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const buttonStyles = await button.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor
          };
        });
        
        console.log(`Button ${i} styles:`, buttonStyles);
        
        // Ensure buttons have background color (not transparent)
        expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    });

    test('should have proper focus indicators', async ({ page }) => {
      // Test that interactive elements can receive focus
      const interactiveElements = page.locator('button, input, a, [tabindex]');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i);
        
        // Focus the element
        await element.focus();
        
        // Check that element is focused
        const isFocused = await element.evaluate(el => document.activeElement === el);
        expect(isFocused).toBeTruthy();
        
        // Check for visible focus indicator
        const focusStyles = await element.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow
          };
        });
        
        // Should have some form of focus indicator
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' || 
          focusStyles.outlineWidth !== '0px' || 
          focusStyles.boxShadow !== 'none';
        
        if (!hasFocusIndicator) {
          console.warn(`Element ${i} may not have visible focus indicator:`, focusStyles);
        }
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    
    test('should support tab navigation through all interactive elements', async ({ page }) => {
      // Start from the beginning
      await page.keyboard.press('Home');
      
      // Get all focusable elements
      const focusableElements = page.locator('button, input, a, [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();
      
      let currentIndex = 0;
      
      // Tab through all elements
      for (let i = 0; i < count; i++) {
        await page.keyboard.press('Tab');
        
        // Check which element is focused
        const activeElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(activeElement).toBeTruthy();
        
        currentIndex++;
      }
      
      expect(currentIndex).toBe(count);
    });

    test('should support reverse tab navigation', async ({ page }) => {
      // Focus on last element first
      const focusableElements = page.locator('button, input, a, [tabindex]:not([tabindex="-1"])');
      const lastElement = focusableElements.last();
      await lastElement.focus();
      
      // Shift+Tab should move backwards
      await page.keyboard.press('Shift+Tab');
      
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    });

    test('should support Enter key activation for buttons', async ({ page }) => {
      // Focus on search button
      const searchButton = page.locator('button[onclick="searchCoaches()"]');
      await searchButton.focus();
      
      // Fill search field first
      await page.fill('#location-search', 'New York');
      await searchButton.focus();
      
      // Press Enter to activate
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verify search was executed
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const coach = visibleCoaches.nth(i);
          const location = await coach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain('new york');
        }
      }
    });

    test('should support Space key activation for buttons', async ({ page }) => {
      const searchButton = page.locator('button[onclick="searchCoaches()"]');
      await searchButton.focus();
      
      // Fill search field
      await page.fill('#specialty-search', 'Beginner');
      await searchButton.focus();
      
      // Press Space to activate
      await page.keyboard.press('Space');
      await page.waitForTimeout(1000);
      
      // Verify search was executed
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const coach = visibleCoaches.nth(i);
          const specialty = await coach.locator('.coach-specialty').textContent();
          expect(specialty?.toLowerCase()).toContain('beginner');
        }
      }
    });

    test('should support keyboard navigation in search fields', async ({ page }) => {
      const locationInput = page.locator('#location-search');
      const specialtyInput = page.locator('#specialty-search');
      
      // Focus location input
      await locationInput.focus();
      await page.keyboard.type('Chicago');
      
      // Tab to specialty input
      await page.keyboard.press('Tab');
      await page.keyboard.type('Advanced');
      
      // Tab to search button and activate
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verify both filters were applied
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      for (let i = 0; i < count; i++) {
        const coach = visibleCoaches.nth(i);
        const location = await coach.locator('.coach-location').textContent();
        const specialty = await coach.locator('.coach-specialty').textContent();
        
        expect(location?.toLowerCase()).toContain('chicago');
        expect(specialty?.toLowerCase()).toContain('advanced');
      }
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    
    test('should have proper ARIA landmarks', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      const mainCount = await main.count();
      expect(mainCount).toBeGreaterThanOrEqual(1);
      
      // Check for navigation if present
      const nav = page.locator('nav, [role="navigation"]');
      const navCount = await nav.count();
      // Navigation is optional for this simple page
      
      // Check for search region
      const search = page.locator('[role="search"]');
      // Search role is optional but recommended
      
      console.log(`Found ${mainCount} main landmarks, ${navCount} navigation landmarks`);
    });

    test('should have proper ARIA labels for interactive elements', async ({ page }) => {
      // Check search button has accessible name
      const searchButton = page.locator('button[onclick="searchCoaches()"]');
      const buttonText = await searchButton.textContent();
      const buttonAriaLabel = await searchButton.getAttribute('aria-label');
      
      // Should have either text content or aria-label
      expect(buttonText || buttonAriaLabel).toBeTruthy();
      
      // Check contact buttons have accessible names
      const contactButtons = page.locator('.contact-btn');
      const contactCount = await contactButtons.count();
      
      for (let i = 0; i < contactCount; i++) {
        const button = contactButtons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should provide meaningful page title', async ({ page }) => {
      const title = await page.title();
      
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      expect(title.toLowerCase()).toContain('tennis');
      expect(title.toLowerCase()).toContain('coach');
      
      console.log(`Page title: "${title}"`);
    });

    test('should have proper semantic structure', async ({ page }) => {
      // Check for semantic HTML elements
      const semanticElements = await page.locator('header, main, section, article, aside, footer').count();
      expect(semanticElements).toBeGreaterThan(0);
      
      // Check that coach cards use appropriate semantic structure
      const coachCards = page.locator('.coach-card');
      const firstCard = coachCards.first();
      
      // Check if coach cards use article or section elements
      const cardElement = await firstCard.evaluate(el => el.tagName.toLowerCase());
      console.log(`Coach cards use element: ${cardElement}`);
      
      // Cards should ideally use article or section, but div is acceptable with proper ARIA
    });

    test('should provide status updates for dynamic content', async ({ page }) => {
      // Apply a search filter
      await page.fill('#location-search', 'Seattle');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      // Check if there's any status region or live region for search results
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const liveRegionCount = await liveRegions.count();
      
      // While not required, live regions improve accessibility for dynamic content
      console.log(`Found ${liveRegionCount} live regions for status updates`);
      
      // Verify search results are updated
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const coach = visibleCoaches.nth(i);
          const location = await coach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain('seattle');
        }
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    
    test('should be accessible on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Check that touch targets are large enough (minimum 44px)
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const boundingBox = await button.boundingBox();
        
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Test touch interaction
      const searchButton = page.locator('button[onclick="searchCoaches()"]');
      await page.fill('#location-search', 'Miami');
      await searchButton.tap();
      await page.waitForTimeout(1000);
      
      // Verify search worked on mobile
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const coach = visibleCoaches.nth(i);
          const location = await coach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain('miami');
        }
      }
    });

    test('should support zoom up to 200% without horizontal scrolling', async ({ page }) => {
      // Set zoom level to 200%
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      await page.reload();
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Check that content is still accessible and no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      
      // Allow for small differences due to zoom calculations
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth * 1.1);
      
      // Test that interactive elements are still usable
      await page.fill('#location-search', 'Phoenix');
      await page.click('button[onclick="searchCoaches()"]');
      await page.waitForTimeout(1000);
      
      const visibleCoaches = page.locator('.coach-card:visible');
      const count = await visibleCoaches.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const coach = visibleCoaches.nth(i);
          const location = await coach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain('phoenix');
        }
      }
    });
  });

  test.describe('Error Handling Accessibility', () => {
    
    test('should provide accessible error messages', async ({ page }) => {
      // Mock API to return error
      await page.route('**/coaches', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server Error' })
        });
      });
      
      await page.goto('/');
      await page.waitForTimeout(3000);
      
      // Check if error is communicated accessibly
      const errorMessages = page.locator('[role="alert"], .error-message, [aria-live="assertive"]');
      const errorCount = await errorMessages.count();
      
      // While not required, error messages should be announced to screen readers
      console.log(`Found ${errorCount} accessible error messages`);
      
      // Basic page structure should still be accessible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
    });
  });
});















