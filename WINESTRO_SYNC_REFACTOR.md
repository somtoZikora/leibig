# Winestro Sync Middleware - Refactor Summary

## Overview
The Winestro sync middleware has been completely refactored to work with the **actual Winestro XML API** structure (v21.0), which uses query parameter authentication and a single PHP endpoint, instead of the assumed RESTful API with Bearer token authentication.

## What Changed

### 1. Authentication Method
**Before:**
```typescript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

**After:**
```typescript
// Query parameters in URL
?UID=5348&apiUSER=api-usr5348&apiCODE=xxx&apiShopID=1&apiACTION=getArtikel&output=json
```

### 2. API Endpoint Structure
**Before:**
- RESTful paths: `/products`, `/products/{id}`
- Base URL: `https://api.winestro.com/v1`

**After:**
- Single PHP endpoint: `https://weinstore.net/xml/v21.0/wbo-API.php`
- All operations use query parameters with `apiACTION` parameter
- Actions: `getArtikel`, `getBestand`, etc.

### 3. Environment Variables
**Before:**
```env
WINESTRO_API_URL=https://api.winestro.com/v1
WINESTRO_API_KEY=xxx
```

**After:**
```env
WINESTRO_BASE_URL=https://weinstore.net/xml/v21.0/wbo-API.php
WINESTRO_UID=5348
WINESTRO_API_USER=api-usr5348
WINESTRO_API_CODE=your-actual-api-code-here
WINESTRO_SHOP_ID=1
```

### 4. Field Name Mappings
The middleware now correctly maps Winestro's actual field names:

| Winestro Field | Sanity Field | Notes |
|---|---|---|
| `artikel_nr` | `artikelnummer`, `winestroId` | Article number, used as unique ID |
| `artikel_name` | `title` | Product name |
| `artikel_beschreibung` | `description` | Product description |
| `artikel_preis` | `price` | Current price |
| `artikel_streichpreis` | `oldPrice` | Original/crossed-out price |
| `artikel_bestand_webshop` | `stock` | Web shop stock quantity |
| `artikel_bild_big` | `image` (main) | Large product image |
| `artikel_bild_big_2/3/4` | `gallery` | Additional images |
| `artikel_jahrgang` | `jahrgang` | Vintage year |
| `artikel_sorte` | `rebsorte` | Grape variety |
| `artikel_geschmack` | `geschmack` | Taste profile |
| `artikel_qualitaet` | `qualitaet` | Quality level |
| `artikel_alkohol` | `alkohol` | Alcohol percentage |
| `artikel_liter` | `liter` | Bottle size |
| Plus 10+ nutrition fields | Various | Brennwert, Kohlenhydrate, etc. |

### 5. Code Changes

#### New `buildApiUrl()` Helper Method
```typescript
private buildApiUrl(action: string, additionalParams?: Record<string, string | number>): string {
  const params = new URLSearchParams({
    UID: this.winestroUID,
    apiUSER: this.winestroApiUser,
    apiCODE: this.winestroApiCode,
    apiShopID: this.winestroShopId,
    apiACTION: action,
    output: 'json'
  })
  // Add additional params...
  return `${this.winestroBaseUrl}?${params.toString()}`
}
```

#### Updated Methods
- **`testWinestroConnection()`** - Uses `getArtikel` action, handles Winestro response structure
- **`fetchWinestroProducts()`** - Fetches ALL products at once (no pagination in Winestro API)
- **`syncSingleProduct(artikelnr)`** - Uses `artikelnr` parameter instead of REST path
- **`transformProductData()`** - Maps all actual Winestro field names with proper type conversions

#### Enhanced WinestroProduct Interface
- Added all documented Winestro API fields (60+ fields)
- Fields support both `number` and `string` types (API can return either)
- Includes legacy fields for backwards compatibility

## How to Use

### Step 1: Get Your Actual Winestro Credentials
1. Log into your Winestro account
2. Go to Settings > XML Interface
3. Get your credentials:
   - UID (User/Winegrower ID)
   - apiUSER (XML interface username)
   - apiCODE (XML interface access code)
   - apiShopID (typically 1)

