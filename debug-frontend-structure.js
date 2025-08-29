
// Debug script to check your frontend HTML structure
const { chromium } = require('playwright');

async function debugFrontend() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🔍 Debugging frontend structure...');
  
  try {
    await page.goto('https://piz6oefyh6.execute-api.us-east-1.amazonaws.com/prod');
    await page.waitForLoadState('networkidle');
    
    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`📋 Found ${headings.length} headings:`);
    
    for (let i = 0; i < headings.length; i++) {
      const text = await headings[i].textContent();
      const tagName = await headings[i].evaluate(el => el.tagName);
      console.log(`  ${tagName}: "${text}"`);
    }
    
    // Get body content structure
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('\n📝 Body HTML structure (first 500 chars):');
    console.log(bodyHTML.substring(0, 500) + '...');
    
    // Check for common elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    const divs = await page.locator('div').count();
    
    console.log('\n🔍 Element counts:');
    console.log(`  Buttons: ${buttons}`);
    console.log(`  Links: ${links}`);
    console.log(`  Inputs: ${inputs}`);
    console.log(`  Divs: ${divs}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
}

debugFrontend();
