# Winestro Integration Middleware

This middleware solution allows you to sync products from Winestro API to your Sanity backend automatically.

## ✅ Features

- **Full Product Sync**: Sync all products from Winestro to Sanity
- **Single Product Sync**: Sync individual products by ID
- **Image Upload**: Automatically uploads product images to Sanity
- **Duplicate Prevention**: Uses Winestro ID to prevent duplicates
- **Error Handling**: Comprehensive error logging and recovery
- **Admin Interface**: Web-based admin panel for manual syncing
- **Scheduled Sync**: API endpoint for automated syncing via cron jobs

## 🚀 Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
# Winestro API Configuration
WINESTRO_API_URL="https://api.winestro.com/v1"
WINESTRO_API_KEY="your-winestro-api-key-here"

# Sync Schedule Token (for automated syncing)
SYNC_SCHEDULE_TOKEN="your-secret-sync-token-here"
```

### 2. Sanity Schema Update

The product schema has been updated to include `winestroId` field for tracking synced products.

## 📡 API Endpoints

### Manual Sync API
`POST /api/winestro-sync`

Actions:
- `test-connection` - Test Winestro API connection
- `sync-products` - Sync all products (with options)
- `sync-single-product` - Sync one product by ID

### Scheduled Sync API
`POST /api/winestro-sync/schedule`
- Requires `Authorization: Bearer <SYNC_SCHEDULE_TOKEN>` header
- Used for automated syncing via cron jobs

## 🎛️ Admin Interface

Visit `/admin/winestro-sync` to access the web-based admin interface for:
- Testing API connection
- Manual product syncing
- Viewing sync results and statistics

## 🔄 How It Works

1. **Fetch**: Retrieves products from Winestro API
2. **Transform**: Maps Winestro product data to your Sanity schema
3. **Upload Images**: Downloads and uploads product images to Sanity
4. **Create/Update**: Creates new products or updates existing ones
5. **Track**: Uses `winestroId` to prevent duplicates

## 📅 Automated Syncing

Set up a cron job to automatically sync products:

```bash
# Sync every hour
0 * * * * curl -X POST -H "Authorization: Bearer your-secret-sync-token-here" https://yourdomain.com/api/winestro-sync/schedule
```

## 🛠️ Data Mapping

Winestro fields are mapped to your Sanity schema:

- `name` → `title`
- `description` → `description`
- `price` → `price`
- `originalPrice` → `oldPrice`
- `discount` → `discount`
- `images[]` → `image` (first) + `gallery` (rest)
- `stock` → `stock`
- `rating` → `rating`
- Status mapping: `bestseller` → `TOP-VERKÄUFER`
- Variant mapping: `wine` → `Weine`, `sale` → `Im Angebot`, etc.

## 🚨 Important Notes

1. **API Credentials**: Contact Winestro to obtain your API credentials
2. **Rate Limiting**: The sync includes delays to avoid overwhelming the APIs
3. **Image Storage**: Images are uploaded to Sanity's asset system
4. **Error Recovery**: Failed products are logged but don't stop the sync process
5. **Incremental Updates**: Running sync multiple times will update existing products

## 🔧 Customization

You can customize the sync behavior by modifying:
- `lib/winestro-sync.ts` - Core sync logic
- Data mapping in `transformProductData()` method
- Batch sizes and limits in the admin interface

## 📊 Monitoring

The admin interface provides:
- Sync statistics (total, successful, failed)
- Error logs for failed products
- Connection testing
- Real-time sync progress