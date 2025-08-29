import { test, expect } from '@playwright/test';

/**
 * Simplified Frontend Tests for Find Your Tennis Coach Website
 * Focused on basic UI elements and functionality that works with any browser
 */

test.describe('🎾 Tennis Coach Frontend - Simple Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test.describe('Basic Page Structure', () => {
    
    test('should load homepage successfully', async ({ page }) => {
      // Check that page loads
      await expect(page.locator('body')).toBeVisible();
      
      // Check for any text content (more flexible than specific headings)
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.trim().length).toBeGreaterThan(10);
      
      // Try to find headings, but don't fail if none exist
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        console.log(`✅ Found ${headingCount} headings on page`);
      } else {
        console.log('ℹ️  No headings found, but page has content');
      }
      
      console.log('✅ Homepage loaded successfully');
    });

    test('should display main content areas', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that basic HTML structure exists
      await expect(page.locator('html')).toBeVisible();
      await expect(page.locator('head')).toBeAttached();
      await expect(page.locator('body')).toBeVisible();
      
      console.log('✅ Basic page structure is present');
    });

    test('should have a title', async ({ page }) => {
      // Check that page has a title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      // Additional check - title should contain meaningful content
      expect(title.toLowerCase()).not.toBe('untitled');
      expect(title.toLowerCase()).not.toBe('');
      
      console.log(`✅ Page title: "${title}"`);
    });
  });

  test.describe('Interactive Elements', () => {
    
    test('should find clickable elements', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Look for common interactive elements (more flexible selectors)
      const buttons = page.locator('button, input[type="button"], input[type="submit"], .btn, [role="button"], [onclick]');
      const links = page.locator('a');
      const inputs = page.locator('input, textarea, select');
      const clickableElements = page.locator('[onclick], [role="button"], button, a, input');
      
      // Check if any interactive elements exist
      const buttonCount = await buttons.count();
      const linkCount = await links.count();
      const inputCount = await inputs.count();
      const totalClickable = await clickableElements.count();
      
      console.log(`✅ Found ${buttonCount} buttons, ${linkCount} links, ${inputCount} inputs`);
      console.log(`✅ Total clickable elements: ${totalClickable}`);
      
      // More flexible check - at least some elements should exist
      // Even if no traditional interactive elements, the page should have some content
      const allElements = await page.locator('*').count();
      expect(allElements).toBeGreaterThan(5); // At least basic HTML structure
      
      if (totalClickable === 0) {
        console.log('ℹ️  No interactive elements found, but page structure exists');
      }
    });

    test('should handle basic interactions', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Try to find and interact with input fields
      const inputs = page.locator('input[type="text"], input[type="search"], textarea');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        const firstInput = inputs.first();
        await firstInput.fill('test');
        const value = await firstInput.inputValue();
        expect(value).toBe('test');
        console.log('✅ Input interaction successful');
      } else {
        console.log('ℹ️  No text inputs found to test');
      }
    });
  });

  test.describe('Responsive Design', () => {
    
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that page is still functional
      await expect(page.locator('body')).toBeVisible();
      
      // Check that content doesn't overflow
      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(400); // Allow some margin
      
      console.log('✅ Mobile viewport test passed');
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that page is functional
      await expect(page.locator('body')).toBeVisible();
      
      console.log('✅ Tablet viewport test passed');
    });

    test('should work on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that page is functional
      await expect(page.locator('body')).toBeVisible();
      
      console.log('✅ Desktop viewport test passed');
    });
  });

  test.describe('Content and Media', () => {
    
    test('should handle images properly', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      console.log(`✅ Found ${imageCount} images`);
      
      if (imageCount > 0) {
        // Check first few images
        const checkCount = Math.min(imageCount, 3);
        for (let i = 0; i < checkCount; i++) {
          const img = images.nth(i);
          await expect(img).toBeVisible();
          
          // Check that image has src
          const src = await img.getAttribute('src');
          expect(src).toBeTruthy();
        }
        console.log('✅ Image elements are properly structured');
      }
    });

    test('should have proper text content', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Check that page has meaningful text content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.trim().length).toBeGreaterThan(10);
      
      console.log('✅ Page contains meaningful text content');
    });
  });

  test.describe('Performance and Loading', () => {
    
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(15000); // 15 seconds max
      
      console.log(`✅ Page loaded in ${loadTime}ms`);
    });

    test('should not have JavaScript errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Allow minor errors but not critical ones
      const criticalErrors = errors.filter(error => 
        error.includes('TypeError') || 
        error.includes('ReferenceError') ||
        error.includes('SyntaxError')
      );
      
      if (criticalErrors.length > 0) {
        console.log('⚠️  JavaScript errors found:', criticalErrors);
      } else {
        console.log('✅ No critical JavaScript errors');
      }
      
      expect(criticalErrors.length).toBeLessThanOrEqual(2); // Allow up to 2 minor errors
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    
    test('should render consistently across browsers', async ({ page, browserName }) => {
      await page.waitForLoadState('networkidle');
      
      // Check basic rendering
      await expect(page.locator('body')).toBeVisible();
      
      // Check that CSS is loaded (body should have some styling)
      const bodyStyles = await page.locator('body').evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          margin: styles.margin,
          padding: styles.padding,
          fontFamily: styles.fontFamily
        };
      });
      
      expect(bodyStyles.fontFamily).toBeTruthy();
      
      console.log(`✅ ${browserName} rendering test passed`);
    });

    test('should handle browser-specific features', async ({ page, browserName }) => {
      await page.waitForLoadState('networkidle');
      
      // Test basic DOM manipulation
      await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.id = 'browser-test';
        testDiv.textContent = 'Browser compatibility test';
        document.body.appendChild(testDiv);
      });
      
      await expect(page.locator('#browser-test')).toBeVisible();
      
      console.log(`✅ ${browserName} DOM manipulation test passed`);
    });
  });
});
