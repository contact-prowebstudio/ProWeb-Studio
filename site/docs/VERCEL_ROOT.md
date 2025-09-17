# Vercel Deployment Configuration

## Project Settings Checklist

When setting up this project on Vercel, ensure the following configuration in **Project Settings → General**:

### ✅ Required Settings

- **Root Directory**: `site/`
  - ⚠️ **Critical**: Must be set to `site/` directory, not repository root
  - This ensures Vercel looks for `package.json`, `next.config.mjs`, and builds from the correct location

- **Framework Preset**: Next.js
  - Auto-detected, but verify it shows "Next.js" with App Router support

- **Build Command**: (leave default)
  - Vercel auto-detects: `npm run build`
  - Only override if you have custom build requirements

- **Output Directory**: (leave default)
  - Vercel auto-detects: `.next` (Next.js standard)

- **Install Command**: (leave default)
  - Vercel auto-detects: `npm install`

### 🔧 Node.js Version

- **Node Version**: Respect `.nvmrc` (Node 20)
  - Vercel will auto-detect from `.nvmrc` file
  - No manual override needed unless version mismatch occurs
  - Current target: Node.js 20.x LTS

### 🌍 Environment Variables

Ensure all required environment variables are configured in **Project Settings → Environment Variables**:

- Production, Preview, and Development environments as needed
- Reference `site/.env.example` for complete list of required variables
- Never commit actual secrets to repository

### 🚀 Deployment

After configuration:
1. Deploy should automatically build from `site/` directory
2. Verify build logs show correct working directory
3. Test all functionality including API routes and static assets

### ❌ Common Issues

- **Build fails**: Check Root Directory is set to `site/`
- **API routes 404**: Verify Framework Preset is Next.js
- **Static assets missing**: Ensure Output Directory uses default `.next`
- **Environment errors**: Check all required env vars are set per `.env.example`

---

Last updated: September 2025