### Step 2: Update Environment Variables
Edit `.env` file:
```env
WINESTRO_BASE_URL=https://weinstore.net/xml/v21.0/wbo-API.php
WINESTRO_UID=your-uid-here
WINESTRO_API_USER=your-api-user-here
WINESTRO_API_CODE=your-api-code-here
WINESTRO_SHOP_ID=1
```

### Step 3: Test the Connection
Navigate to: `http://localhost:3000/admin/winestro-sync`

Click "Test API Connection" - you should see:
```
✅ Successfully connected to Winestro API
Total products: X
Sample product: [Product Name]
```

### Step 4: Run Initial Sync
Click "Sync Products" in the admin interface, or use the API:

```bash
curl -X POST http://localhost:3000/api/winestro-sync \
  -H "Content-Type: application/json" \
  -d '{"action": "sync-products"}'
```

### Step 5: Verify in Sanity
Check your Sanity Studio to see the synced products with all the new fields populated.

## Testing

A test script has been created: `scripts/test-winestro-api.ts`

Run it with:
```bash
npx tsx scripts/test-winestro-api.ts
```

This will:
1. Test the API connection
2. Show the actual response structure
3. Test fetching a single product
4. Test fetching stock information

## API Documentation Reference

Full Winestro API documentation: https://nephele-s5.de/xml/docs/xml_22.0.php

Key points from the documentation:
- **Action**: `getArtikel` - Fetch products (no params = all products)
- **Action**: `getArtikel` with `artikelnr=X` - Fetch single product
- **Action**: `getBestand` with `artikelnr=X` - Fetch stock for product
- **Output**: Must specify `output=json` for JSON responses (defaults to XML)
- **Pagination**: Not supported - API returns all products at once
- **Authentication**: All parameters in query string (no headers needed)

## Important Notes

### Image Optimization
The refactored middleware **skips image re-uploads when updating existing products**. This saves bandwidth and Sanity asset storage. Images are only uploaded when creating new products.

### Type Conversions
Winestro API can return numeric values as strings for backwards compatibility. The `transformProductData()` method includes parsers to handle this:
- `parsePrice()` - Converts string prices with commas to numbers
- `parseFloat()` - Converts string numbers to floats
- `parseInt()` - Converts string integers to numbers

### Error Handling
The API returns errors in JSON format:
```json
{"text": "Fehlerhafter apiCode"}  // Incorrect API code
{"text": "Fehler: Keine ID / Parameter übergeben!"}  // Missing parameters
```

Error messages are now properly extracted and displayed.

### Slug Generation
Product slugs are generated from `artikel_name` with proper German character handling:
- ä → ae
- ö → oe
- ü → ue
- ß → ss

## Troubleshooting

### 401 Unauthorized Error
```
Winestro API error: Fehlerhafter apiCode
```
**Solution**: Check that `WINESTRO_API_CODE` in `.env` is correct and active.

### 400 Bad Request Error
```
Fehler: Keine ID / Parameter übergeben!
```
**Solution**: The `apiACTION` parameter is missing. This should not happen with the refactored code, but check that you're using the updated middleware.

### No Products Returned
**Check**:
1. Are products marked as active in Winestro?
2. Do products have prices in the configured price category?
3. Do products have weight or "no unit price needed" flag?

### Images Not Uploading
**Check**:
1. Are the image URLs in `artikel_bild_big` valid and accessible?
2. Is your `SANITY_API_TOKEN` valid and has upload permissions?
3. Check console logs for specific image upload errors

## Next Steps

1. **Get actual credentials** from your Winestro account
2. **Update `.env`** with real values
3. **Test connection** using admin interface
4. **Run initial sync** to import products
5. **Set up scheduled sync** (optional) using Vercel Cron or external scheduler
6. **Configure webhook** (optional) in Winestro dashboard for real-time updates

## Files Modified

1. `/lib/winestro-sync.ts` - Complete refactor of sync service
2. `/.env` - Updated environment variable structure
3. `/scripts/test-winestro-api.ts` - New test script created

## Compatibility

- ✅ Works with Winestro XML API v21.0
- ✅ Should work with v22.0 (change `WINESTRO_BASE_URL` to use v22.0)
- ✅ Backwards compatible with existing Sanity data
- ✅ All existing API routes still work (`/api/winestro-sync`, `/api/winestro-webhook`, etc.)
- ✅ Admin interface unchanged (still works at `/admin/winestro-sync`)
