

#!/bin/bash

# Run Playwright Tests with Video Recording
# This script runs tests and provides easy access to video results

set -e

echo "🎥 Playwright Test Runner with Video Recording"
echo "=============================================="
echo ""

# Check if we're in the tests directory
if [ ! -f "playwright.config.ts" ]; then
    echo "❌ Please run this script from the tests directory"
    echo "   cd tests && ./run-tests-with-videos.sh"
    exit 1
fi

# Show current configuration
echo "📋 Current Test Configuration:"
echo "  📍 BASE_URL: $(grep BASE_URL .env 2>/dev/null | cut -d'=' -f2 || echo 'Not set')"
echo "  🎥 Video Recording: ON (all tests)"
echo "  📸 Screenshots: ON (all tests)"
echo "  🔍 Traces: ON (all tests)"
echo ""

# Test options
echo "🎯 Test Options:"
echo "  1. Run all tests (frontend + coach search)"
echo "  2. Run only frontend tests"
echo "  3. Run only coach search tests"
echo "  4. Run single browser (Chromium)"
echo "  5. Run with UI mode (interactive)"
echo "  6. Run specific test pattern"
echo ""

read -p "Choose test option (1-6): " option

case $option in
    1)
        echo "🚀 Running all tests with video recording..."
        npx playwright test --reporter=html,list
        ;;
    2)
        echo "🚀 Running frontend tests with video recording..."
        npx playwright test frontend.spec.ts --reporter=html,list
        ;;
    3)
        echo "🚀 Running coach search tests with video recording..."
        npx playwright test coach-search.spec.ts --reporter=html,list
        ;;
    4)
        echo "🚀 Running tests on Chromium only with video recording..."
        npx playwright test --project=chromium --reporter=html,list
        ;;
    5)
        echo "🚀 Running tests in UI mode..."
        echo "💡 UI mode allows you to:"
        echo "   • Watch tests run in real-time"
        echo "   • Step through test execution"
        echo "   • Debug failing tests interactively"
        echo ""
        npx playwright test --ui
        ;;
    6)
        echo "🔍 Enter test pattern (e.g., 'search', 'homepage', 'should load'):"
        read -p "Pattern: " pattern
        echo "🚀 Running tests matching '$pattern' with video recording..."
        npx playwright test --grep "$pattern" --reporter=html,list
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

# Check if tests completed
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Tests completed successfully!"
else
    echo ""
    echo "⚠️  Some tests may have failed - check videos for details"
fi

echo ""
echo "🎥 Video Results Available:"
echo "=========================="

# Count and show video files
VIDEO_COUNT=$(find test-results -name "*.webm" 2>/dev/null | wc -l)
SCREENSHOT_COUNT=$(find test-results -name "*.png" 2>/dev/null | wc -l)

echo "📊 Generated Artifacts:"
echo "  🎥 Videos: $VIDEO_COUNT"
echo "  📸 Screenshots: $SCREENSHOT_COUNT"
echo ""

if [ $VIDEO_COUNT -gt 0 ]; then
    echo "🎬 Latest Test Videos:"
    find test-results -name "*.webm" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -5 | while read timestamp file; do
        size=$(du -h "$file" | cut -f1)
        testname=$(basename "$(dirname "$file")")
        echo "  📹 $testname ($size)"
    done
    echo ""
fi

echo "🌐 View Results:"
echo "  • HTML Report: npx playwright show-report"
echo "  • Video Viewer: ./view-test-videos.sh"
echo "  • Results Folder: test-results/"
echo ""

# Ask if user wants to view results immediately
read -p "🤔 Open HTML report now? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Opening HTML report..."
    npx playwright show-report
fi

echo ""
echo "🎯 What to Look for in Videos:"
echo "=============================="
echo "✅ Passed Tests:"
echo "  • Smooth page loading and navigation"
echo "  • Successful search interactions"
echo "  • Proper element detection and interaction"
echo "  • Clean UI rendering across browsers"
echo ""
echo "❌ Failed Tests:"
echo "  • Where exactly the test failed"
echo "  • Missing elements or slow loading"
echo "  • JavaScript errors or broken functionality"
echo "  • Browser-specific rendering issues"
echo ""
echo "🔍 Search Functionality Videos Show:"
echo "  • Search form interactions"
echo "  • Input field behavior"
echo "  • Search button clicks and responses"
echo "  • Results display and filtering"
echo "  • Performance and responsiveness"


