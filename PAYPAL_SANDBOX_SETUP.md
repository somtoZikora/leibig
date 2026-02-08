# PayPal Sandbox Setup Guide

Complete guide for testing PayPal Express Checkout locally without real money.

---

## 🎯 Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get PayPal Sandbox credentials** (see below)

3. **Update `.env.local`** with your sandbox credentials

4. **Restart development server:**
   ```bash
   npm run dev
   ```

5. **Look for the yellow "🧪 SANDBOX MODE" indicator** on cart/checkout pages

---

## 📋 Step 1: Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account (or create one)
3. You'll be redirected to the developer dashboard

---

## 🔑 Step 2: Get Sandbox Credentials

### Create a Sandbox App

1. In the PayPal Developer Dashboard, click **"Apps & Credentials"**
2. Make sure you're on the **"Sandbox"** tab (not Live)
3. Click **"Create App"** button

4. **App Details:**
   - App Name: `Wine Shop Local Testing` (or any name)
   - App Type: **Merchant**
   - Click **"Create App"**

5. **Copy Credentials:**
   - **Client ID** - Copy this value
   - **Secret** - Click "Show" and copy this value

### Update .env.local

```env
# PayPal Sandbox Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID_HERE
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_SECRET_HERE
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox
```

---

## 👤 Step 3: Create Test Accounts

PayPal automatically creates test accounts, but you can create custom ones:

### View Default Test Accounts

1. In Developer Dashboard, click **"Testing Tools"** → **"Sandbox Accounts"**
2. You'll see default accounts:
   - **Personal Account** (Buyer) - For making payments
   - **Business Account** (Seller) - For receiving payments

### Account Details

Click on any account to see:
- Email address (for login)
- Password (for login)
- Account balance
- Profile details

### Default Test Account Example
```
Email: sb-buyer47@personal.example.com
Password: 12345678
Balance: $5,000 USD (virtual money)
```

### Create Custom Test Account (Optional)

1. Click **"Create Account"**
2. Choose **"Personal"** (for buyer account)
3. Fill in details:
   - Email prefix: `wine-test-buyer`
   - Password: (set your own)
   - Balance: `500 EUR`
4. Click **"Create Account"**

---

## 🧪 Step 4: Test the Integration

### Test Express Checkout (From Cart)

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Add items to cart:**
   - Add 6+ bottles to see Express Checkout
   - Navigate to `/cart`

3. **Verify Sandbox Mode:**
   - Look for yellow banner: **"🧪 SANDBOX MODE - Testumgebung"**

4. **Click PayPal Express Button:**
   - PayPal login popup appears
   - Login with **test buyer account** credentials
   - Select shipping address
   - Click **"Complete Purchase"**

5. **Verify Order Created:**
   - You're redirected to success page
   - Order appears in Sanity
   - Check developer dashboard for transaction

### Test Traditional Checkout

1. **Navigate to `/checkout`**
2. Fill out form with test data
3. Select **"PayPal"** payment method
4. See sandbox indicator
5. Complete payment with test account

### Test Bank Transfer

1. Navigate to `/checkout`
2. Select **"Vorkasse"** payment method
3. Complete order (no PayPal required)

---

## 💳 Test Credit Cards

PayPal Sandbox accepts test credit cards for testing different scenarios:

### Successful Payment
```
Card: 4032039847762449
Expiry: Any future date
CVV: Any 3 digits
```

### Declined Payment
```
Card: 4532063107267974
Expiry: Any future date
CVV: Any 3 digits
```

### More test cards: [PayPal Test Cards](https://developer.paypal.com/tools/sandbox/card-testing/)

---

## 🔍 Step 5: Debug & Monitor

### View Sandbox Transactions

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Click **"Testing Tools"** → **"Sandbox Accounts"**
3. Click on **Business Account** → **"View Profile"**
4. Login to sandbox PayPal
5. View transactions in account

### Check Logs

**Frontend Logs:**
```bash
# In browser console
# Look for PayPal SDK messages
```

