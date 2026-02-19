# Discount Code Flow - How It Works

This document explains how discount codes flow through the entire system from cart to WINESTRO.

## Flow Overview

```
Cart Page → Validate with WINESTRO → Apply to Cart Store → Checkout Page → Order Creation → WINESTRO Order
```

## Step-by-Step Flow

### 1. **Cart Page** (`app/(client)/cart/page.tsx`)

**User enters code:**
- User types voucher code in input field
- Clicks "Anwenden" or presses Enter

**Validation:**
```javascript
// Line 70-123: handleApplyPromoCode()
const response = await fetch('/api/vouchers/validate', {
  method: 'POST',
  body: JSON.stringify({
    code: promoCode.trim(),
    orderAmount: subtotal  // Current cart subtotal
  })
})
```

**Apply to cart:**
```javascript
// Line 95-105: If valid, apply to cart store
const voucherToApply: AppliedVoucher = {
  code: data.voucher.code,
  value: data.voucher.value,
  percentage: data.voucher.percentage,
  minOrderAmount: data.voucher.minOrderAmount,
  expiresAt: data.voucher.expiresAt,
  usagesRemaining: data.voucher.usagesRemaining,
  discountAmount: data.discount || 0
}

applyVoucher(voucherToApply)  // Stores in Zustand + localStorage
```

**Display discount:**
```javascript
// Line 376-394: Shows in order summary
{voucherDiscount > 0 && appliedVoucher && (
  <div className="flex justify-between text-green-600">
    <span>Gutschein ({appliedVoucher.code})</span>
    <span>-{formatPrice(voucherDiscount)}</span>
  </div>
)}
```

---

### 2. **API Validation** (`app/api/vouchers/validate/route.ts`)

**Receives request:**
```javascript
POST /api/vouchers/validate
{
  "code": "68083",
  "orderAmount": 100
}
```

**Validates with WINESTRO:**
```javascript
// Line 45: Uses WinestroVoucherService
const voucherService = new WinestroVoucherService()
const result = await voucherService.validateVoucher(code, orderAmount)
```

**Returns result:**
```javascript
// Success
{
  "valid": true,
  "voucher": {
    "code": "68083",
    "percentage": 10,
    "minOrderAmount": 0,
    "expiresAt": "2028-08-15",
    "usagesRemaining": 100
  },
  "discount": 10.00
}

// Error
{
  "valid": false,
  "error": "Ungültiger Gutscheincode"
}
```

---

### 3. **Cart Store** (`lib/store.ts`)

**State management:**
```javascript
// Line 109: Store state
appliedVoucher: AppliedVoucher | null

// Line 185-192: Actions
applyVoucher: (voucher: AppliedVoucher) => void
removeVoucher: () => void
getVoucherDiscount: () => number
```

**Persisted to localStorage:**
```javascript
// Line 320-324: Zustand persistence
{
  items: state.items,
  wishlist: state.wishlist,
  appliedVoucher: state.appliedVoucher  // ← Saved to localStorage
}
```

---

### 4. **Checkout Page** (`app/(client)/checkout/page.tsx`)

**Reads discount from store:**
```javascript
// Line 46-54: Get discount data
const {
  items,
  appliedVoucher,
  getTotalPrice,
  getVoucherDiscount
} = useCartData()

const subtotal = getTotalPrice()
const voucherDiscount = getVoucherDiscount()  // Amount to subtract
const total = subtotal - voucherDiscount + shipping
```

**Displays in order summary:**
```javascript
// Line 835-840: Shows discount line
{voucherDiscount > 0 && appliedVoucher && (
  <div className="flex justify-between text-green-600">
    <span>Gutschein ({appliedVoucher.code})</span>
    <span>-{formatPrice(voucherDiscount)}</span>
  </div>
)}
```

**Includes in order data:**
```javascript
// Line 242-244: Order creation
const orderData = {
  // ... other fields
  subtotal,
  discount: voucherDiscount,        // ← Discount amount
  voucherCode: appliedVoucher?.code, // ← Voucher code
  shipping,
  total,
  // ...
}
```

---

### 5. **Order Creation** (`app/api/orders/route.ts`)

**Receives order with discount:**
```javascript
// Order data includes:
{
  subtotal: 100.00,
  discount: 10.00,
  voucherCode: "68083",
  shipping: 7.90,
  total: 97.90
}
```

**Creates in WINESTRO:**
```javascript
// Line 70-73: Calls WinestroOrderService
const winestroService = new WinestroOrderService()
const winestroResult = await winestroService.createOrder(orderData)
```

---

### 6. **WINESTRO Order Service** (`lib/winestro-order.ts`)

**Transforms order data:**
```javascript
// Line 340-343: Add discount to params
params.Gesamtrabatt = order.discount ? order.discount.toFixed(2) : "0"

// Line 345-349: Add voucher if provided
if (order.voucherCode && order.discount) {
  params.gutscheincode = order.voucherCode    // "68083"
  params.gutscheinwert = order.discount.toFixed(2)  // "10.00"
}
```

**Sends to WINESTRO API:**
```javascript
// API parameters sent:
{
  // ... customer & product data
  zahlungsart: 4,           // Payment method
  versandkosten: "7.90",    // Shipping
  gebuehr: "0",             // Fee
  Gesamtrabatt: "10.00",    // ← Total discount
  gutscheincode: "68083",   // ← Voucher code
  gutscheinwert: "10.00",   // ← Voucher value
  // ...
}
```

---

## Summary

**Data stored in cart:**
- Voucher code
- Discount amount (fixed or calculated %)
- Voucher metadata (expiry, uses, min order)

**Displayed to user:**
- Cart page: Shows discount in summary with remove button
- Checkout page: Shows discount line with voucher code
- Total price reflects discount

**Sent to WINESTRO:**
- `gutscheincode`: The voucher code (e.g., "68083")
- `gutscheinwert`: The discount amount (e.g., "10.00")
- `Gesamtrabatt`: Total discount amount

**WINESTRO records:**
- Order with voucher applied
- Decrements voucher usage count
- Tracks discount in order history

## Testing

1. Add products to cart
2. Enter code `68083`
3. See discount in cart: `-€10.00` (or 10% of subtotal)
4. Go to checkout
5. See discount displayed: `Gutschein (68083) -€10.00`
6. Complete order
7. Check WINESTRO: Order shows voucher code and discount applied
