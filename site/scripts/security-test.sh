#!/bin/bash

# ProWeb Studio Security Testing Script
# Comprehensive security validation for production deployment

echo "🔒 ProWeb Studio Security Testing"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test results
print_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        ((PASSED++))
    elif [ "$result" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $test_name - $message"
        ((FAILED++))
    elif [ "$result" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC}: $test_name - $message"
        ((WARNINGS++))
    fi
}

# Function to check if server is running
check_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo "📋 Starting security tests..."
echo ""

# 1. Build Validation
echo "🔨 Build Validation"
echo "==================="

if [ -d ".next" ]; then
    print_result "Production build exists" "PASS"
else
    print_result "Production build missing" "FAIL" "Run 'npm run build' first"
fi

# Check middleware
if [ -f "src/middleware.ts" ]; then
    print_result "Security middleware present" "PASS"
else
    print_result "Security middleware missing" "FAIL" "Middleware is required for security"
fi

# Check security files
if [ -f "public/.well-known/security.txt" ]; then
    print_result "Security.txt file present" "PASS"
else
    print_result "Security.txt file missing" "WARN" "Should be present for responsible disclosure"
fi

echo ""

# 2. Environment Configuration
echo "🔧 Environment Configuration"
echo "============================"

if [ -f ".env.example" ]; then
    print_result "Environment example file present" "PASS"
else
    print_result "Environment example missing" "WARN" "Should document required variables"
fi

# Check for common security environment variables
if grep -q "RECAPTCHA_SECRET_KEY" .env.example 2>/dev/null; then
    print_result "reCAPTCHA configuration documented" "PASS"
else
    print_result "reCAPTCHA configuration missing" "WARN" "Required for contact form security"
fi

echo ""

# 3. File Security Checks
echo "📁 File Security Checks"
echo "======================="

# Check for sensitive files that shouldn't be committed
if [ -f ".env" ] || [ -f ".env.local" ]; then
    print_result "Environment files present" "WARN" "Ensure .env files are not committed to version control"
else
    print_result "No environment files in repo" "PASS"
fi

# Check gitignore
if grep -q ".env" .gitignore 2>/dev/null; then
    print_result "Environment files ignored" "PASS"
else
    print_result "Environment files not ignored" "FAIL" "Add .env* to .gitignore"
fi

# Check for security headers in config
if grep -q "Strict-Transport-Security" next.config.mjs 2>/dev/null; then
    print_result "Security headers configured" "PASS"
else
    print_result "Security headers missing" "FAIL" "Configure security headers in next.config.mjs"
fi

echo ""

# 4. Dependencies Security
echo "📦 Dependencies Security"
echo "========================"

# Check for security vulnerabilities
if command -v npm &> /dev/null; then
    echo "Running npm audit..."
    if npm audit --audit-level=moderate > /tmp/npm_audit.log 2>&1; then
        print_result "No security vulnerabilities found" "PASS"
    else
        VULNS=$(grep -c "vulnerabilities" /tmp/npm_audit.log 2>/dev/null || echo "0")
        if [ "$VULNS" -gt 0 ]; then
            print_result "Security vulnerabilities detected" "FAIL" "Run 'npm audit fix' to resolve"
        else
            print_result "npm audit completed" "PASS"
        fi
    fi
else
    print_result "npm not available" "WARN" "Cannot check dependencies"
fi

echo ""

# 5. Server Security Tests (if server is running)
echo "🌐 Server Security Tests"
echo "======================="

if check_server; then
    echo "Server detected at localhost:3000, running security tests..."
    
    # Test security headers
    SECURITY_HEADERS=$(curl -s -I http://localhost:3000 2>/dev/null)
    
    if echo "$SECURITY_HEADERS" | grep -qi "strict-transport-security"; then
        print_result "HSTS header present" "PASS"
    else
        print_result "HSTS header missing" "FAIL" "HSTS required for production"
    fi
    
    if echo "$SECURITY_HEADERS" | grep -qi "x-frame-options"; then
        print_result "X-Frame-Options header present" "PASS"
    else
        print_result "X-Frame-Options header missing" "FAIL" "Required to prevent clickjacking"
    fi
    
    if echo "$SECURITY_HEADERS" | grep -qi "x-content-type-options"; then
        print_result "X-Content-Type-Options header present" "PASS"
    else
        print_result "X-Content-Type-Options header missing" "FAIL" "Required to prevent MIME sniffing"
    fi
    
    # Test rate limiting (basic check)
    echo "Testing rate limiting..."
    RATE_TEST_RESULTS=""
    for i in {1..3}; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/contact -X POST -H "Content-Type: application/json" -d '{}' 2>/dev/null)
        RATE_TEST_RESULTS="$RATE_TEST_RESULTS $HTTP_CODE"
        sleep 1
    done
    
    if echo "$RATE_TEST_RESULTS" | grep -q "429"; then
        print_result "Rate limiting active" "PASS"
    else
        print_result "Rate limiting test" "WARN" "Unable to verify rate limiting (may require more requests)"
    fi
    
    # Test security.txt accessibility
    SECURITY_TXT_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/.well-known/security.txt 2>/dev/null)
    if [ "$SECURITY_TXT_CODE" = "200" ]; then
        print_result "Security.txt accessible" "PASS"
    else
        print_result "Security.txt not accessible" "WARN" "Should be accessible at /.well-known/security.txt"
    fi
    
