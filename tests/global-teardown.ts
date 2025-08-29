




import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Cleanup test environment and generate reports
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for Find Your Tennis Coach tests...');
  
  // Clean up any test data if needed
  try {
    console.log('🗑️  Cleaning up test artifacts...');
    
    // Note: In a real scenario, you might want to clean up test coaches
    // that were created during testing, but for this demo we'll leave
    // the sample data intact
    
    console.log('✅ Test cleanup completed');
  } catch (error) {
    console.log(`⚠️  Cleanup warning: ${error.message}`);
  }

  // Generate test summary
  console.log('📊 Test execution summary:');
  console.log(`   Configuration: ${config.configFile}`);
  console.log(`   Projects: ${config.projects.map(p => p.name).join(', ')}`);
  console.log('');
  console.log('📁 Test artifacts saved to: test-results/');
  console.log('📈 View HTML report: npx playwright show-report');
  console.log('');
  console.log('✅ Global teardown completed successfully!');
}

export default globalTeardown;




