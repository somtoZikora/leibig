# Netlify Deployment Guide

## Environment Variables Configuration

The Netlify build is failing because required environment variables are missing. Follow these steps to configure them:

### 1. Access Netlify Dashboard
- Go to your Netlify site dashboard
- Navigate to **Site settings** > **Environment variables**

### 2. Add Required Environment Variables

Copy and configure these variables from your local `.env` file:

#### ✅ **Essential Variables (Required for build)**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=2hqr3d91
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=[your_sanity_write_token]
```

#### ✅ **Authentication Variables (Required for app functionality)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your_clerk_publishable_key]
CLERK_SECRET_KEY=[your_clerk_secret_key]
```

#### ✅ **Payment Variables (Required for checkout)**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=[your_paypal_client_id]
PAYPAL_CLIENT_SECRET=[your_paypal_client_secret]
PAYPAL_ENVIRONMENT=live
```

#### 🔧 **Optional Variables (For Winestro integration)**
```
WINESTRO_API_URL=https://api.winestro.com/v1
WINESTRO_API_KEY=[your_winestro_api_key]
SYNC_SCHEDULE_TOKEN=[your_sync_token]
WINESTRO_WEBHOOK_SECRET=[your_webhook_secret]
```

### 3. Build Configuration

Ensure your Netlify build settings are:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18.x` (set in netlify.toml)

### 4. Deploy

After adding all environment variables:
1. Click **Deploy site** or trigger a new build
2. Monitor the build logs for any remaining issues

## Common Issues

### Error: "Missing projectId parameter"
- ✅ **Solution**: Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID=2hqr3d91` is set in Netlify
- ⚠️ **Note**: No quotes around the value in Netlify dashboard

### Error: "Build script returned non-zero exit code: 2"
- ✅ **Solution**: Check all required environment variables are set
- ✅ **Solution**: Verify TypeScript compilation passes locally

### Error: Permission issues with .next directory
- ✅ **Solution**: This is handled automatically by Netlify's build environment

## Environment Variable Security

- **Public variables** (prefixed with `NEXT_PUBLIC_`): Safe to expose, used in frontend
- **Secret variables**: Server-side only, never exposed to browser
- **Never commit** `.env` files to git - they're ignored for security

## Testing Deployment

After successful deployment, test:
1. ✅ Site loads without errors
2. ✅ Authentication works (Clerk)
3. ✅ Products load from Sanity
4. ✅ PayPal checkout functions
5. ✅ API routes respond correctly