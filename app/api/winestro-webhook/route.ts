import { NextRequest, NextResponse } from 'next/server'
import { WinestroSyncService } from '@/lib/winestro-sync'

// Webhook endpoint for automatic product sync
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (if Winestro provides it)
    const signature = request.headers.get('x-winestro-signature')
    const webhookSecret = process.env.WINESTRO_WEBHOOK_SECRET
    
    if (webhookSecret && signature) {
      // Verify the webhook signature here
      // This prevents unauthorized requests
    }

    const payload = await request.json()
    console.log('🎣 Received Winestro webhook:', payload)

    const syncService = new WinestroSyncService()

    // Handle different webhook events
    switch (payload.event) {
      case 'product.created':
      case 'product.updated':
        const productId = payload.data?.id || payload.product_id
        if (productId) {
          console.log(`🔄 Auto-syncing product: ${productId}`)
          const result = await syncService.syncSingleProduct(productId)
          return NextResponse.json({
            success: true,
            message: `Product ${productId} synced successfully`,
            result
          })
        }
        break

      case 'product.deleted':
        // Handle product deletion
        const deletedProductId = payload.data?.id || payload.product_id
        if (deletedProductId) {
          // You might want to mark the product as inactive rather than delete
          console.log(`❌ Product deleted in Winestro: ${deletedProductId}`)
        }
        break

      default:
        console.log(`ℹ️ Received unhandled webhook event: ${payload.event}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Winestro Webhook Endpoint',
    usage: 'Configure this URL in your Winestro dashboard as webhook endpoint',
    url: 'https://yourdomain.com/api/winestro-webhook'
  })
}