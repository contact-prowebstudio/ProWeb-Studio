#!/bin/bash

# ProWeb Studio Performance Testing Script
# Tests Core Web Vitals and bundle optimization

echo "🚀 ProWeb Studio Performance Testing"
echo "===================================="

# Create reports directory if it doesn't exist
mkdir -p reports

# 1. Build production bundle
echo "📦 Building production bundle..."
NODE_ENV=production npm run build

# 2. Analyze bundle size
echo "📊 Analyzing bundle size..."
ANALYZE=true npm run build > reports/bundle-analysis.log 2>&1

# 3. Check for build errors
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check reports/bundle-analysis.log"
    exit 1
fi

# 4. Start server in background
echo "🔄 Starting production server..."
npm run start &
SERVER_PID=$!

# Wait for server to be ready
sleep 10

# 5. Run Lighthouse audit (if lighthouse is installed)
if command -v lighthouse &> /dev/null; then
    echo "🔍 Running Lighthouse audit..."
    lighthouse http://localhost:3000 \
        --output=html \
        --output-path=./reports/lighthouse.html \
        --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
        --only-categories=performance \
        --quiet
    
    echo "📈 Lighthouse report saved to reports/lighthouse.html"
else
    echo "⚠️  Lighthouse not installed - skipping audit"
    echo "   Install with: npm install -g lighthouse"
fi

# 6. Check bundle sizes
echo "📏 Bundle size analysis:"
echo "======================="

if [ -d ".next/static/chunks" ]; then
    echo "📦 Main chunks:"
    ls -lh .next/static/chunks/*.js | head -10
    
    echo ""
    echo "📦 Three.js chunks:"
    ls -lh .next/static/chunks/ | grep -i three || echo "No Three.js specific chunks found"
    
    echo ""
    echo "📦 Total bundle size:"
    du -sh .next/static/chunks/
else
    echo "❌ No build output found"
fi

# 7. Performance recommendations
echo ""
echo "🎯 Performance Recommendations:"
echo "==============================="
echo "1. Keep main bundle < 200KB gzipped"
echo "2. Three.js chunks should be lazy loaded"
echo "3. Lighthouse score should be > 90"
echo "4. Core Web Vitals should be in 'Good' range"
echo ""

# 8. Check for performance monitoring in code
echo "🔍 Checking performance monitoring setup:"
echo "========================================"

if grep -r "withPerformanceMonitoring" src/ > /dev/null; then
    echo "✅ Performance monitoring detected"
else
    echo "⚠️  Consider adding performance monitoring"
fi

if grep -r "Dynamic.*Component" src/ > /dev/null; then
    echo "✅ Dynamic imports detected"
else
    echo "⚠️  Consider adding dynamic imports for heavy components"
fi

if [ -f "public/sw.js" ]; then
    echo "✅ Service Worker found"
else
    echo "⚠️  Consider adding Service Worker for caching"
fi

# 9. Stop server
echo "🔚 Stopping server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "✨ Performance testing complete!"
echo "📋 Check reports/ directory for detailed results"
echo ""

# 10. Quick stats summary
if [ -f "reports/lighthouse.html" ]; then
    echo "🎯 Open reports/lighthouse.html to view detailed performance metrics"
fi

echo "💡 Tips:"
echo "- Run 'npm run analyze' to see bundle composition"
echo "- Use 'npm run dev:perf' for development with monitoring"
echo "- Check Network tab in DevTools for loading performance"
