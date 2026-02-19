# Facebook Commerce Catalog Field Mapping

This document maps Sanity product/bundle fields to Facebook Commerce catalog fields.

## Overview

Facebook Commerce requires specific fields in CSV format for product catalog uploads. This mapping ensures your wine products and bundles are properly represented in Facebook's catalog system.

## Required Fields (✓ = Mapped)

### Core Product Information

| Facebook Field | Sanity Field (Product) | Sanity Field (Bundle) | Notes |
|----------------|------------------------|----------------------|-------|
| ✓ `id` | `_id` | `_id` | Unique Sanity document ID |
| ✓ `title` | `title` | `title` | Product/bundle name (max 200 chars) |
| ✓ `description` | `description` + wine details | `description` | Rich text converted to plain text. For products, includes vintage, grape variety, alcohol %, bottle size, etc. (max 9999 chars) |
| ✓ `availability` | Based on `stock` and `isArchived` | `"in stock"` (default) | "in stock" if stock > 0 and not archived, otherwise "out of stock" |
| ✓ `condition` | `"new"` (hardcoded) | `"new"` (hardcoded) | All wines are new |
| ✓ `price` | `price` | `price` | Formatted as "19.99 EUR" |
| ✓ `link` | `https://www.kirsten-liebieg.de/produkt/{slug}` | `https://www.kirsten-liebieg.de/bundle/{slug}` | Full product/bundle URL |
| ✓ `image_link` | `image` (converted to full URL) | `image` (converted to full URL) | Main product image at 1200px width, quality 100 |
| ✓ `brand` | `erzeuger` or "Weingut Kirsten Liebieg" | "Weingut Kirsten Liebieg" | Producer name from product, or default brand |

### Categorization

| Facebook Field | Value | Notes |
|----------------|-------|-------|
| ✓ `google_product_category` | "Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine" | Standard Google product taxonomy for wine |
| ✓ `fb_product_category` | "Food & Beverage > Alcoholic Beverages > Wine" | Facebook's product category for wine |

## Optional Fields (✓ = Mapped)

### Inventory & Sales

| Facebook Field | Sanity Field (Product) | Sanity Field (Bundle) | Notes |
|----------------|------------------------|----------------------|-------|
| ✓ `quantity_to_sell_on_facebook` | `stock` | `"10"` (default) | Available quantity. Bundles use arbitrary value since they're virtual |
| ✓ `sale_price` | `oldPrice` (if exists and > price) | `oldPrice` (if exists and > price) | Original price when on sale, formatted as "25.00 EUR" |
| ✓ `sale_price_effective_date` | Auto-generated (1 year period) | Auto-generated (1 year period) | Format: `YYYY-MM-DDTHH:MM+01:00/YYYY-MM-DDTHH:MM+01:00` |

### Product Attributes

| Facebook Field | Sanity Field (Product) | Sanity Field (Bundle) | Notes |
|----------------|------------------------|----------------------|-------|
| ✓ `gender` | `"unisex"` (hardcoded) | `"unisex"` (hardcoded) | Wine is unisex |
| ✓ `size` | `liter` (formatted as "0.75L") | Empty | Bottle size in liters |
| ✓ `age_group` | `"adult"` (hardcoded) | `"adult"` (hardcoded) | Wine is for adults only |
| ✓ `gtin` | `artikelnummer` | Empty | Article number from Winestro used as product identifier |

### Marketing & Discovery

| Facebook Field | Sanity Field (Product) | Sanity Field (Bundle) | Notes |
|----------------|------------------------|----------------------|-------|
| ✓ `product_tags[0]` | `tags[0]` | `tags[0]` | First custom tag |
| ✓ `product_tags[1]` | `tags[1]` | `tags[1]` | Second custom tag |
| ✓ `style[0]` | `tasteCollection[0]` | `tasteCollection[0]` | Taste profile (e.g., "Mineralisch & Tiefgründig") |

### Not Currently Mapped (Empty)

