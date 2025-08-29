



import { chromium, FullConfig } from '@playwright/test';
import axios from 'axios';

/**
 * Global setup for Playwright tests
 * Validates API endpoints and prepares test environment
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Find Your Tennis Coach tests...');
  
  const baseURL = process.env.BASE_URL;
  if (!baseURL) {
    throw new Error('BASE_URL environment variable is required');
  }

  console.log(`📍 Testing against: ${baseURL}`);

  // Test API connectivity
  try {
    console.log('🔍 Checking API connectivity...');
    const response = await axios.get(`${baseURL}/coaches`, {
      timeout: 30000,
      validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
    });
    
    if (response.status === 200) {
      console.log('✅ API is responding correctly');
      console.log(`📊 Found ${response.data.length} coaches in database`);
    } else {
      console.log(`⚠️  API returned status ${response.status}, but continuing tests...`);
    }
  } catch (error) {
    console.log('⚠️  API connectivity check failed, but continuing tests...');
    console.log(`   Error: ${error.message}`);
  }

  // Test frontend connectivity
  try {
    console.log('🌐 Checking frontend connectivity...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(baseURL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log(`✅ Frontend is accessible - Title: "${title}"`);
    
    await browser.close();
  } catch (error) {
    console.log('⚠️  Frontend connectivity check failed, but continuing tests...');
    console.log(`   Error: ${error.message}`);
  }

  // Create test data if needed
  try {
    console.log('🗄️  Preparing test data...');
    
    // Check if we need to seed test data
    const coachesResponse = await axios.get(`${baseURL}/coaches`, {
      timeout: 10000,
      validateStatus: () => true // Accept any status
    });
    
    if (coachesResponse.status === 200 && coachesResponse.data.length === 0) {
      console.log('📝 Database appears empty, test data may need to be seeded');
    }
    
  } catch (error) {
    console.log('ℹ️  Could not check test data, continuing...');
  }

  console.log('✅ Global setup completed successfully!');
  console.log('');
}

export default globalSetup;



