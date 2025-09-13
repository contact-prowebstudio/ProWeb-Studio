# ProWeb Studio Production Deployment Guide

Complete deployment guide for ProWeb Studio to Vercel production environment in the Netherlands.

## Environment Variables

### Required Environment Variables

Configure these environment variables in Vercel Project Settings → Environment Variables:

```bash
# Site Configuration
SITE_URL=https://prowebstudio.nl
SITE_NAME=ProWeb Studio
CONTACT_INBOX=contact@prowebstudio.nl

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl
```

### Optional Environment Variables

If using Redis for rate limiting (recommended for production):

```bash
# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Environment Notes

- `SITE_URL`: Must match your primary domain (no trailing slash)
- `SITE_NAME`: Used in metadata, OG tags, and schema.org markup
- `CONTACT_INBOX`: Email for contact form submissions and business schema
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Domain for Plausible Analytics (client-side)
- Redis variables: Optional but recommended for rate limiting in production

## Domain Configuration

### Primary Domain Setup

- **Primary Domain**: `prowebstudio.nl`
- **WWW Redirect**: Configure 301 redirect from `www.prowebstudio.nl` → `prowebstudio.nl`

In Vercel:
1. Go to Project → Settings → Domains
2. Add `prowebstudio.nl` as primary domain
3. Add `www.prowebstudio.nl` and configure to redirect to apex domain

### Analytics Configuration

Ensure the following are enabled in Vercel Project Settings:

- **Vercel Analytics**: Enable for production traffic insights
- **Vercel Speed Insights**: Enable for Core Web Vitals monitoring
- **Plausible Analytics**: Configured via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

## Deployment Steps

### 1. Pre-deployment Validation

Run these commands locally to ensure build readiness:

```bash
# Navigate to site directory
cd site/

# Clean install dependencies
npm ci

# TypeScript compilation check
npm run typecheck

# Linting check
npm run lint

# Production build test
npm run build
```

**Quality Gates**: All commands must exit with code 0 (no errors).

### 2. Code Deployment

#### Option A: Direct Main Branch Deploy

```bash
# Commit and push to main branch
git add .
git commit -m "docs: production deploy guide for Vercel NL + post-deploy verification checklist"
git push origin main
```

Vercel will automatically build and deploy to production.

#### Option B: Pull Request Workflow

```bash
# Create feature branch
git checkout -b deploy/production-nl

# Commit changes
git add .
git commit -m "docs: production deploy guide for Vercel NL + post-deploy verification checklist"
git push origin deploy/production-nl

# Create pull request → Vercel builds preview
# Review preview deployment
# Merge PR → Vercel deploys to production
```

### 3. Vercel Environment Configuration

1. **Go to Vercel Dashboard**
   - Navigate to your ProWeb Studio project
   - Go to Settings → Environment Variables

2. **Add Production Environment Variables**
   ```
   SITE_URL=https://prowebstudio.nl (Production)
   SITE_NAME=ProWeb Studio (Production)
   CONTACT_INBOX=contact@prowebstudio.nl (Production)
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl (Production)
   ```

3. **Redeploy with New Environment**
   - Go to Deployments tab
   - Find latest deployment
   - Click three dots → Redeploy
   - Select "Use existing Build Cache" for faster deployment

### 4. Production Promotion

#### If using Preview Deploy:
1. Test preview deployment thoroughly
2. Go to Deployments → Find successful preview
3. Click "Promote to Production"

#### If using Git Deploy:
- Production deployment happens automatically on main branch push
- Monitor deployment in Vercel dashboard

### 5. Domain Verification

After deployment, verify domain is properly connected:

```bash
# Check DNS propagation
nslookup prowebstudio.nl

# Check SSL certificate
curl -I https://prowebstudio.nl
```

## Post-Deployment Verification

Run the complete verification checklist to ensure successful deployment.

### Quick Health Check

```bash
# Replace DOMAIN with https://prowebstudio.nl
DOMAIN="https://prowebstudio.nl"

# Basic connectivity
curl -sI $DOMAIN | head -1

# Security headers present
curl -sI $DOMAIN | grep -E "strict-transport-security|x-frame-options"

# Robots and sitemap
curl -s $DOMAIN/robots.txt | head -5
curl -sI $DOMAIN/sitemap.xml | grep "200 OK"
```

### Full Verification Checklist

See the "Post-Deploy Verification Commands" section below for comprehensive testing.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run typecheck`
   - Check linting errors: `npm run lint`
   - Check for missing dependencies: `npm ci`

