












#!/bin/bash

# Find Your Tennis Coach - Test Runner Script
# Comprehensive test execution with reporting and validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_RESULTS_DIR="$SCRIPT_DIR/test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Default options
RUN_ALL=true
RUN_API=false
RUN_FRONTEND=false
RUN_INTEGRATION=false
RUN_ACCESSIBILITY=false
RUN_PERFORMANCE=false
HEADED=false
DEBUG=false
GENERATE_REPORT=true
INSTALL_DEPS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --api)
            RUN_ALL=false
            RUN_API=true
            shift
            ;;
        --frontend)
            RUN_ALL=false
            RUN_FRONTEND=true
            shift
            ;;
        --integration)
            RUN_ALL=false
            RUN_INTEGRATION=true
            shift
            ;;
        --accessibility)
            RUN_ALL=false
            RUN_ACCESSIBILITY=true
            shift
            ;;
        --performance)
            RUN_ALL=false
            RUN_PERFORMANCE=true
            shift
            ;;
        --headed)
            HEADED=true
            shift
            ;;
        --debug)
            DEBUG=true
            shift
            ;;
        --no-report)
            GENERATE_REPORT=false
            shift
            ;;
        --install)
            INSTALL_DEPS=true
            shift
            ;;
        --help)
            echo "Find Your Tennis Coach - Test Runner"
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --api              Run API tests only"
            echo "  --frontend         Run frontend tests only"
            echo "  --integration      Run integration tests only"
            echo "  --accessibility    Run accessibility tests only"
            echo "  --performance      Run performance tests only"
            echo "  --headed           Run tests with browser UI visible"
            echo "  --debug            Run tests in debug mode"
            echo "  --no-report        Skip generating HTML report"
            echo "  --install          Install dependencies before running tests"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                 # Run all tests"
            echo "  $0 --api --frontend # Run API and frontend tests"
            echo "  $0 --headed --debug # Run all tests with browser visible in debug mode"
            echo "  $0 --install       # Install dependencies and run all tests"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_header "🎾 Find Your Tennis Coach - Test Suite"

# Change to test directory
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Make sure you're running this script from the tests directory."
    exit 1
fi

# Install dependencies if requested
if [[ "$INSTALL_DEPS" == true ]]; then
    print_info "Installing test dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    npm install
    
    print_info "Installing Playwright browsers..."
    npx playwright install
    
    print_success "Dependencies installed successfully"
    echo ""
fi

# Check if dependencies are installed
if [[ ! -d "node_modules" ]]; then
    print_warning "Dependencies not found. Installing..."
    npm install
    npx playwright install
fi

# Check for environment configuration
if [[ ! -f ".env" ]]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your BASE_URL before running tests"
    echo ""
fi

# Load environment variables
if [[ -f ".env" ]]; then
    source .env
fi

# Validate BASE_URL
if [[ -z "$BASE_URL" ]]; then
    print_error "BASE_URL not set in .env file"
    print_info "Please set BASE_URL to your deployed Tennis Coach platform URL"
    print_info "Example: BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"
    exit 1
fi

print_info "Testing against: $BASE_URL"
echo ""

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Build test command
TEST_CMD="npx playwright test"

if [[ "$HEADED" == true ]]; then
    TEST_CMD="$TEST_CMD --headed"
fi

if [[ "$DEBUG" == true ]]; then
    TEST_CMD="$TEST_CMD --debug"
fi

# Determine which tests to run
TESTS_TO_RUN=""

if [[ "$RUN_ALL" == true ]]; then
    print_info "Running all test suites..."
    TESTS_TO_RUN="e2e/"
else
    if [[ "$RUN_API" == true ]]; then
        TESTS_TO_RUN="$TESTS_TO_RUN e2e/api.spec.ts"
    fi
    if [[ "$RUN_FRONTEND" == true ]]; then
        TESTS_TO_RUN="$TESTS_TO_RUN e2e/frontend.spec.ts"
    fi
    if [[ "$RUN_INTEGRATION" == true ]]; then
        TESTS_TO_RUN="$TESTS_TO_RUN e2e/integration.spec.ts"
    fi
    if [[ "$RUN_ACCESSIBILITY" == true ]]; then
        TESTS_TO_RUN="$TESTS_TO_RUN e2e/accessibility.spec.ts"
    fi
    if [[ "$RUN_PERFORMANCE" == true ]]; then
        TESTS_TO_RUN="$TESTS_TO_RUN e2e/performance.spec.ts"
    fi
    
    print_info "Running selected test suites: $TESTS_TO_RUN"
fi

echo ""

# Run the tests
print_header "🚀 Executing Tests"

START_TIME=$(date +%s)

if eval "$TEST_CMD $TESTS_TO_RUN"; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    print_success "All tests completed successfully!"
    print_info "Total execution time: ${DURATION} seconds"
else
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    print_error "Some tests failed!"
    print_info "Total execution time: ${DURATION} seconds"
    
    if [[ "$GENERATE_REPORT" == true ]]; then
        print_info "Check the HTML report for detailed failure information"
    fi
fi

echo ""

# Generate and show report
if [[ "$GENERATE_REPORT" == true ]]; then
    print_header "📊 Test Report"
    
    print_info "Generating HTML report..."
    
    if npx playwright show-report --host 0.0.0.0 > /dev/null 2>&1 &
    then
        REPORT_PID=$!
        print_success "HTML report generated successfully"
        print_info "Report server started (PID: $REPORT_PID)"
        print_info "View report at: http://localhost:9323"
        print_info "Press Ctrl+C to stop the report server"
        
        # Wait for user to stop the server
        trap "kill $REPORT_PID 2>/dev/null; exit 0" INT
        wait $REPORT_PID
    else
        print_warning "Could not start report server automatically"
        print_info "Run 'npm run test:report' to view the HTML report"
    fi
fi

# Test results summary
print_header "📋 Test Results Summary"

if [[ -d "$TEST_RESULTS_DIR" ]]; then
    TOTAL_TESTS=$(find "$TEST_RESULTS_DIR" -name "*.json" -exec grep -l '"tests"' {} \; 2>/dev/null | wc -l)
    
    if [[ $TOTAL_TESTS -gt 0 ]]; then
        print_info "Test artifacts saved to: $TEST_RESULTS_DIR"
        print_info "Screenshots and videos available for failed tests"
    fi
fi

# Cleanup and final messages
echo ""
print_header "🎯 Next Steps"

print_info "Test execution completed at $(date)"

if [[ -f "$TEST_RESULTS_DIR/results.json" ]]; then
    print_info "Detailed results available in: $TEST_RESULTS_DIR/results.json"
fi

print_info "To run specific test suites:"
echo "  • API tests:          $0 --api"
echo "  • Frontend tests:     $0 --frontend"
echo "  • Integration tests:  $0 --integration"
echo "  • Accessibility tests: $0 --accessibility"
echo "  • Performance tests:  $0 --performance"

echo ""
print_success "🎾 Tennis Coach Platform testing complete!"

# Exit with appropriate code
if [[ -f "$TEST_RESULTS_DIR/results.json" ]]; then
    # Check if there were any failures in the results
    if grep -q '"status":"failed"' "$TEST_RESULTS_DIR/results.json" 2>/dev/null; then
        exit 1
    fi
fi

exit 0












