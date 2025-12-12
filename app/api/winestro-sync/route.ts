import { NextRequest, NextResponse } from 'next/server'
import { WinestroSyncService } from '@/lib/winestro-sync'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  // Verify authentication
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    )
  }

  // Verify admin role
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if (user.publicMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Error verifying admin status:', error)
    return NextResponse.json(
      { error: 'Authorization check failed' },
      { status: 500 }
    )
  }

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
  // Verify authentication
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    )
  }

  // Verify admin role
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if (user.publicMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Error verifying admin status:', error)
    return NextResponse.json(
      { error: 'Authorization check failed' },
      { status: 500 }
    )
  }

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