2. **Environment Variable Issues**
   - Ensure all required vars are set in Vercel
   - Redeploy after adding environment variables
   - Check variable scoping (Production vs Preview)

3. **Domain Issues**
   - Verify DNS settings with domain registrar
   - Check Vercel domain configuration
   - Allow 24-48 hours for DNS propagation

4. **Runtime Errors**
   - Check Vercel Function logs
   - Verify Next.js configuration
   - Check for rate limiting issues

### Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Project Repository**: Internal documentation in `/docs/`

---

# Post-Deploy Verification Commands

Comprehensive shell-friendly verification commands for production deployment.

## Setup

```bash
# Set domain variable
DOMAIN="https://prowebstudio.nl"
```

## Core Functionality Tests

### 1. Robots.txt and Sitemap

```bash
# Check robots.txt status and content
curl -sI $DOMAIN/robots.txt | grep -Ei '200|cache-control|content-type'
echo "--- Robots.txt content (first 5 lines) ---"
curl -s $DOMAIN/robots.txt | sed -n '1,5p'

# Check sitemap.xml
curl -sI $DOMAIN/sitemap.xml | grep -Ei '200|content-type'
echo "--- Sitemap status ---"
curl -sI $DOMAIN/sitemap.xml | head -1
```

### 2. Security Headers Verification

```bash
echo "--- Security Headers Check ---"
curl -sI $DOMAIN | grep -Ei 'strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy'
```

### 3. OG Route (Edge Runtime Test)

```bash
echo "--- Open Graph Image Route ---"
curl -sI $DOMAIN/og | grep -Ei '200|content-type'
```

### 4. Static Assets Caching

```bash
echo "--- Static Assets Cache Headers ---"
curl -sI $DOMAIN/_next/static/chunks/main.js 2>/dev/null | grep -i cache-control || \
curl -sI $DOMAIN/_next/static/chunks/app-layout.js 2>/dev/null | grep -i cache-control || \
echo "Note: Specific chunk names may vary between builds"
```

### 5. API Route Freshness

```bash
echo "--- API Route Cache Headers ---"
curl -sI $DOMAIN/api/contact | grep -i cache-control
```

### 6. Canonical URL Check

```bash
echo "--- Canonical URL Verification ---"
curl -s $DOMAIN | grep -i '<link rel="canonical"' | head -1
```

### 7. Contact Information Verification

```bash
echo "--- Phone Number Presence Check ---"
curl -s $DOMAIN/contact | grep -o '+31686412430' | head -1
```

## Advanced Verification

### Performance Headers

```bash
echo "--- Performance and Compression ---"
curl -sI $DOMAIN | grep -Ei 'content-encoding|cache-control|etag'
```

### PWA Manifest

```bash
echo "--- PWA Manifest ---"
curl -sI $DOMAIN/manifest.json | grep -Ei '200|content-type'
```

### Service Worker

```bash
echo "--- Service Worker ---"
curl -sI $DOMAIN/sw.js | grep -Ei '200|service-worker-allowed'
```

### API Health

```bash
echo "--- API Route Health ---"
curl -sI $DOMAIN/api/contact | head -3
```

## Complete Verification Script

Save this as `verify-deployment.sh`:

```bash
#!/bin/bash

DOMAIN="${1:-https://prowebstudio.nl}"
echo "🚀 Verifying deployment: $DOMAIN"
echo "=================================="

# Test 1: Robots & Sitemap
echo "📄 Testing robots.txt and sitemap..."
curl -sI $DOMAIN/robots.txt | grep -q "200 OK" && echo "✅ robots.txt" || echo "❌ robots.txt"
curl -sI $DOMAIN/sitemap.xml | grep -q "200 OK" && echo "✅ sitemap.xml" || echo "❌ sitemap.xml"

# Test 2: Security Headers
echo "🔒 Testing security headers..."
curl -sI $DOMAIN | grep -q "strict-transport-security" && echo "✅ HSTS" || echo "❌ HSTS"
curl -sI $DOMAIN | grep -q "x-frame-options" && echo "✅ X-Frame-Options" || echo "❌ X-Frame-Options"
curl -sI $DOMAIN | grep -q "x-content-type-options" && echo "✅ X-Content-Type-Options" || echo "❌ X-Content-Type-Options"

# Test 3: OG Route
echo "🖼️ Testing OG route..."
curl -sI $DOMAIN/og | grep -q "200 OK" && echo "✅ OG route" || echo "❌ OG route"

# Test 4: API Cache Headers
echo "⚡ Testing API cache headers..."
curl -sI $DOMAIN/api/contact | grep -q "no-store" && echo "✅ API no-cache" || echo "❌ API caching issue"

# Test 5: Contact Info
echo "📞 Testing contact information..."
curl -s $DOMAIN/contact | grep -q "+31686412430" && echo "✅ Phone number present" || echo "❌ Phone number missing"

# Test 6: Canonical URL
echo "🔗 Testing canonical URLs..."
curl -s $DOMAIN | grep -q 'rel="canonical"' && echo "✅ Canonical URLs" || echo "❌ Canonical URLs missing"

echo "=================================="
echo "✅ Verification complete!"
```

