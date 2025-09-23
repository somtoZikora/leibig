# Sanity Data Migration Guide

This guide will help you migrate your Sanity data from your current account to the new account.

## Quick Migration Options

### Option 1: Automated Export/Import (Recommended)

1. **Export your current data:**
   ```bash
   npm run export-sanity
   ```
   This will create a `sanity-exports` folder with all your data.

2. **Import to new account:**
   ```bash
   node sanity-exports/import-to-new-account.js
   ```

### Option 2: Using Sanity CLI (Alternative)

1. **Install Sanity CLI globally:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Export from current account:**
   ```bash
   sanity dataset export production backup.tar.gz --project pmw0w9kh
   ```

3. **Import to new account:**
   ```bash
   sanity dataset import backup.tar.gz production --project 2hqr3d91 --replace
   ```

## Account Details

### Current Account (Source)
- **Project ID:** `pmw0w9kh`
- **Dataset:** `production`
- **API Token:** `skpCIyD4w0ymdlMOEyWNkcPwiPJ0U06kyxs5IlIQCR7kURP9AsI8uEtDYVv1KhuO3901QrBahluaZNKkhMirCR3iN9j1IfISejFB3cfsIIQ3GdEouB95vMZAKqhku0Mu6MRKvv3A6AYFqjjVFs6Qj8Tza9T5dKuzvAvUT6Eogk3iWeZ1HjZg`

### New Account (Destination)
- **Project ID:** `2hqr3d91`
- **Dataset:** `production`
- **API Token:** `skDCBEuOwBxHRBlM0A37oc2hkO3HYWQo71VteJlWFL8TAYQxZ0YR9dWtlKy5tFUv2j7VMtih2N2xU4mNgJfEGz27LZOfjH1K3KP4GGsKP1uXVvMDUIyh2e9oxSi2ZQ3GCdTgGUFQgqZfCjIWobhIZgUSRPBp4sXttsGFvk7y6BfxWw0PeqLV`

## Data Types to Migrate

1. **Categories** - Wine categories and classifications
2. **Products** - Wine products with images, pricing, and details
3. **Orders** - Customer orders and order history
4. **Assets** - Images and media files

## Post-Migration Steps

After migration, you'll need to:

1. **Update your environment variables** in `.env`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="2hqr3d91"
   SANITY_API_TOKEN="skDCBEuOwBxHRBlM0A37oc2hkO3HYWQo71VteJlWFL8TAYQxZ0YR9dWtlKy5tFUv2j7VMtih2N2xU4mNgJfEGz27LZOfjH1K3KP4GGsKP1uXVvMDUIyh2e9oxSi2ZQ3GCdTgGUFQgqZfCjIWobhIZgUSRPBp4sXttsGFvk7y6BfxWw0PeqLV"
   ```

2. **Test your application** to ensure all data is working correctly

3. **Verify data integrity** by checking:
   - Product listings in your shop
   - Category navigation
   - Order history (if applicable)
   - Images are loading correctly

## Troubleshooting

### Common Issues:

1. **Token Permissions**: Ensure both API tokens have read/write permissions
2. **Schema Differences**: Make sure both projects have the same schema
3. **Asset Migration**: Images might need to be re-uploaded manually if automated migration fails

### Manual Asset Migration:

If images don't migrate properly, you can:
1. Download images from the old project
2. Upload them manually to the new project via Sanity Studio
3. Update product references

## Support

If you encounter any issues:
1. Check the console logs for specific error messages
2. Verify API tokens have proper permissions
3. Ensure both projects have identical schemas
4. Contact Sanity support if needed

---

**Note**: Always backup your data before migration and test thoroughly before switching to the new account in production.