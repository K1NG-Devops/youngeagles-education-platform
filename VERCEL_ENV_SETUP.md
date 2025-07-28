# Vercel Environment Variables Setup

## Why ads aren't showing

The ads are not showing because the environment variables for AdSense are missing from your Vercel deployment. The AdManager components are returning `null` when these variables are undefined.

## Required Environment Variables

Go to your Vercel dashboard → Project Settings → Environment Variables and add these:

### For Production Environment:

| Variable Name | Value |
|---------------|-------|
| `VITE_ADSENSE_PUBLISHER_ID` | `ca-pub-5506438806314781` |
| `VITE_ADSENSE_HEADER_BANNER` | `9586077878` |
| `VITE_ADSENSE_SIDEBAR_SKYSCRAPER` | `8151940224` |
| `VITE_ADSENSE_CONTENT_RECTANGLE` | `1707587859` |
| `VITE_ADSENSE_FOOTER_BANNER` | `3546766216` |
| `VITE_ADSENSE_MOBILE_BANNER` | `5122452205` |
| `VITE_ADSENSE_IN_FEED_NATIVE` | `6408743271` |
| `VITE_ADSENSE_IN_ARTICLE_NATIVE` | `4668276193` |
| `VITE_ADSENSE_MAIN_DISPLAY` | `2894237519` |
| `NODE_ENV` | `production` |
| `VITE_NODE_ENV` | `production` |

## Quick Vercel CLI Setup

If you have Vercel CLI installed, you can run these commands:

```bash
# Set the main publisher ID
vercel env add VITE_ADSENSE_PUBLISHER_ID production --value="ca-pub-5506438806314781"

# Set all ad slot IDs
vercel env add VITE_ADSENSE_HEADER_BANNER production --value="9586077878"
vercel env add VITE_ADSENSE_SIDEBAR_SKYSCRAPER production --value="8151940224"
vercel env add VITE_ADSENSE_CONTENT_RECTANGLE production --value="1707587859"
vercel env add VITE_ADSENSE_FOOTER_BANNER production --value="3546766216"
vercel env add VITE_ADSENSE_MOBILE_BANNER production --value="5122452205"
vercel env add VITE_ADSENSE_IN_FEED_NATIVE production --value="6408743271"
vercel env add VITE_ADSENSE_IN_ARTICLE_NATIVE production --value="4668276193"
vercel env add VITE_ADSENSE_MAIN_DISPLAY production --value="2894237519"

# Set environment
vercel env add NODE_ENV production --value="production"
vercel env add VITE_NODE_ENV production --value="production"
```

## After Setting Environment Variables

1. Redeploy your application: `vercel --prod`
2. The ads should now appear on your live site
3. Check browser console for any AdSense-related errors

## Files Updated

- ✅ `.env` - Created with all required variables
- ✅ `src/components/ResponsiveAd.jsx` - Fixed development mode detection
- ✅ `src/components/AdManager.jsx` - Added fallback handling
- ✅ `public/ads.txt` - Already correctly configured

## Verification

Once deployed, you should see:
- Real AdSense ads on your production site
- Placeholder boxes on localhost/development
- No more "Ad content temporarily unavailable" messages
