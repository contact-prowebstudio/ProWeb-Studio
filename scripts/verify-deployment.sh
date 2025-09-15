#!/bin/bash

# ProWeb Studio Production Deployment Verification Script
# Usage: ./verify-deployment.sh [domain]
# Example: ./verify-deployment.sh https://prowebstudio.nl

DOMAIN="${1:-https://prowebstudio.nl}"
echo "🚀 Verifying deployment: $DOMAIN"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${YELLOW}📄 Testing robots.txt and sitemap...${NC}"
curl -sI $DOMAIN/robots.txt | grep -q "200 OK"
test_result $? "robots.txt accessible"

curl -sI $DOMAIN/sitemap.xml | grep -q "200 OK"
test_result $? "sitemap.xml accessible"

echo ""
echo -e "${YELLOW}🔒 Testing security headers...${NC}"
curl -sI $DOMAIN | grep -q "strict-transport-security"
test_result $? "HSTS header present"

curl -sI $DOMAIN | grep -q "x-frame-options"
test_result $? "X-Frame-Options header present"

curl -sI $DOMAIN | grep -q "x-content-type-options"
test_result $? "X-Content-Type-Options header present"

curl -sI $DOMAIN | grep -q "referrer-policy"
test_result $? "Referrer-Policy header present"

curl -sI $DOMAIN | grep -q "permissions-policy"
test_result $? "Permissions-Policy header present"

echo ""
echo -e "${YELLOW}🖼️ Testing OG route (Edge Runtime)...${NC}"
curl -sI $DOMAIN/og | grep -q "200 OK"
test_result $? "OG image route accessible"

curl -sI $DOMAIN/og | grep -q "image/"
test_result $? "OG route returns image content-type"

echo ""
echo -e "${YELLOW}⚡ Testing caching strategies...${NC}"
curl -sI $DOMAIN/_next/static/chunks/main.js 2>/dev/null | grep -q "immutable" || \
curl -sI $DOMAIN/_next/static/chunks/app-layout.js 2>/dev/null | grep -q "immutable"
test_result $? "Static assets have immutable cache headers"

curl -sI $DOMAIN/api/contact | grep -q "no-store"
test_result $? "API routes have no-store cache headers"

echo ""
echo -e "${YELLOW}📞 Testing contact information...${NC}"
curl -s $DOMAIN/contact | grep -q "+31686412430"
test_result $? "Phone number present on contact page"

echo ""
echo -e "${YELLOW}🔗 Testing canonical URLs...${NC}"
curl -s $DOMAIN | grep -q 'rel="canonical"'
test_result $? "Canonical URLs present"

echo ""
echo -e "${YELLOW}🌐 Testing PWA features...${NC}"
curl -sI $DOMAIN/manifest.json | grep -q "200 OK"
test_result $? "PWA manifest accessible"

curl -sI $DOMAIN/sw.js | grep -q "200 OK"
test_result $? "Service worker accessible"

echo ""
echo -e "${YELLOW}📊 Additional Information...${NC}"

echo "--- Security Headers Details ---"
curl -sI $DOMAIN | grep -Ei 'strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy' | head -5

echo ""
echo "--- Robots.txt Content (first 5 lines) ---"
curl -s $DOMAIN/robots.txt | sed -n '1,5p'

echo ""
echo "--- Canonical URL ---"
curl -s $DOMAIN | grep -i '<link rel="canonical"' | head -1

echo ""
echo "=================================="
echo -e "${GREEN}✅ Verification complete!${NC}"
echo ""
echo "Manual checks still required:"
echo "- Visual testing on all pages"
echo "- 3D scene rendering verification"
echo "- Form submission testing"
echo "- Cross-browser compatibility"
echo "- Mobile responsiveness"
echo "- Performance testing (Lighthouse)"
echo ""
echo "For complete testing, see: docs/DEPLOY.md"