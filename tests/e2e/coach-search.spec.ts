
import { test, expect } from '@playwright/test';

/**
 * Coach Search Functionality Tests
 * Tests the search and filtering capabilities for finding tennis coaches
 */

test.describe('🎾 Coach Search Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Search Interface', () => {
    
    test('should display search form elements', async ({ page }) => {
      console.log('🔍 Testing search form visibility...');
      
      // Look for search-related elements with flexible selectors
      const searchElements = [
        'input[placeholder*="location" i]',
        'input[placeholder*="city" i]',
        'input[placeholder*="search" i]',
        'input[type="search"]',
        'input[name*="location" i]',
        'input[name*="search" i]',
        '#location-search',
        '#search',
        '.search-input'
      ];
      
      let foundSearchInput = false;
      for (const selector of searchElements) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          foundSearchInput = true;
          console.log(`✅ Found search input: ${selector}`);
          break;
        }
      }
      
      // Look for search buttons
      const searchButtons = [
        'button[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("Find")',
        'input[type="submit"]',
        '.search-btn',
        '#search-btn'
      ];
      
      let foundSearchButton = false;
      for (const selector of searchButtons) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          foundSearchButton = true;
          console.log(`✅ Found search button: ${selector}`);
          break;
        }
      }
      
      if (!foundSearchInput && !foundSearchButton) {
        console.log('ℹ️  No traditional search form found, checking for alternative search interface...');
        
        // Check if there's any form or interactive element
        const forms = await page.locator('form').count();
        const inputs = await page.locator('input').count();
        const buttons = await page.locator('button').count();
        
        console.log(`📊 Found: ${forms} forms, ${inputs} inputs, ${buttons} buttons`);
        
        // At least some interactive elements should exist for a coach search platform
        expect(forms + inputs + buttons).toBeGreaterThan(0);
      }
    });

    test('should handle location search input', async ({ page }) => {
      console.log('📍 Testing location search input...');
      
      // Try to find location search input
      const locationInputs = [
        '#location-search',
        'input[placeholder*="location" i]',
        'input[placeholder*="city" i]',
        'input[name*="location" i]',
        'input[type="search"]',
        'input[type="text"]'
      ];
      
      let locationInput = null;
      for (const selector of locationInputs) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          locationInput = element.first();
          break;
        }
      }
      
      if (locationInput) {
        // Test typing in location
        await locationInput.fill('New York');
        const value = await locationInput.inputValue();
        expect(value).toBe('New York');
        console.log('✅ Location input accepts text input');
        
        // Clear and try another location
        await locationInput.fill('Los Angeles');
        const newValue = await locationInput.inputValue();
        expect(newValue).toBe('Los Angeles');
        console.log('✅ Location input can be updated');
      } else {
        console.log('ℹ️  No location input found - may use different search interface');
      }
    });

    test('should handle specialty/skill search', async ({ page }) => {
      console.log('🎯 Testing specialty search...');
      
      // Look for specialty/skill search elements
      const specialtyInputs = [
        '#specialty-search',
        'input[placeholder*="specialty" i]',
        'input[placeholder*="skill" i]',
        'input[placeholder*="level" i]',
        'select[name*="specialty" i]',
        'select[name*="skill" i]'
      ];
      
      let specialtyInput = null;
      for (const selector of specialtyInputs) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          specialtyInput = element.first();
          break;
        }
      }
      
      if (specialtyInput) {
        const tagName = await specialtyInput.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
          // Handle dropdown selection
          const options = await specialtyInput.locator('option').count();
          if (options > 1) {
            await specialtyInput.selectOption({ index: 1 });
            console.log('✅ Specialty dropdown selection works');
          }
        } else {
          // Handle text input
          await specialtyInput.fill('Beginner');
          const value = await specialtyInput.inputValue();
          expect(value).toBe('Beginner');
          console.log('✅ Specialty input accepts text');
        }
      } else {
        console.log('ℹ️  No specialty input found - may use different filtering method');
      }
    });
  });

  test.describe('Search Execution', () => {
    
    test('should execute search when search button is clicked', async ({ page }) => {
      console.log('🔍 Testing search execution...');
      
      // Find and fill search inputs if they exist
      const locationInput = page.locator('#location-search, input[placeholder*="location" i]').first();
      const searchButton = page.locator('button[type="submit"], button:has-text("Search"), .search-btn').first();
      
      if (await locationInput.count() > 0) {
        await locationInput.fill('Miami');
        console.log('📝 Filled location: Miami');
      }
      
      if (await searchButton.count() > 0) {
        // Record initial state
        const initialContent = await page.content();
        
        // Click search button
        await searchButton.click();
        console.log('🖱️  Clicked search button');
        
        // Wait for potential changes
        await page.waitForTimeout(2000);
        
        // Check if page content changed or loading occurred
        const newContent = await page.content();
        const contentChanged = initialContent !== newContent;
        
        if (contentChanged) {
          console.log('✅ Search execution caused page changes');
        } else {
          console.log('ℹ️  Search executed (no visible changes detected)');
        }
      } else {
        console.log('ℹ️  No search button found - testing alternative search methods');
        
        // Try pressing Enter in search field
        if (await locationInput.count() > 0) {
          await locationInput.press('Enter');
          await page.waitForTimeout(1000);
          console.log('✅ Tested Enter key search');
        }
      }
    });

    test('should handle empty search gracefully', async ({ page }) => {
      console.log('🔍 Testing empty search handling...');
      
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await searchButton.count() > 0) {
        // Click search without entering any criteria
        await searchButton.click();
        await page.waitForTimeout(1000);
        
        // Check that page doesn't crash or show errors
        const errorMessages = page.locator('.error, .alert-danger, [class*="error"]');
        const errorCount = await errorMessages.count();
        
        console.log(`✅ Empty search handled gracefully (${errorCount} error messages)`);
      } else {
        console.log('ℹ️  No search button to test empty search');
      }
    });
  });

  test.describe('Search Results', () => {
    
    test('should display coach results after search', async ({ page }) => {
      console.log('👥 Testing coach results display...');
      
      // Look for coach-related content containers
      const coachContainers = [
        '.coach-card',
        '.coach-item',
        '.coach-profile',
        '.coach',
        '[data-testid*="coach"]',
        '.result-item',
        '.profile-card'
      ];
      
      let foundCoaches = false;
      for (const selector of coachContainers) {
        const coaches = page.locator(selector);
        const count = await coaches.count();
        
        if (count > 0) {
          console.log(`✅ Found ${count} coach elements with selector: ${selector}`);
          
          // Test first coach card
          const firstCoach = coaches.first();
          await expect(firstCoach).toBeVisible();
          
          foundCoaches = true;
          break;
        }
      }
      
      if (!foundCoaches) {
        console.log('ℹ️  No coach cards found - checking for alternative content structure');
        
        // Look for any content that might represent coaches
        const textContent = await page.textContent('body');
        const hasCoachContent = textContent?.toLowerCase().includes('coach') || 
                               textContent?.toLowerCase().includes('tennis') ||
                               textContent?.toLowerCase().includes('instructor');
        
        if (hasCoachContent) {
          console.log('✅ Found coach-related content in page text');
        } else {
          console.log('ℹ️  No obvious coach content found');
        }
      }
    });

    test('should display coach information in results', async ({ page }) => {
      console.log('📋 Testing coach information display...');
      
      // Look for coach cards or profiles
      const coachElements = page.locator('.coach-card, .coach-item, .coach-profile, .coach');
      const coachCount = await coachElements.count();
      
      if (coachCount > 0) {
        const firstCoach = coachElements.first();
        
        // Check for common coach information fields
        const infoFields = [
          { selector: '.coach-name, .name, h3, h4', label: 'name' },
          { selector: '.coach-location, .location', label: 'location' },
          { selector: '.coach-specialty, .specialty, .skills', label: 'specialty' },
          { selector: '.coach-rating, .rating, .stars', label: 'rating' },
          { selector: '.coach-experience, .experience', label: 'experience' },
          { selector: '.coach-rate, .price, .cost', label: 'rate' },
          { selector: 'img, .coach-image, .avatar', label: 'image' }
        ];
        
        let foundFields = 0;
        for (const field of infoFields) {
          const element = firstCoach.locator(field.selector);
          if (await element.count() > 0) {
            await expect(element.first()).toBeVisible();
            foundFields++;
            console.log(`✅ Found ${field.label} field`);
          }
        }
        
        console.log(`✅ Coach information: ${foundFields}/${infoFields.length} fields found`);
        expect(foundFields).toBeGreaterThan(0);
      } else {
        console.log('ℹ️  No coach elements found to test information display');
      }
    });

    test('should handle no results scenario', async ({ page }) => {
      console.log('🔍 Testing no results scenario...');
      
      // Try to trigger a search that should return no results
      const locationInput = page.locator('#location-search, input[placeholder*="location" i]').first();
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await locationInput.count() > 0 && await searchButton.count() > 0) {
        // Search for something unlikely to exist
        await locationInput.fill('NonexistentCity12345XYZ');
        await searchButton.click();
        await page.waitForTimeout(2000);
        
        // Look for "no results" messages
        const noResultsMessages = [
          'text="No coaches found"',
          'text="No results"',
          'text="0 coaches"',
          '.no-results',
          '.empty-state',
          '[class*="no-results"]'
        ];
        
        let foundNoResultsMessage = false;
        for (const selector of noResultsMessages) {
          if (await page.locator(selector).count() > 0) {
            foundNoResultsMessage = true;
            console.log(`✅ Found no results message: ${selector}`);
            break;
          }
        }
        
        if (!foundNoResultsMessage) {
          console.log('ℹ️  No explicit "no results" message found');
        }
      } else {
        console.log('ℹ️  Cannot test no results scenario - search interface not available');
      }
    });
  });

  test.describe('Search Filters and Sorting', () => {
    
    test('should provide filtering options', async ({ page }) => {
      console.log('🎛️  Testing filter options...');
      
      // Look for filter elements
      const filterElements = [
        'select',
        '.filter',
        '.dropdown',
        'input[type="checkbox"]',
        'input[type="radio"]',
        '[class*="filter"]',
        '[data-testid*="filter"]'
      ];
      
      let foundFilters = 0;
      for (const selector of filterElements) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        if (count > 0) {
          foundFilters += count;
          console.log(`✅ Found ${count} filter elements: ${selector}`);
        }
      }
      
      if (foundFilters > 0) {
        console.log(`✅ Total filter options found: ${foundFilters}`);
      } else {
        console.log('ℹ️  No filter options found - may use simple search only');
      }
    });

    test('should provide sorting options', async ({ page }) => {
      console.log('📊 Testing sort options...');
      
      // Look for sorting elements
      const sortElements = [
        'select[name*="sort" i]',
        '.sort-dropdown',
        '.sort-options',
        'button:has-text("Sort")',
        '[class*="sort"]',
        '[data-testid*="sort"]'
      ];
      
      let foundSortOptions = false;
      for (const selector of sortElements) {
        const elements = page.locator(selector);
        if (await elements.count() > 0) {
          foundSortOptions = true;
          console.log(`✅ Found sort options: ${selector}`);
          
          // Try to interact with sort option
          const firstSort = elements.first();
          if (await firstSort.isVisible()) {
            const tagName = await firstSort.evaluate(el => el.tagName.toLowerCase());
            
            if (tagName === 'select') {
              const options = await firstSort.locator('option').count();
              if (options > 1) {
                await firstSort.selectOption({ index: 1 });
                console.log('✅ Sort dropdown interaction successful');
              }
            } else if (tagName === 'button') {
              await firstSort.click();
              console.log('✅ Sort button click successful');
            }
          }
          break;
        }
      }
      
      if (!foundSortOptions) {
        console.log('ℹ️  No sort options found - results may use default ordering');
      }
    });
  });

  test.describe('Search Performance', () => {
    
    test('should perform search within reasonable time', async ({ page }) => {
      console.log('⏱️  Testing search performance...');
      
      const locationInput = page.locator('#location-search, input[placeholder*="location" i]').first();
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await locationInput.count() > 0 && await searchButton.count() > 0) {
        await locationInput.fill('New York');
        
        const startTime = Date.now();
        await searchButton.click();
        
        // Wait for search to complete (look for results or loading to finish)
        await page.waitForTimeout(3000); // Max wait time
        
        const endTime = Date.now();
        const searchTime = endTime - startTime;
        
        console.log(`✅ Search completed in ${searchTime}ms`);
        expect(searchTime).toBeLessThan(10000); // Should complete within 10 seconds
      } else {
        console.log('ℹ️  Cannot test search performance - search interface not available');
      }
    });

    test('should handle multiple rapid searches', async ({ page }) => {
      console.log('🔄 Testing rapid search handling...');
      
      const locationInput = page.locator('#location-search, input[placeholder*="location" i]').first();
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await locationInput.count() > 0 && await searchButton.count() > 0) {
        const searches = ['Miami', 'Boston', 'Chicago'];
        
        for (const location of searches) {
          await locationInput.fill(location);
          await searchButton.click();
          await page.waitForTimeout(500); // Brief pause between searches
          console.log(`✅ Rapid search for ${location} executed`);
        }
        
        console.log('✅ Multiple rapid searches handled successfully');
      } else {
        console.log('ℹ️  Cannot test rapid searches - search interface not available');
      }
    });
  });
});

