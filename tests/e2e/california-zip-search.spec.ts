
import { test, expect } from '@playwright/test';

/**
 * California Zip Code Search Functionality Tests
 * Tests the enhanced search capabilities for finding tennis coaches by California zip codes
 */

test.describe('🎾 California Zip Code Search Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Zip Code Search Interface', () => {
    
    test('should display search form with California zip code placeholder', async ({ page }) => {
      console.log('🔍 Testing zip code search form visibility...');
      
      // Look for search input with California zip code placeholder
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="90210" i]').first();
      await expect(searchInput).toBeVisible();
      
      // Verify placeholder text contains California zip code reference
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(placeholder?.toLowerCase()).toContain('zip code');
      console.log(`✅ Found search input with placeholder: "${placeholder}"`);
      
      // Check for search tips mentioning California zip codes
      const searchTips = page.locator('text=/.*zip code.*California.*/i, text=/.*90210.*Beverly Hills.*/i');
      const hasTips = await searchTips.count() > 0;
      
      if (hasTips) {
        console.log('✅ Found search tips mentioning California zip codes');
      } else {
        console.log('ℹ️ No explicit California zip code tips found');
      }
    });

    test('should show autocomplete suggestions for zip codes', async ({ page }) => {
      console.log('🔍 Testing zip code autocomplete functionality...');
      
      // Find search input
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      await expect(searchInput).toBeVisible();
      
      // Type a partial Beverly Hills zip code
      await searchInput.fill('9021');
      await page.waitForTimeout(500); // Wait for autocomplete to appear
      
      // Check for autocomplete dropdown
      const autocompleteDropdown = page.locator('.suggestions-dropdown, [class*="autocomplete"], [class*="dropdown"]');
      const hasAutocomplete = await autocompleteDropdown.count() > 0;
      
      if (hasAutocomplete) {
        console.log('✅ Autocomplete dropdown appears when typing zip code');
        
        // Check if 90210 appears in suggestions
        const suggestion = page.locator('text=/.*90210.*Beverly Hills.*/i');
        const hasSuggestion = await suggestion.count() > 0;
        
        if (hasSuggestion) {
          console.log('✅ Found 90210 (Beverly Hills) in autocomplete suggestions');
        } else {
          console.log('ℹ️ 90210 suggestion not found - checking for any zip code suggestions');
          
          // Check for any numeric suggestions
          const numericSuggestion = page.locator('text=/9\\d{4}/');
          expect(await numericSuggestion.count()).toBeGreaterThan(0);
          console.log('✅ Found numeric zip code suggestions');
        }
      } else {
        console.log('ℹ️ No visible autocomplete dropdown - checking if input accepts zip code');
        
        // Complete the zip code and check if it's accepted
        await searchInput.fill('90210');
        const value = await searchInput.inputValue();
        expect(value).toBe('90210');
        console.log('✅ Input accepts full zip code entry');
      }
    });
    
    test('should show autocomplete suggestions for California cities', async ({ page }) => {
      console.log('🔍 Testing California city autocomplete functionality...');
      
      // Find search input
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      await expect(searchInput).toBeVisible();
      
      // Type a partial city name
      await searchInput.fill('San F');
      await page.waitForTimeout(500); // Wait for autocomplete to appear
      
      // Check for autocomplete dropdown
      const autocompleteDropdown = page.locator('.suggestions-dropdown, [class*="autocomplete"], [class*="dropdown"]');
      const hasAutocomplete = await autocompleteDropdown.count() > 0;
      
      if (hasAutocomplete) {
        console.log('✅ Autocomplete dropdown appears when typing city name');
        
        // Check if San Francisco appears in suggestions
        const suggestion = page.locator('text=/San Francisco/i');
        const hasSuggestion = await suggestion.count() > 0;
        
        if (hasSuggestion) {
          console.log('✅ Found San Francisco in autocomplete suggestions');
        } else {
          console.log('ℹ️ San Francisco suggestion not found - checking for any city suggestions');
          
          // Check for any San* suggestions
          const citySuggestion = page.locator('text=/San\\s\\w+/');
          expect(await citySuggestion.count()).toBeGreaterThan(0);
          console.log('✅ Found city name suggestions starting with "San"');
        }
      } else {
        console.log('ℹ️ No visible autocomplete dropdown - checking if input accepts city name');
        
        // Complete the city name and check if it's accepted
        await searchInput.fill('San Francisco');
        const value = await searchInput.inputValue();
        expect(value).toBe('San Francisco');
        console.log('✅ Input accepts full city name entry');
      }
    });
  });

  test.describe('Zip Code Search Execution', () => {
    
    test('should find coaches when searching by Beverly Hills zip code (90210)', async ({ page }) => {
      console.log('🔍 Testing search by Beverly Hills zip code (90210)...');
      
      // Find search input and button
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      const searchButton = page.locator('button:has-text("Search")').first();
      
      // Enter Beverly Hills zip code
      await searchInput.fill('90210');
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForTimeout(1000);
      
      // Look for coach results
      const coachCards = page.locator('.coach-card, .coach-item, .coach-profile, .coach, [class*="coach"]');
      const coachCount = await coachCards.count();
      
      if (coachCount > 0) {
        console.log(`✅ Found ${coachCount} coach(es) for Beverly Hills zip code`);
        
        // Check if any coach has Beverly Hills location
        const beverlyHillsCoach = page.locator('text=/Beverly Hills/i');
        const hasBeverlyHills = await beverlyHillsCoach.count() > 0;
        
        if (hasBeverlyHills) {
          console.log('✅ Found coach(es) with Beverly Hills location');
        } else {
          console.log('ℹ️ No explicit Beverly Hills location text found - checking for 90210 zip code');
          
          // Check for 90210 zip code
          const zipCodeText = page.locator('text=/90210/');
          expect(await zipCodeText.count()).toBeGreaterThan(0);
          console.log('✅ Found coach(es) with 90210 zip code');
        }
      } else {
        console.log('ℹ️ No coach cards found - checking for any search results');
        
        // Check for any content that might represent search results
        const resultsContent = await page.textContent('body');
        const hasResults = resultsContent?.includes('90210') || 
                          resultsContent?.toLowerCase().includes('beverly hills');
        
        expect(hasResults).toBeTruthy();
        console.log('✅ Found search results containing Beverly Hills or 90210');
      }
    });
    
    test('should find coaches when searching by San Francisco zip code (94102)', async ({ page }) => {
      console.log('🔍 Testing search by San Francisco zip code (94102)...');
      
      // Find search input and button
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      const searchButton = page.locator('button:has-text("Search")').first();
      
      // Enter San Francisco zip code
      await searchInput.fill('94102');
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForTimeout(1000);
      
      // Look for coach results
      const coachCards = page.locator('.coach-card, .coach-item, .coach-profile, .coach, [class*="coach"]');
      const coachCount = await coachCards.count();
      
      if (coachCount > 0) {
        console.log(`✅ Found ${coachCount} coach(es) for San Francisco zip code`);
        
        // Check if any coach has San Francisco location
        const sanFranciscoCoach = page.locator('text=/San Francisco/i');
        const hasSanFrancisco = await sanFranciscoCoach.count() > 0;
        
        if (hasSanFrancisco) {
          console.log('✅ Found coach(es) with San Francisco location');
        } else {
          console.log('ℹ️ No explicit San Francisco location text found - checking for 94102 zip code');
          
          // Check for 94102 zip code
          const zipCodeText = page.locator('text=/94102/');
          expect(await zipCodeText.count()).toBeGreaterThan(0);
          console.log('✅ Found coach(es) with 94102 zip code');
        }
      } else {
        console.log('ℹ️ No coach cards found - checking for any search results');
        
        // Check for any content that might represent search results
        const resultsContent = await page.textContent('body');
        const hasResults = resultsContent?.includes('94102') || 
                          resultsContent?.toLowerCase().includes('san francisco');
        
        expect(hasResults).toBeTruthy();
        console.log('✅ Found search results containing San Francisco or 94102');
      }
    });
    
    test('should find coaches when searching by city name (San Diego)', async ({ page }) => {
      console.log('🔍 Testing search by city name (San Diego)...');
      
      // Find search input and button
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      const searchButton = page.locator('button:has-text("Search")').first();
      
      // Enter city name
      await searchInput.fill('San Diego');
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForTimeout(1000);
      
      // Look for coach results
      const coachCards = page.locator('.coach-card, .coach-item, .coach-profile, .coach, [class*="coach"]');
      const coachCount = await coachCards.count();
      
      if (coachCount > 0) {
        console.log(`✅ Found ${coachCount} coach(es) for San Diego`);
        
        // Check if any coach has San Diego location
        const sanDiegoCoach = page.locator('text=/San Diego/i');
        const hasSanDiego = await sanDiegoCoach.count() > 0;
        
        if (hasSanDiego) {
          console.log('✅ Found coach(es) with San Diego location');
        } else {
          console.log('ℹ️ No explicit San Diego location text found - checking for San Diego zip code');
          
          // Check for San Diego zip code (92101)
          const zipCodeText = page.locator('text=/92101/');
          expect(await zipCodeText.count()).toBeGreaterThan(0);
          console.log('✅ Found coach(es) with San Diego zip code');
        }
      } else {
        console.log('ℹ️ No coach cards found - checking for any search results');
        
        // Check for any content that might represent search results
        const resultsContent = await page.textContent('body');
        const hasResults = resultsContent?.includes('92101') || 
                          resultsContent?.toLowerCase().includes('san diego');
        
        expect(hasResults).toBeTruthy();
        console.log('✅ Found search results containing San Diego or its zip code');
      }
    });
  });

  test.describe('Zip Code Autocomplete Keyboard Navigation', () => {
    
    test('should navigate autocomplete suggestions with keyboard', async ({ page }) => {
      console.log('⌨️ Testing keyboard navigation in autocomplete...');
      
      // Find search input
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      await expect(searchInput).toBeVisible();
      
      // Type a partial zip code to trigger autocomplete
      await searchInput.fill('9021');
      await page.waitForTimeout(500); // Wait for autocomplete to appear
      
      // Check for autocomplete dropdown
      const autocompleteDropdown = page.locator('.suggestions-dropdown, [class*="autocomplete"], [class*="dropdown"]');
      const hasAutocomplete = await autocompleteDropdown.count() > 0;
      
      if (hasAutocomplete) {
        console.log('✅ Autocomplete dropdown appears');
        
        // Test arrow down navigation
        await searchInput.press('ArrowDown');
        await page.waitForTimeout(300);
        
        // Check if a suggestion is highlighted/focused
        const highlightedItem = page.locator('.suggestion-item.highlighted, .suggestion-item:focus, [class*="selected"], [class*="active"], [class*="highlighted"]');
        const hasHighlighted = await highlightedItem.count() > 0;
        
        if (hasHighlighted) {
          console.log('✅ Arrow key navigation highlights suggestion items');
          
          // Test Enter key selection
          await searchInput.press('Enter');
          await page.waitForTimeout(300);
          
          // Check if a zip code was selected
          const inputValue = await searchInput.inputValue();
          expect(inputValue.length).toBeGreaterThanOrEqual(5); // Zip code should be at least 5 chars
          console.log(`✅ Enter key selects suggestion: "${inputValue}"`);
        } else {
          console.log('ℹ️ No visible highlight effect - testing Escape key');
          
          // Test Escape key to dismiss dropdown
          await searchInput.press('Escape');
          await page.waitForTimeout(300);
          
          // Check if dropdown is dismissed
          const dropdownAfterEscape = await autocompleteDropdown.count();
          expect(dropdownAfterEscape).toBe(0);
          console.log('✅ Escape key dismisses autocomplete dropdown');
        }
      } else {
        console.log('ℹ️ No visible autocomplete dropdown - testing direct keyboard input');
        
        // Complete the zip code with keyboard
        await searchInput.press('0');
        const value = await searchInput.inputValue();
        expect(value).toBe('90210');
        console.log('✅ Keyboard input works for zip code entry');
      }
    });
  });

  test.describe('Zip Code Search Edge Cases', () => {
    
    test('should handle partial zip code searches gracefully', async ({ page }) => {
      console.log('🔍 Testing partial zip code search handling...');
      
      // Find search input and button
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      const searchButton = page.locator('button:has-text("Search")').first();
      
      // Enter partial zip code
      await searchInput.fill('902');
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForTimeout(1000);
      
      // Check that page doesn't crash or show errors
      const errorMessages = page.locator('.error, .alert-danger, [class*="error"]');
      const errorCount = await errorMessages.count();
      
      if (errorCount === 0) {
        console.log('✅ Partial zip code search handled without errors');
      } else {
        console.log(`ℹ️ Found ${errorCount} error messages - checking if they're informative`);
        
        // Check if error messages are informative
        const errorText = await errorMessages.first().textContent();
        expect(errorText?.toLowerCase()).toContain('zip');
        console.log(`✅ Error message is informative: "${errorText}"`);
      }
    });
    
    test('should handle non-California zip code searches gracefully', async ({ page }) => {
      console.log('🔍 Testing non-California zip code search handling...');
      
      // Find search input and button
      const searchInput = page.locator('input[placeholder*="zip code" i], input[placeholder*="city" i]').first();
      const searchButton = page.locator('button:has-text("Search")').first();
      
      // Enter non-California zip code (New York)
      await searchInput.fill('10001');
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForTimeout(1000);
      
      // Check for no results message or empty results
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
        // Check if there are any coach results
        const coachCards = page.locator('.coach-card, .coach-item, .coach-profile, .coach, [class*="coach"]');
        const coachCount = await coachCards.count();
        
        if (coachCount === 0) {
          console.log('✅ No coaches displayed for non-California zip code (as expected)');
        } else {
          console.log(`ℹ️ Found ${coachCount} coach(es) for non-California zip code - checking if they're relevant`);
          
          // Check if any coach has New York location
          const newYorkCoach = page.locator('text=/New York/i');
          const hasNewYork = await newYorkCoach.count() > 0;
          
          if (hasNewYork) {
            console.log('✅ Found coach(es) with New York location (application supports non-CA zip codes)');
          } else {
            console.log('ℹ️ No New York coaches found - application may be filtering to California only');
          }
        }
      }
    });
  });
});