**Backend Logs:**
```bash
# In terminal where dev server runs
# Look for:
🚀 Express Checkout API: Starting order creation...
✅ Order created in Sanity: <id>
📦 Creating order in Winestro...
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "PayPal is not available" | Check `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set |
| Button doesn't appear | Check console for errors, verify credentials |
| "Unauthorized" error | Make sure using SANDBOX credentials, not live |
| Payment succeeds but no order | Check API logs, verify Sanity connection |
| Winestro sync fails | Normal in dev, Winestro might need production URL |

---

## 🔄 Switch Between Sandbox and Live

### For Local Development (Sandbox)
`.env.local`:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<sandbox-client-id>
PAYPAL_CLIENT_SECRET=<sandbox-secret>
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox
```

### For Production (Live)
`.env` (or production environment):
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-secret>
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=live
```

### Deployment Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use different apps** for sandbox and live
3. **Verify environment** before deploying
4. **Test sandbox** before going live

---

## 📊 Test Scenarios Checklist

### Express Checkout
- [ ] Add 6+ bottles, see Express button
- [ ] Add <6 bottles, see warning message
- [ ] Click Express button, PayPal opens
- [ ] Login with test account
- [ ] Select shipping address from PayPal
- [ ] Complete payment
- [ ] Verify order created
- [ ] Verify redirect to success page
- [ ] Check order in Sanity Studio

### Traditional Checkout
- [ ] Fill out form completely
- [ ] Select PayPal payment method
- [ ] See sandbox indicator
- [ ] Complete payment
- [ ] Verify order created

### Guest Checkout
- [ ] Sign out (or incognito mode)
- [ ] Add items, go to checkout
- [ ] Complete order without account
- [ ] Verify order created with email only

### Error Handling
- [ ] Cancel payment in PayPal popup
- [ ] Use declined test card
- [ ] Try with invalid form data
- [ ] Test with empty cart
- [ ] Verify all error messages show

### Edge Cases
- [ ] Test with exactly 6 bottles
- [ ] Test with non-wine items only
- [ ] Test with multiple sizes
- [ ] Test with promo code applied
- [ ] Test mobile responsive design

---

## 🚀 Going Live

When ready to accept real payments:

1. **Get Live Credentials:**
   - In PayPal Developer Dashboard
   - Switch to **"Live"** tab
   - Create live app
   - Copy live credentials

2. **Update Production Environment:**
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-live-client-id>
   PAYPAL_CLIENT_SECRET=<your-live-secret>
   NEXT_PUBLIC_PAYPAL_ENVIRONMENT=live
   ```

3. **Remove Sandbox Indicator:**
   - The yellow banner automatically disappears in live mode

4. **Test with Small Purchase:**
   - Make a real test purchase with real money
   - Verify order flow end-to-end
   - Issue a refund if needed

5. **Monitor Transactions:**
   - Check PayPal business account regularly
   - Set up webhook notifications (optional)
   - Monitor for disputes/chargebacks

---

## 📚 Additional Resources

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal Sandbox Testing Guide](https://developer.paypal.com/tools/sandbox/)
- [PayPal Test Credit Cards](https://developer.paypal.com/tools/sandbox/card-testing/)
- [PayPal JavaScript SDK](https://developer.paypal.com/sdk/js/)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)

---

## 💡 Tips

1. **Keep sandbox accounts logged in** in a separate browser profile for quick testing
2. **Create multiple buyer accounts** to test different scenarios
3. **Monitor sandbox balance** - reset if running low
4. **Use realistic test data** to simulate production
5. **Test on mobile devices** - PayPal popup behaves differently
6. **Clear cache** if PayPal button doesn't update after env changes

---

## 🆘 Need Help?

- **PayPal Developer Support:** https://developer.paypal.com/support/
- **Community Forums:** https://www.paypal-community.com/
- **Issue Tracker:** Report bugs in your project repository

---

## ✅ Sandbox Setup Complete!

You're now ready to test PayPal Express Checkout locally without risking real money. Happy testing! 🎉
