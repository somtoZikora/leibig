# PayPal Sandbox - Quick Start 🚀

**5-Minute Setup for Local Testing**

---

## ⚡ Fast Setup (3 Steps)

### 1. Copy Environment File
```bash
cp .env.local.example .env.local
```

### 2. Get PayPal Sandbox Credentials

**Visit:** https://developer.paypal.com/dashboard/

1. Login/Signup
2. Click **"Apps & Credentials"** → **"Sandbox"** tab
3. Click **"Create App"**
4. Name: `Wine Shop Testing`
5. Copy **Client ID** and **Secret**

### 3. Update `.env.local`

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<paste-sandbox-client-id>
PAYPAL_CLIENT_SECRET=<paste-sandbox-secret>
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox
```

**Restart dev server:**
```bash
npm run dev
```

---

## 🧪 Test It

1. **Go to:** http://localhost:3000/cart
2. **Add:** 6+ bottles
3. **Look for:** Yellow "🧪 SANDBOX MODE" banner
4. **Click:** PayPal Express button
5. **Use test account** (see below)

---

## 👤 Default Test Accounts

PayPal creates these automatically:

### Buyer Account (For Testing Payments)
```
Email: sb-xxxxx47@personal.example.com
Password: (see dashboard)
Balance: $5,000 USD (fake money)
```

**Find your accounts:**
https://developer.paypal.com/dashboard → **"Testing Tools"** → **"Sandbox Accounts"**

Click on any account to see email/password.

---

## 💳 Test Credit Cards

### Success Card
```
Card: 4032 0398 4776 2449
Expiry: 12/2028
CVV: 123
```

### Declined Card
```
Card: 4532 0631 0726 7974
Expiry: 12/2028
CVV: 123
```

---

## ✅ Verify Sandbox Mode

You should see these indicators when in sandbox:

### Cart Page
```
┌────────────────────────────────┐
│ 🧪 SANDBOX MODE - Testumgebung │
│ [PayPal Checkout Button]       │
└────────────────────────────────┘
```

### Checkout Page
```
┌────────────────────────────────┐
│ 🧪 SANDBOX MODE - Testumgebung │
│ [PayPal Button]                │
└────────────────────────────────┘
```

**No yellow banner?** → Check environment variables and restart server.

---

## 🔍 Debug Issues

### PayPal Button Not Showing
```bash
# Check environment variable is set:
echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID

# Restart dev server:
npm run dev
```

### "PayPal is not available"
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is in `.env.local`
- Make sure it starts with `NEXT_PUBLIC_`
- Restart dev server

### Payment Works But No Order Created
- Check terminal logs for errors
- Verify Sanity connection
- Check `/api/orders/express-checkout` endpoint logs

---

## 🎯 Test Checklist

Quick tests to verify everything works:

- [ ] Yellow sandbox indicator appears
- [ ] PayPal button renders
- [ ] Can click button → popup opens
- [ ] Can login with test account
- [ ] Can select address and pay
- [ ] Redirects to success page
- [ ] Order appears in Sanity Studio

---

## 🚀 Going Live

When ready for production:

**Get Live Credentials:**
https://developer.paypal.com/dashboard → **"Live"** tab

**Update Production `.env`:**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-secret>
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=live
```

Yellow sandbox banner disappears automatically! ✨

---

## 📖 Full Documentation

See `PAYPAL_SANDBOX_SETUP.md` for complete guide.

---

## 🆘 Quick Links

- **PayPal Dashboard:** https://developer.paypal.com/dashboard/
- **Test Accounts:** https://developer.paypal.com/dashboard → Testing Tools
- **API Docs:** https://developer.paypal.com/docs/
- **Support:** https://developer.paypal.com/support/

---

**Happy Testing!** 🎉
