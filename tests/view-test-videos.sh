
#!/bin/bash

# View Playwright Test Videos and Results
# This script helps you easily access test videos, screenshots, and reports

set -e

echo "🎥 Playwright Test Results Viewer"
echo "=================================="
echo ""

# Check if test results exist
if [ ! -d "test-results" ]; then
    echo "❌ No test results found. Run tests first:"
    echo "   npx playwright test"
    exit 1
fi

# Count test artifacts
VIDEO_COUNT=$(find test-results -name "*.webm" 2>/dev/null | wc -l)
SCREENSHOT_COUNT=$(find test-results -name "*.png" 2>/dev/null | wc -l)
TRACE_COUNT=$(find test-results -name "*.zip" 2>/dev/null | wc -l)

echo "📊 Test Artifacts Found:"
echo "  🎥 Videos: $VIDEO_COUNT"
echo "  📸 Screenshots: $SCREENSHOT_COUNT"
echo "  🔍 Traces: $TRACE_COUNT"
echo ""

# Show available options
echo "📁 Available Actions:"
echo "  1. View HTML Report (recommended)"
echo "  2. List all video files"
echo "  3. List all screenshots"
echo "  4. List all trace files"
echo "  5. Open test results folder"
echo "  6. Show latest test results"
echo ""

read -p "Choose an option (1-6): " choice

case $choice in
    1)
        echo "🌐 Opening HTML report..."
        if [ -f "playwright-report/index.html" ]; then
            echo "📊 HTML Report available at: playwright-report/index.html"
            echo ""
            echo "To view the report, run:"
            echo "   npx playwright show-report"
            echo ""
            echo "The HTML report includes:"
            echo "  ✅ Test results summary"
            echo "  🎥 Embedded videos for each test"
            echo "  📸 Screenshots on failures"
            echo "  🔍 Interactive trace viewer"
            echo "  📊 Performance metrics"
            
            # Try to open the report
            if command -v npx >/dev/null 2>&1; then
                npx playwright show-report
            else
                echo "Run 'npx playwright show-report' to view the interactive report"
            fi
        else
            echo "❌ HTML report not found. Run tests with HTML reporter enabled."
        fi
        ;;
    2)
        echo "🎥 Video Files:"
        echo "=============="
        find test-results -name "*.webm" -type f | while read video; do
            size=$(du -h "$video" | cut -f1)
            echo "📹 $video ($size)"
        done
        echo ""
        echo "💡 Tip: Videos show the complete test execution including:"
        echo "   • Page navigation and loading"
        echo "   • User interactions (clicks, typing)"
        echo "   • Search functionality in action"
        echo "   • Visual feedback and results"
        ;;
    3)
        echo "📸 Screenshot Files:"
        echo "==================="
        find test-results -name "*.png" -type f | while read screenshot; do
            size=$(du -h "$screenshot" | cut -f1)
            echo "🖼️  $screenshot ($size)"
        done
        echo ""
        echo "💡 Screenshots capture:"
        echo "   • Final state of each test"
        echo "   • Error states for failed tests"
        echo "   • Visual proof of functionality"
        ;;
    4)
        echo "🔍 Trace Files:"
        echo "==============="
        find test-results -name "*.zip" -type f | while read trace; do
            size=$(du -h "$trace" | cut -f1)
            echo "📊 $trace ($size)"
        done
        echo ""
        echo "💡 Trace files contain:"
        echo "   • Complete test execution timeline"
        echo "   • Network requests and responses"
        echo "   • DOM snapshots at each step"
        echo "   • Performance metrics"
        echo ""
        echo "View traces with: npx playwright show-trace <trace-file>"
        ;;
    5)
        echo "📁 Opening test results folder..."
        if command -v explorer >/dev/null 2>&1; then
            explorer test-results
        elif command -v open >/dev/null 2>&1; then
            open test-results
        elif command -v xdg-open >/dev/null 2>&1; then
            xdg-open test-results
        else
            echo "📂 Test results location: $(pwd)/test-results"
            ls -la test-results/
        fi
        ;;
    6)
        echo "📊 Latest Test Results Summary:"
        echo "==============================="
        
        # Find the most recent test results
        LATEST_DIR=$(find test-results -type d -name "*" | head -1)
        
        if [ -n "$LATEST_DIR" ]; then
            echo "📁 Latest test folder: $LATEST_DIR"
            
            # Show contents
            ls -la "$LATEST_DIR" 2>/dev/null || echo "No files in latest test folder"
            
            # Show any video info
            if find "$LATEST_DIR" -name "*.webm" >/dev/null 2>&1; then
                echo ""
                echo "🎥 Videos in latest test:"
                find "$LATEST_DIR" -name "*.webm" -exec basename {} \;
            fi
        else
            echo "❌ No test result folders found"
        fi
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-6."
        exit 1
        ;;
esac

echo ""
echo "🎯 Quick Commands:"
echo "  • Run tests: npx playwright test"
echo "  • View report: npx playwright show-report"
echo "  • Run specific test: npx playwright test coach-search.spec.ts"
echo "  • Run with UI: npx playwright test --ui"
echo ""
echo "📚 Video Analysis Tips:"
echo "  • Videos show complete user journey"
echo "  • Look for search interactions and results"
echo "  • Check page loading and responsiveness"
echo "  • Verify cross-browser consistency"

