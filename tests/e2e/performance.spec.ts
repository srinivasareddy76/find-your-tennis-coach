



















import { test, expect } from '@playwright/test';

/**
 * Performance Tests for Find Your Tennis Coach Platform
 * Tests loading times, resource usage, and performance metrics
 */

test.describe('Tennis Coach Platform Performance Tests', () => {

  test.describe('Page Load Performance', () => {
    
    test('should load initial page within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate to page and measure load time
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Performance assertions
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      
      console.log(`Initial page load time: ${loadTime}ms`);
    });

    test('should load coaches data within reasonable time', async ({ page }) => {
      await page.goto('/');
      
      const coachLoadStart = Date.now();
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      const coachLoadTime = Date.now() - coachLoadStart;
      
      // Coaches should load within 10 seconds
      expect(coachLoadTime).toBeLessThan(10000);
      
      // Verify coaches are actually loaded
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBeGreaterThan(0);
      
      console.log(`Coach data load time: ${coachLoadTime}ms`);
      console.log(`Coaches loaded: ${coachCount}`);
    });

    test('should have reasonable Time to First Contentful Paint', async ({ page }) => {
      // Use Performance API to measure TTFCP
      await page.goto('/');
      
      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              resolve(fcpEntry.startTime);
            }
          }).observe({ entryTypes: ['paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(null), 5000);
        });
      });
      
      if (performanceMetrics) {
        console.log(`First Contentful Paint: ${performanceMetrics}ms`);
        expect(performanceMetrics).toBeLessThan(3000); // Should be under 3 seconds
      }
    });

    test('should have reasonable Largest Contentful Paint', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const lcpMetric = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(null), 10000);
        });
      });
      
      if (lcpMetric) {
        console.log(`Largest Contentful Paint: ${lcpMetric}ms`);
        expect(lcpMetric).toBeLessThan(4000); // Should be under 4 seconds
      }
    });
  });

  test.describe('Resource Loading Performance', () => {
    
    test('should load images efficiently', async ({ page }) => {
      const imageLoadTimes: number[] = [];
      
      // Monitor image loading
      page.on('response', response => {
        if (response.url().includes('.svg') || response.url().includes('.png') || response.url().includes('.jpg')) {
          const timing = response.timing();
          if (timing) {
            imageLoadTimes.push(timing.responseEnd - timing.requestStart);
          }
        }
      });
      
      await page.goto('/');
      await page.waitForSelector('.coach-card img', { timeout: 15000 });
      
      // Wait a bit more for all images to load
      await page.waitForTimeout(2000);
      
      if (imageLoadTimes.length > 0) {
        const avgImageLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length;
        const maxImageLoadTime = Math.max(...imageLoadTimes);
        
        console.log(`Average image load time: ${avgImageLoadTime}ms`);
        console.log(`Max image load time: ${maxImageLoadTime}ms`);
        console.log(`Total images loaded: ${imageLoadTimes.length}`);
        
        // Images should load reasonably fast
        expect(avgImageLoadTime).toBeLessThan(2000);
        expect(maxImageLoadTime).toBeLessThan(5000);
      }
    });

    test('should minimize API response times', async ({ page }) => {
      const apiResponseTimes: number[] = [];
      
      // Monitor API calls
      page.on('response', response => {
        if (response.url().includes('/coaches')) {
          const timing = response.timing();
          if (timing) {
            apiResponseTimes.push(timing.responseEnd - timing.requestStart);
          }
        }
      });
      
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      if (apiResponseTimes.length > 0) {
        const avgApiTime = apiResponseTimes.reduce((a, b) => a + b, 0) / apiResponseTimes.length;
        const maxApiTime = Math.max(...apiResponseTimes);
        
        console.log(`Average API response time: ${avgApiTime}ms`);
        console.log(`Max API response time: ${maxApiTime}ms`);
        
        // API should respond quickly
        expect(avgApiTime).toBeLessThan(3000);
        expect(maxApiTime).toBeLessThan(5000);
      }
    });

    test('should have reasonable total page weight', async ({ page }) => {
      let totalBytes = 0;
      const resourceTypes: { [key: string]: number } = {};
      
      // Monitor all network requests
      page.on('response', async response => {
        try {
          const contentLength = response.headers()['content-length'];
          if (contentLength) {
            const bytes = parseInt(contentLength);
            totalBytes += bytes;
            
            const resourceType = response.request().resourceType();
            resourceTypes[resourceType] = (resourceTypes[resourceType] || 0) + bytes;
          }
        } catch (error) {
          // Ignore errors in response handling
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log(`Total page weight: ${(totalBytes / 1024).toFixed(2)} KB`);
      console.log('Resource breakdown:', resourceTypes);
      
      // Page should be under 2MB total
      expect(totalBytes).toBeLessThan(2 * 1024 * 1024);
    });
  });

  test.describe('Runtime Performance', () => {
    
    test('should handle search operations efficiently', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Measure search performance
      const searchStart = Date.now();
      
      await page.fill('#location-search', 'New York');
      await page.click('button[onclick="searchCoaches()"]');
      
      // Wait for search to complete
      await page.waitForTimeout(500);
      
      const searchTime = Date.now() - searchStart;
      
      console.log(`Search operation time: ${searchTime}ms`);
      
      // Search should be nearly instantaneous (client-side filtering)
      expect(searchTime).toBeLessThan(1000);
      
      // Verify search results
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

    test('should handle multiple rapid searches efficiently', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      const searchTerms = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'];
      const searchTimes: number[] = [];
      
      for (const term of searchTerms) {
        const start = Date.now();
        
        await page.fill('#location-search', term);
        await page.click('button[onclick="searchCoaches()"]');
        await page.waitForTimeout(100);
        
        const searchTime = Date.now() - start;
        searchTimes.push(searchTime);
      }
      
      const avgSearchTime = searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
      const maxSearchTime = Math.max(...searchTimes);
      
      console.log(`Average search time: ${avgSearchTime}ms`);
      console.log(`Max search time: ${maxSearchTime}ms`);
      
      // Multiple searches should remain fast
      expect(avgSearchTime).toBeLessThan(500);
      expect(maxSearchTime).toBeLessThan(1000);
    });

    test('should maintain performance with DOM manipulation', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Measure DOM query performance
      const domStart = Date.now();
      
      const coachCount = await page.locator('.coach-card').count();
      const visibleCount = await page.locator('.coach-card:visible').count();
      
      const domTime = Date.now() - domStart;
      
      console.log(`DOM query time for ${coachCount} coaches: ${domTime}ms`);
      
      // DOM queries should be fast
      expect(domTime).toBeLessThan(100);
      expect(coachCount).toBe(visibleCount); // All should be visible initially
    });
  });

  test.describe('Memory Performance', () => {
    
    test('should not have significant memory leaks during interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 15000 });
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return null;
      });
      
      // Perform multiple interactions
      const searchTerms = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', ''];
      
      for (let i = 0; i < 3; i++) { // Repeat 3 times
        for (const term of searchTerms) {
          await page.fill('#location-search', term);
          await page.click('button[onclick="searchCoaches()"]');
          await page.waitForTimeout(100);
        }
      }
      
      // Force garbage collection if possible
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc();
        }
      });
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return null;
      });
      
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
        
        console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Memory increase: ${memoryIncreasePercent.toFixed(2)}%`);
        
        // Memory increase should be reasonable (less than 50% increase)
        expect(memoryIncreasePercent).toBeLessThan(50);
      }
    });
  });

  test.describe('Concurrent User Performance', () => {
    
    test('should handle multiple simultaneous users', async ({ browser }) => {
      const userCount = 3;
      const contexts = await Promise.all(
        Array(userCount).fill(null).map(() => browser.newContext())
      );
      
      const pages = await Promise.all(
        contexts.map(context => context.newPage())
      );
      
      // All users navigate simultaneously
      const startTime = Date.now();
      
      await Promise.all(
        pages.map(page => page.goto('/'))
      );
      
      // Wait for all pages to load coaches
      await Promise.all(
        pages.map(page => page.waitForSelector('.coach-card', { timeout: 15000 }))
      );
      
      const totalLoadTime = Date.now() - startTime;
      
      // Verify all pages loaded successfully
      const coachCounts = await Promise.all(
        pages.map(page => page.locator('.coach-card').count())
      );
      
      coachCounts.forEach(count => {
        expect(count).toBeGreaterThan(0);
      });
      
      console.log(`Concurrent load time for ${userCount} users: ${totalLoadTime}ms`);
      console.log(`Coach counts: ${coachCounts.join(', ')}`);
      
      // Should handle concurrent users reasonably well
      expect(totalLoadTime).toBeLessThan(20000);
      
      // All users should see the same number of coaches
      const uniqueCounts = [...new Set(coachCounts)];
      expect(uniqueCounts.length).toBe(1);
      
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });

    test('should maintain performance under concurrent searches', async ({ browser }) => {
      const userCount = 3;
      const contexts = await Promise.all(
        Array(userCount).fill(null).map(() => browser.newContext())
      );
      
      const pages = await Promise.all(
        contexts.map(context => context.newPage())
      );
      
      // All users navigate and wait for load
      await Promise.all(
        pages.map(page => page.goto('/'))
      );
      
      await Promise.all(
        pages.map(page => page.waitForSelector('.coach-card', { timeout: 15000 }))
      );
      
      // All users perform searches simultaneously
      const searchTerms = ['New York', 'Los Angeles', 'Chicago'];
      const searchStart = Date.now();
      
      await Promise.all(
        pages.map((page, index) => {
          const term = searchTerms[index % searchTerms.length];
          return page.fill('#location-search', term)
            .then(() => page.click('button[onclick="searchCoaches()"]'));
        })
      );
      
      // Wait for all searches to complete
      await Promise.all(
        pages.map(page => page.waitForTimeout(1000))
      );
      
      const searchTime = Date.now() - searchStart;
      
      console.log(`Concurrent search time for ${userCount} users: ${searchTime}ms`);
      
      // Concurrent searches should complete quickly
      expect(searchTime).toBeLessThan(5000);
      
      // Verify search results for each user
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const searchTerm = searchTerms[i % searchTerms.length];
        
        const visibleCoaches = page.locator('.coach-card:visible');
        const count = await visibleCoaches.count();
        
        if (count > 0) {
          const firstCoach = visibleCoaches.first();
          const location = await firstCoach.locator('.coach-location').textContent();
          expect(location?.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
      }
      
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });
  });

  test.describe('Network Performance', () => {
    
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G network
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        const response = await route.fetch();
        route.fulfill({ response });
      });
      
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('.coach-card', { timeout: 20000 }); // Increased timeout for slow network
      
      const loadTime = Date.now() - startTime;
      
      console.log(`Load time on slow network: ${loadTime}ms`);
      
      // Should still load within reasonable time even on slow network
      expect(loadTime).toBeLessThan(15000);
      
      // Verify functionality still works
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBeGreaterThan(0);
    });

    test('should handle network failures gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/coaches', route => {
        route.abort('failed');
      });
      
      await page.goto('/');
      
      // Basic page structure should still load
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#location-search')).toBeVisible();
      
      // Should handle the error gracefully (no coaches displayed)
      await page.waitForTimeout(3000);
      const coachCount = await page.locator('.coach-card').count();
      expect(coachCount).toBe(0);
    });
  });
});



















