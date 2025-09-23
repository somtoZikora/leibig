import { NextRequest, NextResponse } from 'next/server'
import { productOperations, categoryOperations, orderOperations, utilities } from '@/lib/backendClient'

export async function POST(request: NextRequest) {
  try {
    const { action, type, data, id } = await request.json()

    // Basic validation
    if (!action || !type) {
      return NextResponse.json(
        { error: 'Action and type are required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'product':
        switch (action) {
          case 'create':
            // Validate product data
            const validation = utilities.validateProduct(data)
            if (!validation.isValid) {
              return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
              )
            }
            
            // Generate slug if not provided
            if (!data.slug?.current) {
              data.slug = {
                _type: 'slug',
                current: utilities.generateSlug(data.title)
              }
            }
            
            result = await productOperations.create(data)
            break
            
          case 'update':
            if (!id) {
              return NextResponse.json(
                { error: 'Product ID is required for update' },
                { status: 400 }
              )
            }
            result = await productOperations.update(id, data)
            break
            
          case 'delete':
            if (!id) {
              return NextResponse.json(
                { error: 'Product ID is required for delete' },
                { status: 400 }
              )
            }
            await productOperations.delete(id)
            result = { success: true, id }
            break
            
          case 'updateStock':
            if (!id || data.stock === undefined) {
              return NextResponse.json(
                { error: 'Product ID and stock quantity are required' },
                { status: 400 }
              )
            }
            result = await productOperations.updateStock(id, data.stock)
            break
            
          default:
            return NextResponse.json(
              { error: 'Invalid action for product' },
              { status: 400 }
            )
        }
        break

      case 'category':
        switch (action) {
          case 'create':
            // Generate slug if not provided
            if (!data.slug?.current) {
              data.slug = {
                _type: 'slug',
                current: utilities.generateSlug(data.title)
              }
            }
            
            result = await categoryOperations.create(data)
            break
            
          case 'update':
            if (!id) {
              return NextResponse.json(
                { error: 'Category ID is required for update' },
                { status: 400 }
              )
            }
            result = await categoryOperations.update(id, data)
            break
            
          case 'delete':
            if (!id) {
              return NextResponse.json(
                { error: 'Category ID is required for delete' },
                { status: 400 }
              )
            }
            await categoryOperations.delete(id)
            result = { success: true, id }
            break
            
          default:
            return NextResponse.json(
              { error: 'Invalid action for category' },
              { status: 400 }
            )
        }
        break

      case 'order':
        switch (action) {
          case 'create':
            // Generate order number if not provided
            if (!data.orderNumber) {
              data.orderNumber = utilities.generateOrderNumber()
            }
            
            result = await orderOperations.create(data)
            break
            
          case 'updateStatus':
            if (!id || !data.status) {
              return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
              )
            }
            result = await orderOperations.updateStatus(id, data.status)
            break
            
          default:
            return NextResponse.json(
              { error: 'Invalid action for order' },
              { status: 400 }
            )
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'sync-status') {
    try {
      const status = await import('@/lib/backendClient').then(m => m.syncOperations.checkSyncStatus())
      return NextResponse.json(status)
    } catch {
      return NextResponse.json(
        { error: 'Failed to check sync status' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  )
}