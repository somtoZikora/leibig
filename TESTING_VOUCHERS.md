# Testing Discount Codes / Vouchers

This guide explains how to test the voucher validation system.

## Quick Start

### 1. Fetch Available Vouchers

Run this command to see all active vouchers from WINESTRO:

```bash
npm run fetch-vouchers
```

This displays:
- Voucher codes
- Discount type (fixed amount or percentage)
- Minimum order requirements
- Expiration dates
- Remaining uses
- Test examples

### 2. Current Active Vouchers

As of the implementation date, you have **3 active vouchers**:

| Code  | Discount | Min. Order | Expires    | Uses |
|-------|----------|------------|------------|------|
| 17528 | €8.00    | None       | 2027-03-31 | 1    |
| 13887 | €16.00   | None       | 2027-06-30 | 1    |
| 68083 | 10%      | None       | 2028-08-15 | 100  |

### 3. Test in Browser

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Add products to your cart

4. Go to cart page

5. Enter a voucher code (e.g., `68083`)

6. Click "Anwenden" or press Enter

7. Verify the discount appears

## Testing Scenarios

### ✅ Valid Voucher Test

**Test Code:** `68083` (10% discount)

1. Add products worth €100 to cart
2. Enter code `68083`
3. Click "Anwenden"
4. **Expected:** Success message, €10 discount applied
5. **Expected:** Discount shows in order summary with remove button

### ✅ Fixed Amount Voucher Test

**Test Code:** `17528` (€8 fixed)

1. Add any products to cart
2. Enter code `17528`
3. Click "Anwenden"
4. **Expected:** Success message, €8 discount applied
5. **Note:** This voucher only has 1 use remaining

### ❌ Invalid Code Test

**Test Code:** `INVALID123`

1. Add products to cart
2. Enter code `INVALID123`
3. Click "Anwenden"
4. **Expected:** Error message "Ungültiger Gutscheincode"

### ❌ Minimum Order Test

If a voucher has a minimum order requirement (none currently do):

1. Add products below the minimum
2. Enter the voucher code
3. **Expected:** Error message stating minimum not met

### 🔄 Remove Voucher Test

1. Apply a valid voucher
2. Click "Entfernen" or the × button
3. **Expected:** Discount removed, order total recalculated

### 🛒 Checkout with Voucher

1. Apply a valid voucher (e.g., `68083`)
2. Click "Zur Kasse gehen"
3. Complete checkout form
4. Submit order
5. **Expected:** Order created with discount applied
6. **Verify:** Check WINESTRO for order with voucher code

## Script Output Example

When you run `npm run fetch-vouchers`, you'll see:

```
🎫 Fetching active vouchers from WINESTRO...

✅ Found 3 active voucher(s):

────────────────────────────────────────────────────────

1. Voucher Code: 17528
   ├─ ID: 14
   ├─ Discount: €8.00 (fixed amount)
   ├─ Minimum Order: €0.00
   ├─ Expires: 2027-03-31
   └─ Remaining Uses: 1

   📝 Test Examples:
      • Valid: Order amount €10.00 (meets minimum)
      • Example: Any order → €8.00 discount

[... more vouchers ...]

📋 Codes for Copy-Paste Testing:
   17528
   13887
   68083
```

## Troubleshooting

### "Missing required environment variables"

Make sure your `.env` file has:
```env
WINESTRO_BASE_URL=https://nephele-s5.de/xml/v23.0/wbo-API.php
WINESTRO_UID=your_uid
WINESTRO_API_USER=your_api_user
WINESTRO_API_CODE=your_api_code
WINESTRO_SHOP_ID=1
```

### "No active vouchers found"

- Check WINESTRO admin panel
- Ensure vouchers are not expired
- Verify API credentials are correct

### Voucher not applying in cart

1. Check browser console for errors
2. Verify cart has items
3. Check if voucher meets minimum order amount
4. Ensure voucher hasn't expired
5. Check if voucher has uses remaining

## Creating New Test Vouchers

To create vouchers in WINESTRO for testing:

1. Log into WINESTRO Cloud
2. Navigate to **Orders → Private webshop → Voucher management**
3. Create a new voucher with:
   - **Code:** Any alphanumeric code
   - **Value:** Fixed amount (e.g., €10) OR
   - **Percentage:** Discount percentage (e.g., 20%)
   - **Minimum Order:** Optional (e.g., €50)
   - **Expiration Date:** Future date
   - **Uses:** Number of times it can be used

4. Save the voucher
5. Run `npm run fetch-vouchers` to verify it appears
6. Test in the application

## Notes

- Vouchers are validated in real-time against WINESTRO
- No caching - always fetches fresh data
- Voucher usage is tracked in WINESTRO
- Each use decrements the `nutzbar` (remaining uses) counter
- Expired vouchers are automatically filtered by WINESTRO API
