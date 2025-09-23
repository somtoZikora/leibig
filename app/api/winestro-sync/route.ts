import { NextRequest, NextResponse } from 'next/server'
import { WinestroSyncService } from '@/lib/winestro-sync'

export async function POST(request: NextRequest) {
  try {
    const { action, options } = await request.json()
    
    const syncService = new WinestroSyncService()
    
    switch (action) {
      case 'sync-products':
        const result = await syncService.syncProducts(options)
        return NextResponse.json(result)
      
      case 'sync-single-product':
        const { productId } = options
        const singleResult = await syncService.syncSingleProduct(productId)
        return NextResponse.json(singleResult)
      
      case 'test-connection':
        const testResult = await syncService.testWinestroConnection()
        return NextResponse.json(testResult)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action', availableActions: ['sync-products', 'sync-single-product', 'test-connection'] },
          { status: 400 }
        )
    }
  } catch (error: unknown) {
    console.error('Winestro sync API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Winestro Sync API',
    endpoints: {
      'POST /api/winestro-sync': {
        actions: [
          'sync-products - Sync all products from Winestro to Sanity',
          'sync-single-product - Sync a single product by ID',
          'test-connection - Test connection to Winestro API'
        ]
      }
    }
  })
}