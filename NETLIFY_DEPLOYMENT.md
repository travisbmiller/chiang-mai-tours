# Netlify Deployment Guide

## Issues Fixed

### 1. ✅ Removed Incorrect Publish Directory
**Problem**: The `netlify.toml` had `publish = ".next"` which conflicts with the `@netlify/plugin-nextjs` plugin.

**Fix**: Removed the publish directory. The plugin automatically handles the build output for Next.js 15.

### 2. ✅ Added NODE_ENV Configuration
**Problem**: Missing explicit production environment setting.

**Fix**: Added `NODE_ENV = "production"` to ensure optimal production builds.

### 3. ⚠️ Environment Variable Required
**Problem**: The `RESEND_API_KEY` environment variable is in `.env.local` (git-ignored) but not configured in Netlify.

**Fix**: Instructions below for adding it to Netlify.

---

## Deployment Steps

### Step 1: Configure Environment Variables in Netlify

**CRITICAL**: Your booking email functionality requires the `RESEND_API_KEY` environment variable.

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to: **Site settings** → **Environment variables**
4. Click **Add a variable** or **Add environment variables**
5. Add the following:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_9cLFaTgT_4mC7y6aFJrCn2wVCN4YsF7gu` (your current key from `.env.local`)
   - **Scopes**: Check all scopes (Production, Deploy Previews, Branch deploys)

6. Click **Save**

### Step 2: Deploy

After adding the environment variable, trigger a new deploy:

**Option A - Via Netlify UI:**
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

**Option B - Via Git:**
```bash
git add .
git commit -m "Fix Netlify deployment configuration"
git push
```

### Step 3: Verify Deployment

1. Wait for the build to complete (usually 2-5 minutes)
2. Check the deploy log for any errors
3. Visit your live site URL
4. Test the booking form to ensure emails are sent

---

## Expected Build Output

When the deployment succeeds, you should see:

```
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization
✓ Build completed successfully
```

---

## Configuration Summary

### Current `netlify.toml` Configuration:
- **Build Command**: `npm install && npm run build`
- **Node Version**: 20 (LTS)
- **Plugin**: `@netlify/plugin-nextjs` (handles Next.js 15 automatically)
- **Environment**: Production mode

### Required Environment Variables:
| Variable | Purpose | Status |
|----------|---------|--------|
| `RESEND_API_KEY` | Email delivery for booking requests | ⚠️ Must be added in Netlify UI |

---

## Troubleshooting

### Build Fails with "Cannot find module 'resend'"
**Cause**: Missing dependency in package.json

**Fix**: The `resend` package is already in your dependencies, so this shouldn't happen. If it does:
```bash
npm install resend --save
git add package.json package-lock.json
git commit -m "Add resend dependency"
git push
```

### Build Fails with "RESEND_API_KEY is not defined"
**Cause**: Environment variable not configured in Netlify

**Fix**: Follow Step 1 above to add the environment variable.

### 404 Errors on Routes
**Cause**: Netlify not properly handling Next.js routes

**Fix**: The `@netlify/plugin-nextjs` plugin should handle this. If issues persist, check that:
1. The plugin is installed in your build
2. Your Next.js version is 15.3.2 (current version is correct)

### Images Not Loading
**Cause**: Image optimization or remote image access issues

**Fix**: Your configuration already has `unoptimized: true` and proper remote patterns. If images still fail:
1. Check browser console for specific errors
2. Verify image URLs are accessible
3. Ensure all image domains are in the `remotePatterns` list in `next.config.js`

---

## Local vs. Production Differences

### Local Development (works):
- Uses `bun` package manager
- Reads `.env.local` file automatically
- Development mode with hot reload

### Netlify Production (was failing, now fixed):
- Uses `npm` package manager
- Reads environment variables from Netlify settings
- Production mode with optimizations
- Static generation + server-side rendering for dynamic routes

---

## Next Steps After Deployment

1. **Test the live site thoroughly**
   - Navigate through all pages
   - Submit a test booking
   - Verify email delivery to travisbmiller@outlook.com

2. **Monitor Resend Dashboard**
   - Go to https://resend.com/emails
   - Check that emails are being sent successfully
   - Monitor for any delivery issues

3. **Consider Custom Domain**
   - Later, verify your own domain in Resend
   - Update the "from" email address in `/src/app/api/send-booking/route.ts`
   - Change from `bookings@resend.dev` to your domain

4. **Set Up Monitoring**
   - Enable Netlify deploy notifications
   - Monitor error logs in Netlify dashboard
   - Set up uptime monitoring (optional)

---

## Security Notes

⚠️ **IMPORTANT**: Your `.env.local` file contains the actual API key. This file is properly git-ignored, so it won't be committed to your repository. However:

1. **Never commit `.env.local`** to version control
2. **Never share your RESEND_API_KEY** publicly
3. **Rotate your API key** if it's ever exposed
4. Store production keys only in Netlify's environment variables

---

## Support Resources

- **Netlify Next.js Plugin Docs**: https://docs.netlify.com/integrations/frameworks/next-js/
- **Next.js Deployment**: https://nextjs.org/docs/app/building-your-application/deploying
- **Resend Documentation**: https://resend.com/docs

If you encounter any issues not covered here, check the Netlify deploy logs for specific error messages.
