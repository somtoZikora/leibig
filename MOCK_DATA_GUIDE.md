# Mock Data Guide

This project includes a simple mock data system for testing purposes. You can easily toggle between mock and real data.

## How to Use Mock Data

### Option 1: Environment Variable (Recommended)
Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Option 2: Direct Code Change
In `lib/mockData.ts`, change:
```typescript
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
```

To:
```typescript
export const USE_MOCK_DATA = true  // Always use mock data
```

## What's Included

The mock data includes:
- 8 sample wine products with different statuses (STARTERSETS, TOP-VERKÄUFER)
- 3 categories (Red Wine, White Wine, Champagne & Sparkling)
- Various wine types: Bordeaux, Champagne, Barolo, Riesling, etc.
- Realistic pricing, ratings, and product details

## Components Using Mock Data

- ProductStarterSets
- WineSections (Top Sellers)
- SearchBar
- Shop page (when implemented)

## Switching Back to Real Data

To use real Sanity data:
1. Remove or set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
2. Or change `USE_MOCK_DATA = false` in `lib/mockData.ts`

## Debugging

The console will show "🍷 Using mock data for..." messages when mock data is active, making it easy to verify which mode you're in.