| Facebook Field | Reason |
|----------------|--------|
| `item_group_id` | Could be used to group different vintages of same wine, but not implemented |
| `color` | Not applicable to wine products |
| `material` | Not applicable to wine products |
| `pattern` | Not applicable to wine products |
| `shipping` | Use Facebook's default shipping settings |
| `shipping_weight` | Could calculate from bottle size, but not currently implemented |
| `video[0].url` | No product videos currently stored in Sanity |
| `video[0].tag[0]` | No product videos currently stored in Sanity |

## Product-Specific Description Enhancement

For wine products, the description is enriched with structured wine information:

```
[Rich text description from Sanity]

Jahrgang: 2021 | Rebsorte: Riesling | Geschmack: Trocken | Qualität: Kabinett | Alkohol: 12.5% | Füllmenge: 0.75L
```

This ensures key wine characteristics are discoverable in Facebook's catalog search.

## Bundle Handling

Bundles are treated as distinct products in the catalog with:
- Their own price (bundle price, not sum of components)
- Separate URL structure (`/bundle/{slug}`)
- Note in description indicating it's a multi-wine package
- Default availability (bundles are virtual products)

Note: `bundleItems` references are not expanded in the CSV. Each bundle is a standalone catalog item.

## Data Sources

### From Winestro API (Synced to Sanity Products)
- `artikelnummer` → Article number
- `jahrgang` → Vintage year
- `rebsorte` → Grape variety
- `geschmack` → Taste profile
- `qualitaet` → Quality level
- `alkohol` → Alcohol percentage
- `liter` → Bottle size
- `erzeuger` → Producer info
- `stock` → Inventory quantity

### Manually Managed in Sanity
- `title` → Product name
- `description` → Marketing description
- `price` / `oldPrice` → Pricing
- `tags` → Custom labels
- `tasteCollection` → Taste categories

## Base URL Configuration

The product/bundle URLs use `NEXT_PUBLIC_BASE_URL` environment variable:
- Default: `https://www.kirsten-liebieg.de`
- Override in `.env.local` if needed for testing

## CSV Format

- All text fields are properly escaped (quotes, commas, newlines)
- Price format: `XX.XX EUR` (2 decimal places + currency)
- Empty optional fields are left blank (not "null" or "undefined")
- Character limits enforced:
  - `title`: 200 characters
  - `description`: 9999 characters
  - `brand`: 100 characters

## Facebook Category Justification

**Google Product Category:**
`Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine`

This is the standard Google Product Taxonomy (GPT) path for wine products, ensuring proper classification in Google Shopping and Facebook Shops.

**Facebook Product Category:**
`Food & Beverage > Alcoholic Beverages > Wine`

Facebook's simplified category structure for wine products.

## Future Enhancements

### Potential Improvements:
1. **Item Groups**: Group different vintages of the same wine using `item_group_id`
2. **Additional Images**: Map `gallery` array to `additional_image_link[0-9]` fields
3. **Shipping Weight**: Calculate from `liter` field (e.g., 0.75L ≈ 1.2kg with bottle)
4. **Videos**: If product videos are added to Sanity, map to `video[0].url`
5. **Custom Labels**: Use `status` (TOP-VERKÄUFER, STARTERSETS) or `variant` (Im Angebot, Neuheiten) as `custom_label_0`
6. **Availability Dates**: Use Winestro sync data to predict when out-of-stock items will be restocked

### Catalog Refresh Strategy:
- **Full Sync**: Run script weekly to ensure all products are up-to-date
- **Incremental Updates**: Future API integration could update individual products when changed in Sanity
- **Automated Scheduling**: Run via cron job or GitHub Actions on schedule

## Usage

Generate the CSV with:

```bash
npx tsx scripts/generate-facebook-catalog-csv.ts
```

Output file: `facebook_catalog.csv` in project root

Then upload to Meta Business Suite:
https://business.facebook.com/commerce/catalogs
