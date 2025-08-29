



import { chromium, FullConfig } from '@playwright/test';
import axios from 'axios';

/**
 * Simplified global setup for frontend-only tests
 * Basic connectivity check without API dependencies
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting frontend test setup...');
  
  const baseURL = process.env.BASE_URL;
  if (!baseURL) {
    console.log('⚠️  No BASE_URL set, using default from config');
    return;
  }

  console.log(`📍 Testing frontend at: ${baseURL}`);

  // Simple frontend connectivity check
  try {
    console.log('🌐 Checking frontend accessibility...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(baseURL, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log(`✅ Frontend accessible - Title: "${title}"`);
    
    await browser.close();
  } catch (error) {
    console.log('⚠️  Frontend check failed, but continuing tests...');
    console.log(`   Error: ${error.message}`);
  }

  console.log('✅ Frontend setup completed!');
  console.log('');
}

export default globalSetup;