## Manual Smoke Testing Checklist

### Visual/3D Testing Requirements

After automated verification, perform these manual checks:

#### Core Pages Testing
- [ ] **Homepage** (`/`): Hero 3D scene loads, animations smooth
- [ ] **Services** (`/diensten`): Service cards and 3D elements render
- [ ] **About** (`/over-ons`): Team section and background effects work
- [ ] **Contact** (`/contact`): Form submits, 3D background renders
- [ ] **Process** (`/werkwijze`): Step animations and 3D elements
- [ ] **Playground** (`/speeltuin`): 3D scenes load and interact properly
- [ ] **Terms** (`/voorwaarden`): Legal content displays correctly
- [ ] **Privacy** (`/privacy`): Privacy policy content accessible

#### 3D and Motion Testing
- [ ] **WebGL Support**: 3D scenes render on capable devices
- [ ] **Reduced Motion**: Test with OS setting enabled - animations respect preference
- [ ] **Mobile Rendering**: 3D elements work on mobile devices
- [ ] **Fallback Behavior**: Graceful degradation on low-end devices
- [ ] **Performance**: No CLS in hero sections, smooth animations

#### Form and Interaction Testing
- [ ] **Contact Form**: Submits successfully (returns 200 locally)
- [ ] **Cal.com Integration**: Booking widget loads and functions
- [ ] **Navigation**: All menu items work, mobile menu functions
- [ ] **External Links**: Social media and external links open correctly

#### Technical Verification
- [ ] **PWA Install**: Installation prompt appears on supported browsers
- [ ] **Offline Mode**: Basic offline functionality works
- [ ] **Analytics**: Plausible analytics tracking (check browser dev tools)
- [ ] **Console Errors**: No JavaScript errors in browser console
- [ ] **Lighthouse Score**: Core Web Vitals pass (90+ performance)

### Device Testing Matrix

| Device Type | Screen Size | 3D Rendering | Forms | Navigation |
|------------|-------------|--------------|-------|------------|
| Desktop | 1920x1080+ | ✅ Full | ✅ | ✅ |
| Laptop | 1366x768 | ✅ Full | ✅ | ✅ |
| Tablet | 768x1024 | ✅ Optimized | ✅ | ✅ Mobile |
| Mobile | 375x667 | ✅ Reduced | ✅ | ✅ Mobile |
| Low-end | Any | ⚠️ Fallback | ✅ | ✅ |

### Quality Gates for Go-Live

- [ ] All automated verification tests pass
- [ ] All core pages load within 3 seconds
- [ ] 3D scenes render correctly on target devices
- [ ] Forms submit without errors
- [ ] No critical console errors
- [ ] Mobile navigation works smoothly
- [ ] Lighthouse Core Web Vitals score >90

---

## CI/CD Notes

### GitHub Actions (if applicable)

If your repository uses GitHub Actions, ensure these workflows exist:

- **Build Verification**: Runs `typecheck`, `lint`, `build` on PR
- **Lighthouse CI**: Performance testing on preview deployments
- **Security Scanning**: Dependency and security checks

### Vercel Deployment Settings

Recommended Vercel project settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Node.js Version**: 18.x (matches package.json engines)

### Environment Promotion

For staging → production workflow:

1. Deploy to preview environment first
2. Run full verification suite on preview
3. Promote to production after verification passes
4. Run post-deploy verification on production

---

*Last updated: September 13, 2025*
*Deployment target: Vercel, Netherlands region*
*Framework: Next.js 14+ App Router*