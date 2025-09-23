# Vercel Deployment Guide

## Quick Start - Deploy to Vercel

Vercel is the optimal platform for Next.js applications with seamless integration and automatic optimizations.

### Method 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy from project directory
```bash
vercel
```

### Method 2: Deploy via GitHub Integration

#### 1. Visit [vercel.com](https://vercel.com)
#### 2. Click "New Project"
#### 3. Import your GitHub repository: `https://github.com/azizsilva/leibig.git`
#### 4. Configure project settings (auto-detected for Next.js)

## Environment Variables Configuration

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### ✅ **Essential Variables (Required for build)**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=2hqr3d91
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skbnX9WHmYtYpc2uLtyf7hmz5hHhWM23zhGRGKameGtko06kJzy39tGyWAjx1DQL3FerZ7Rju4If0yP0zaQvet7JRejn3rAp4EXEnTUrowVw1Ur7bzuA6qNeyFAAZUyYoYLqiJpIwGinPpP0atkoPy2DKIQptNPILdfpaB8u4VIcbYLfIvBn
```

#### ✅ **Authentication Variables (Required for app functionality)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dWx0aW1hdGUtcmVwdGlsZS0zLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_DHVCfU0dK0Mr4e4tGJoAr4bFsaJKwNiDPm8C0ena3R
```

#### ✅ **Payment Variables (Required for checkout)**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AWlrIQDi9lIDa5vu2S5dImeyId9TJBdDCW7CTVOhkcZRa_juty0RMi49fEZZQdsMrLdzdawgxN-cSGid
PAYPAL_CLIENT_SECRET=EN-DOTI8hLCpCad_2ShMmdV-Mjnck9EGUS0NVXqwj_Qzuae7q4vNuY_ELKJ9m__DiaVo44bj1maBzPD0
PAYPAL_ENVIRONMENT=live
```

#### 🔧 **Optional Variables (For Winestro integration)**
```
WINESTRO_API_URL=https://api.winestro.com/v1
WINESTRO_API_KEY=your-winestro-api-key-here
SYNC_SCHEDULE_TOKEN=your-secret-sync-token-here
WINESTRO_WEBHOOK_SECRET=your-webhook-secret-here
```

## Vercel Configuration

### Automatic Configuration
Vercel automatically detects Next.js projects and configures:
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Node.js Version: Latest LTS
- ✅ Serverless Functions: Auto-enabled for API routes

### Custom Configuration (Optional)
Create `vercel.json` if you need custom settings:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Deployment Steps

### Step 1: Choose Deployment Method

#### Option A: CLI Deployment
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel login`
3. Run: `vercel` (from project root)
4. Follow prompts to configure project

#### Option B: GitHub Integration
1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect GitHub account
3. Import repository: `azizsilva/leibig`
4. Deploy automatically

### Step 2: Configure Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables listed above
5. Set environment: Production, Preview, Development (as needed)

### Step 3: Deploy
- **Auto-deployment**: Every push to main branch triggers deployment
- **Manual deployment**: Use `vercel --prod` command
- **Preview deployments**: Every PR gets a preview URL

## Advantages of Vercel for This Project

### ✅ **Perfect Next.js Integration**
- Zero-config deployment
- Automatic optimization
- Built-in performance monitoring

### ✅ **Serverless Functions**
- API routes work seamlessly
- Automatic scaling
- Global edge network

### ✅ **Developer Experience**
- Instant preview deployments
- Git integration
- Real-time collaboration

### ✅ **Performance**
- Automatic image optimization
- Edge caching
- Fast global CDN

## Testing Deployment

After successful deployment, verify:

1. ✅ **Site loads**: Visit your Vercel URL
2. ✅ **Environment variables**: Check API functionality
3. ✅ **Authentication**: Test Clerk login/signup
4. ✅ **Database**: Verify Sanity CMS connection
5. ✅ **Payments**: Test PayPal integration
6. ✅ **API routes**: Check all endpoints respond

## Domain Configuration

### Custom Domain Setup
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate auto-provisioned

### Domain Examples
- Default: `your-project.vercel.app`
- Custom: `yourdomain.com`

## Monitoring & Analytics

Vercel provides built-in:
- ✅ Performance analytics
- ✅ Error tracking
- ✅ Usage metrics
- ✅ Function logs

## Troubleshooting

### Common Issues

#### Build Failures
- **Solution**: Check environment variables are set
- **Solution**: Verify TypeScript compilation locally

#### Function Timeouts
- **Solution**: Optimize API route performance
- **Solution**: Use appropriate function regions

#### Environment Variable Issues
- **Solution**: Ensure correct variable names
- **Solution**: Check production/preview/development settings

## Migration from Netlify

If you previously configured Netlify:
1. ✅ Remove `netlify.toml` (not needed for Vercel)
2. ✅ Copy environment variables to Vercel
3. ✅ Update any hardcoded Netlify URLs
4. ✅ Update DNS if using custom domain

## Support

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 [Report Issues](https://github.com/vercel/vercel/issues)