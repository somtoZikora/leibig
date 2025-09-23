# 🔧 Vercel Environment Variables Setup Guide

## ⚠️ **Critical: This must be done BEFORE deployment succeeds**

The build error `Configuration must contain projectId` occurs because environment variables are not configured in Vercel.

## 📋 **Step-by-Step Fix**

### 1. **Go to Vercel Dashboard**
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Find your `wineshop` or `leibig` project
- Click on the project name

### 2. **Access Environment Variables**
- Click **Settings** tab
- Click **Environment Variables** in the left sidebar

### 3. **Add Required Variables**

Add these **EXACT** variables (copy and paste each line):

#### **Essential Variables (Build will fail without these)**
```
Name: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: 2hqr3d91
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SANITY_DATASET  
Value: production
Environment: Production, Preview, Development
```

```
Name: SANITY_API_TOKEN
Value: skbnX9WHmYtYpc2uLtyf7hmz5hHhWM23zhGRGKameGtko06kJzy39tGyWAjx1DQL3FerZ7Rju4If0yP0zaQvet7JRejn3rAp4EXEnTUrowVw1Ur7bzuA6qNeyFAAZUyYoYLqiJpIwGinPpP0atkoPy2DKIQptNPILdfpaB8u4VIcbYLfIvBn
Environment: Production, Preview, Development
```

#### **Authentication Variables (Required for app to work)**
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_dWx0aW1hdGUtcmVwdGlsZS0zLmNsZXJrLmFjY291bnRzLmRldiQ
Environment: Production, Preview, Development
```

```
Name: CLERK_SECRET_KEY
Value: sk_test_DHVCfU0dK0Mr4e4tGJoAr4bFsaJKwNiDPm8C0ena3R
Environment: Production, Preview, Development
```

#### **Payment Variables (Required for checkout)**
```
Name: NEXT_PUBLIC_PAYPAL_CLIENT_ID
Value: AWlrIQDi9lIDa5vu2S5dImeyId9TJBdDCW7CTVOhkcZRa_juty0RMi49fEZZQdsMrLdzdawgxN-cSGid
Environment: Production, Preview, Development
```

```
Name: PAYPAL_CLIENT_SECRET
Value: EN-DOTI8hLCpCad_2ShMmdV-Mjnck9EGUS0NVXqwj_Qzuae7q4vNuY_ELKJ9m__DiaVo44bj1maBzPD0
Environment: Production, Preview, Development
```

```
Name: PAYPAL_ENVIRONMENT
Value: live
Environment: Production, Preview, Development
```

### 4. **Optional Variables (Winestro Integration)**
```
Name: WINESTRO_API_URL
Value: https://api.winestro.com/v1
Environment: Production, Preview, Development
```

```
Name: WINESTRO_API_KEY
Value: your-winestro-api-key-here
Environment: Production, Preview, Development
```

```
Name: SYNC_SCHEDULE_TOKEN
Value: your-secret-sync-token-here
Environment: Production, Preview, Development
```

```
Name: WINESTRO_WEBHOOK_SECRET
Value: your-webhook-secret-here
Environment: Production, Preview, Development
```

### 5. **Redeploy After Adding Variables**

After adding ALL environment variables:

#### Option A: Automatic Redeploy
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment
- ✅ Build should now succeed

#### Option B: Push to GitHub
- The latest code changes will trigger automatic redeploy
- ✅ Build should now succeed

## 🔍 **Verification Checklist**

After successful deployment, verify:

- ✅ **Build succeeds** without projectId errors
- ✅ **Site loads** at your Vercel URL
- ✅ **Products display** (Sanity connection working)
- ✅ **Authentication works** (Clerk integration)
- ✅ **API routes respond** (check /api/test-sanity)

## 🚨 **Common Mistakes to Avoid**

❌ **Don't add quotes** around environment variable values in Vercel  
❌ **Don't forget** to select all environments (Production, Preview, Development)  
❌ **Don't use** placeholder values for real variables  
❌ **Don't skip** the redeploy step after adding variables  

## 🎯 **Expected Result**

After following these steps:
- ✅ Build will complete successfully
- ✅ All API routes will work
- ✅ Sanity CMS integration will function
- ✅ Authentication will work
- ✅ PayPal payments will process

## 📞 **If Still Having Issues**

1. **Double-check variable names** - they must match exactly
2. **Verify all environments selected** - Production, Preview, Development
3. **Check build logs** in Vercel for specific error messages
4. **Test locally** to ensure environment variables work: `npm run build`