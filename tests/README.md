








# Find Your Tennis Coach - Automated Test Suite

Comprehensive Playwright test suite with TypeScript for testing all layers and functionalities of the Find Your Tennis Coach platform.

## 🎯 Test Coverage

### API Layer Tests (`api.spec.ts`)
- **CRUD Operations**: Create, Read, Update, Delete coaches
- **Data Validation**: Required fields, data types, constraints
- **Error Handling**: Invalid requests, malformed data, missing resources
- **CORS Headers**: Cross-origin resource sharing validation
- **Performance**: Response times, concurrent requests

### Frontend UI Tests (`frontend.spec.ts`)
- **Page Structure**: Headers, sections, navigation
- **Coach Display**: Cards, images, ratings, information
- **Search Functionality**: Location and specialty filtering
- **Interactive Elements**: Buttons, forms, hover effects
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Accessibility**: Form labels, alt text, heading structure

### Integration Tests (`integration.spec.ts`)
- **End-to-End Workflows**: Complete user journeys
- **Frontend-Backend Sync**: Data consistency between UI and API
- **Cross-Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Performance Integration**: Load times, concurrent users
- **Error Scenarios**: API failures, network issues

### Accessibility Tests (`accessibility.spec.ts`)
- **WCAG 2.1 Compliance**: AA level standards
- **Keyboard Navigation**: Tab order, focus management
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Mobile Accessibility**: Touch targets, zoom support
- **Color Contrast**: Text readability standards

### Performance Tests (`performance.spec.ts`)
- **Load Performance**: Page load times, resource loading
- **Runtime Performance**: Search operations, DOM manipulation
- **Memory Management**: Memory leaks, garbage collection
- **Network Performance**: Slow connections, failures
- **Concurrent Users**: Multi-user scenarios

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd tests
npm install
npx playwright install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your deployed website URL
```

### 3. Run All Tests
```bash
npm test
```

### 4. Run Specific Test Suites
```bash
# API tests only
npx playwright test api.spec.ts

# Frontend tests only
npx playwright test frontend.spec.ts

# Integration tests only
npx playwright test integration.spec.ts

# Accessibility tests only
npx playwright test accessibility.spec.ts

# Performance tests only
npx playwright test performance.spec.ts
```

## 🔧 Test Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
# Your deployed website URL (required)
BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod

# Optional performance thresholds
MAX_PAGE_LOAD_TIME=5000
MAX_API_RESPONSE_TIME=3000
MAX_SEARCH_TIME=1000
```

### Browser Configuration
Tests run on multiple browsers by default:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari Mobile

### Test Modes
```bash
# Run with browser UI visible
npm run test:headed

# Run in debug mode
npm run test:debug

# Run with interactive UI
npm run test:ui

# Generate test code
npm run test:codegen
```

## 📊 Test Reports

### HTML Report
```bash
npm run test:report
```
Opens detailed HTML report with:
- Test results by browser
- Screenshots and videos of failures
- Performance metrics
- Accessibility findings

### CI/CD Integration
```bash
# Run tests in CI mode
CI=true npm test
```

## 🎯 Test Scenarios

### Complete User Workflows
1. **Coach Discovery Journey**
   - Navigate to homepage
   - View available coaches
   - Search by location
   - Filter by specialty
   - Contact a coach

2. **Multi-Filter Search**
   - Apply location filter
   - Add specialty filter
   - Verify combined results
   - Clear filters

3. **Responsive Experience**
   - Test on mobile devices
   - Verify tablet layout
   - Check desktop functionality

### API Testing Scenarios
1. **Coach Management**
   - Get all coaches
   - Get specific coach
   - Create new coach
   - Update coach details
   - Delete coach

2. **Error Handling**
   - Invalid coach ID
   - Malformed requests
   - Missing required fields
   - Server errors

### Performance Scenarios
1. **Load Testing**
   - Initial page load
   - Coach data loading
   - Image loading
   - API response times

2. **Stress Testing**
   - Multiple concurrent users
   - Rapid search operations
   - Memory usage monitoring

### Accessibility Scenarios
1. **Keyboard Navigation**
   - Tab through all elements
   - Activate buttons with Enter/Space
   - Navigate forms with keyboard

2. **Screen Reader Support**
   - Proper heading structure
   - Alt text for images
   - ARIA labels and landmarks

## 🔍 Debugging Tests

### Debug Mode
```bash
# Run specific test in debug mode
npx playwright test api.spec.ts --debug

# Debug with browser visible
npx playwright test --headed --debug
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots at failure point
- Video recordings of test execution
- Network logs and console errors

### Trace Viewer
```bash
# View detailed trace of test execution
npx playwright show-trace test-results/trace.zip
```

## 📈 Performance Metrics

### Measured Metrics
- **First Contentful Paint (FCP)**: < 3 seconds
- **Largest Contentful Paint (LCP)**: < 4 seconds
- **API Response Time**: < 3 seconds
- **Search Operation Time**: < 1 second
- **Page Load Time**: < 5 seconds

### Performance Budget
- **Total Page Weight**: < 2MB
- **Image Load Time**: < 2 seconds average
- **Memory Usage**: < 50% increase during interactions

## 🛠️ Customization

### Adding New Tests
1. Create new `.spec.ts` file in `e2e/` directory
2. Import Playwright test framework
3. Follow existing test patterns
4. Add to test suite documentation

### Custom Matchers
```typescript
// Example custom matcher for coach data validation
expect(coach).toHaveValidCoachStructure();
```

### Test Data Management
```typescript
// Create test coaches for specific scenarios
const testCoach = {
  name: 'Test Coach',
  specialty: 'Test Specialty',
  location: 'Test City',
  // ... other properties
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Tests Timeout**
   - Check BASE_URL is correct
   - Verify website is deployed and accessible
   - Increase timeout in playwright.config.ts

2. **API Tests Fail**
   - Verify API endpoints are working
   - Check CORS configuration
   - Validate request/response formats

3. **Browser Installation**
   ```bash
   npx playwright install
   npx playwright install-deps
   ```

4. **Environment Issues**
   - Verify .env file exists and has correct BASE_URL
   - Check network connectivity to deployed site

### Getting Help
- Check test logs in `test-results/`
- Review HTML report for detailed failure information
- Use debug mode to step through failing tests
- Verify website is accessible manually before running tests

## 📋 Test Checklist

Before deploying:
- [ ] All API endpoints tested
- [ ] Frontend functionality verified
- [ ] Cross-browser compatibility confirmed
- [ ] Accessibility standards met
- [ ] Performance benchmarks achieved
- [ ] Error scenarios handled
- [ ] Mobile responsiveness validated

## 🎾 Tennis Coach Platform Features Tested

### Core Functionality
- ✅ Coach listing and display
- ✅ Search by location
- ✅ Filter by specialty
- ✅ Coach contact functionality
- ✅ Responsive design
- ✅ Image loading and display

### Technical Features
- ✅ REST API endpoints
- ✅ CORS configuration
- ✅ Error handling
- ✅ Performance optimization
- ✅ Accessibility compliance
- ✅ Cross-browser support

### User Experience
- ✅ Intuitive navigation
- ✅ Fast search results
- ✅ Mobile-friendly interface
- ✅ Professional coach profiles
- ✅ Clear contact options
- ✅ Accessible design

---

**Happy Testing! 🎾**

For questions or issues, please check the troubleshooting section or review the test logs in the `test-results/` directory.








