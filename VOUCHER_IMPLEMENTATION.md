# WINESTRO Voucher/Discount Code Implementation

This document describes the complete voucher validation system that validates discount codes against WINESTRO as the source of truth.

## Overview

The system validates discount codes (Gutschein) in real-time against the WINESTRO API, ensuring that only valid, active vouchers can be applied to orders. When an order is created, the voucher information is passed to WINESTRO for proper tracking and redemption.

## Architecture

### 1. **Voucher Service** (`lib/winestro-voucher.ts`)

The core service that communicates with WINESTRO API to fetch and validate vouchers.

**Key Features:**
- Fetches all active vouchers from WINESTRO using `getGutscheine` API action
- Validates voucher codes against multiple criteria:
  - Code exists and matches (case-insensitive)
  - Not expired (`gueltig_bis` date check)
  - Has remaining usages (`nutzbar > 0`)
  - Meets minimum order amount (`ab_wert`)
- Calculates discount amount (fixed value or percentage)
- Returns structured validation result

**Voucher Properties:**
- `code`: Voucher code string
- `wert`: Fixed monetary discount (EUR)
- `prozent`: Percentage discount (0-100)
- `ab_wert`: Minimum order amount required
- `gueltig_bis`: Expiration date (YYYY-MM-DD)
- `nutzbar`: Number of remaining uses

### 2. **API Endpoint** (`app/api/vouchers/validate/route.ts`)

REST API endpoint for validating voucher codes from the frontend.

**Endpoint:** `POST /api/vouchers/validate`

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "orderAmount": 89.90
}
```

**Response (Success):**
```json
{
  "valid": true,
  "voucher": {
    "code": "SUMMER2024",
    "percentage": 20,
    "minOrderAmount": 50,
    "expiresAt": "2024-12-31",
    "usagesRemaining": 100
  },
  "discount": 17.98
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": "Ungültiger Gutscheincode"
}
```

### 3. **Cart Store Integration** (`lib/store.ts`)

Extended the Zustand cart store to manage applied vouchers.

**New State:**
- `appliedVoucher`: Stores the currently applied voucher details
- Persisted to localStorage for session continuity

**New Actions:**
- `applyVoucher(voucher)`: Applies a validated voucher to the cart
- `removeVoucher()`: Removes the applied voucher
- `getVoucherDiscount()`: Returns the discount amount

### 4. **Cart Page** (`app/(client)/cart/page.tsx`)

Updated to validate vouchers against WINESTRO API.

**Changes:**
- Removed hardcoded voucher validation
- Calls `/api/vouchers/validate` with code and order amount
- Shows loading state during validation ("Überprüfen...")
- Displays applied voucher with discount details
- Shows voucher info in order summary with remove button
- Passes voucher to Express PayPal checkout

**User Flow:**
1. User enters voucher code
2. Clicks "Anwenden" or presses Enter
3. System validates against WINESTRO
4. Shows success/error message
5. Displays discount in order summary
6. Voucher can be removed at any time

### 5. **Order Creation**

#### Regular Checkout (`app/(client)/checkout/page.tsx`)
- Includes voucher code and discount in order data
- Passed to `/api/orders` endpoint

#### Express PayPal Checkout
- `components/ExpressPayPalButton.tsx`: Accepts and passes voucher info
- `app/api/orders/express-checkout/route.ts`: Handles voucher data

#### WINESTRO Order Service (`lib/winestro-order.ts`)
- Sends voucher information to WINESTRO when creating orders
- Uses `gutscheincode` and `gutscheinwert` parameters
- Updates `Gesamtrabatt` (total discount) field

**WINESTRO API Parameters:**
```javascript
{
  gutscheincode: "SUMMER2024",     // Voucher code
  gutscheinwert: "17.98",          // Discount amount
  Gesamtrabatt: "17.98"            // Total discount
}
```

## Validation Rules

The system enforces the following validation rules:

1. **Code Existence**: Voucher code must exist in WINESTRO's active vouchers
2. **Expiration**: Current date must be before or on `gueltig_bis` date
3. **Usage Limit**: `nutzbar` must be greater than 0
4. **Minimum Order**: Order subtotal must meet or exceed `ab_wert` (if specified)
5. **Case Insensitive**: Voucher codes are matched case-insensitively

## Error Messages

User-friendly German error messages:
- `"Ungültiger Gutscheincode"` - Code not found
- `"Dieser Gutschein ist abgelaufen"` - Expired voucher
- `"Dieser Gutschein wurde bereits vollständig eingelöst"` - No uses remaining
- `"Mindestbestellwert von €XX.XX nicht erreicht"` - Order too small
- `"Fehler bei der Überprüfung des Gutscheincodes"` - API/system error

## Environment Variables

Required environment variables (already configured):
```env
WINESTRO_BASE_URL=https://nephele-s5.de/xml/v23.0/wbo-API.php
WINESTRO_UID=your_uid
WINESTRO_API_USER=your_api_user
WINESTRO_API_CODE=your_api_code
WINESTRO_SHOP_ID=1
```

## Testing

### Fetch Available Vouchers

Run the fetch script to see all active vouchers in WINESTRO:

```bash
npm run fetch-vouchers
# or
node scripts/fetch-vouchers.mjs
```

This will display all active vouchers with their codes, discount amounts, expiration dates, and test examples.

### Current Test Vouchers (as of implementation)

Your WINESTRO instance has these active vouchers:

1. **Code: 17528**
   - Discount: €8.00 fixed
   - Expires: 2027-03-31
   - Uses remaining: 1

2. **Code: 13887**
   - Discount: €16.00 fixed
   - Expires: 2027-06-30
   - Uses remaining: 1

3. **Code: 68083**
   - Discount: 10% percentage
   - Expires: 2028-08-15
   - Uses remaining: 100

### Manual Testing Steps

1. **Run the application:**
   ```bash
   npm run dev
   ```

2. **Test in the application:**
   - Add products to cart (ensure subtotal is enough for any minimum order requirements)
   - Enter one of the voucher codes above
   - Click "Anwenden" to validate
   - Verify discount is applied correctly
   - Complete checkout (use sandbox/test mode)
   - Check WINESTRO for order with voucher applied

3. **Test validation rules:**
   - Try an expired voucher (expect error)
   - Try a non-existent code (expect "Ungültiger Gutscheincode")
   - Try with order below minimum (if applicable)
   - Try removing and re-applying voucher

## Benefits

1. **Single Source of Truth**: WINESTRO is the authoritative source for vouchers
2. **Real-time Validation**: No stale or invalid vouchers can be used
3. **Automatic Enforcement**: Usage limits, expiration, and minimums enforced
4. **Proper Tracking**: Voucher usage recorded in WINESTRO
5. **Centralized Management**: All vouchers managed in one place (WINESTRO)

## Future Enhancements

Potential improvements:
- Cache active vouchers for better performance (with TTL)
- Admin interface to view voucher usage statistics
- Support for product-specific vouchers
- Voucher usage history for customers
- Automated voucher generation