else
    print_result "Server not running" "WARN" "Start server with 'npm run start' to run server tests"
fi

echo ""

# 6. Code Security Analysis
echo "💻 Code Security Analysis"
echo "========================"

# Check for common security issues in code
if grep -r "eval(" src/ 2>/dev/null | grep -v node_modules > /dev/null; then
    print_result "eval() usage detected" "FAIL" "Avoid using eval() for security"
else
    print_result "No eval() usage found" "PASS"
fi

if grep -r "innerHTML" src/ 2>/dev/null | grep -v node_modules > /dev/null; then
    print_result "innerHTML usage detected" "WARN" "Use textContent or sanitize HTML content"
else
    print_result "No innerHTML usage found" "PASS"
fi

if grep -r "dangerouslySetInnerHTML" src/ 2>/dev/null | grep -v node_modules > /dev/null; then
    DANGEROUS_HTML_COUNT=$(grep -r "dangerouslySetInnerHTML" src/ 2>/dev/null | grep -v node_modules | wc -l)
    print_result "dangerouslySetInnerHTML usage" "WARN" "Found $DANGEROUS_HTML_COUNT instances - ensure content is sanitized"
else
    print_result "No dangerouslySetInnerHTML usage" "PASS"
fi

# Check for hardcoded secrets (excluding React keys and environment variable references)
if grep -r -E "(password|secret|key)\s*=\s*['\"][^'\"]{10,}" src/ 2>/dev/null | grep -v node_modules | grep -v ".example" | grep -v "placeholder" | grep -v "process.env" > /dev/null; then
    print_result "Potential hardcoded secrets" "FAIL" "Secrets should be in environment variables"
else
    print_result "No hardcoded secrets found" "PASS"
fi

echo ""

# 7. Security Configuration Validation
echo "⚙️  Security Configuration Validation"
echo "====================================="

# Check middleware configuration
if grep -q "rateLimitMap" src/middleware.ts 2>/dev/null; then
    print_result "Rate limiting configured" "PASS"
else
    print_result "Rate limiting not configured" "FAIL" "Rate limiting required in middleware"
fi

if grep -q "BOT_USER_AGENTS" src/middleware.ts 2>/dev/null; then
    print_result "Bot detection configured" "PASS"
else
    print_result "Bot detection not configured" "WARN" "Bot detection recommended"
fi

if grep -q "Content-Security-Policy" src/middleware.ts 2>/dev/null; then
    print_result "CSP configured in middleware" "PASS"
else
    print_result "CSP not configured" "WARN" "Content Security Policy recommended"
fi

# Check contact form security
if grep -q "honeypot\|website.*hidden" src/components/ -r 2>/dev/null; then
    print_result "Honeypot field implemented" "PASS"
else
    print_result "Honeypot field missing" "WARN" "Honeypot recommended for spam prevention"
fi

if grep -q "recaptcha\|grecaptcha" src/components/ -r 2>/dev/null; then
    print_result "reCAPTCHA integration present" "PASS"
else
    print_result "reCAPTCHA integration missing" "WARN" "reCAPTCHA recommended for bot protection"
fi

echo ""

# 8. Summary
echo "📊 Security Test Summary"
echo "======================="
echo -e "Total Tests: $((PASSED + FAILED + WARNINGS))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical security tests passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Consider addressing warnings for enhanced security.${NC}"
    fi
    exit 0
else
    echo -e "${RED}❌ $FAILED critical security issues detected.${NC}"
    echo -e "${YELLOW}Please address failed tests before production deployment.${NC}"
    exit 1
fi

echo ""
echo "💡 Security Recommendations:"
echo "1. Run security tests regularly"
echo "2. Keep dependencies updated"
echo "3. Monitor security logs"
echo "4. Perform penetration testing"
echo "5. Review security configuration quarterly"
echo ""
echo "📚 For more information, see docs/SECURITY.md"
