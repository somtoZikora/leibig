import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { WinestroOrderService } from '@/lib/winestro-order'
import { auth } from '@clerk/nextjs/server'

// Server-side Sanity client with write permissions
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '', // Server-side token access
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API Route: Creating order...')

    // Parse request body
    const orderData = await request.json()

    console.log('📄 Order data received:', {
      orderNumber: orderData.orderNumber,
      customerEmail: orderData.customerEmail,
      itemCount: orderData.items?.length,
      total: orderData.total,
      userId: orderData.userId,
      isGuest: !orderData.userId
    })

    // Validate required fields
    if (!orderData._type || orderData._type !== 'order') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      )
    }

    // Security: Validate userId matches authenticated user (if userId is provided)
    if (orderData.userId) {
      const { userId: authenticatedUserId } = await auth()

      if (!authenticatedUserId) {
        return NextResponse.json(
          { error: 'Authentication required for user orders' },
          { status: 401 }
        )
      }

      if (orderData.userId !== authenticatedUserId) {
        console.error('⚠️  Security violation: userId mismatch', {
          provided: orderData.userId,
          authenticated: authenticatedUserId
        })
        return NextResponse.json(
          { error: 'Unauthorized: User ID mismatch' },
          { status: 403 }
        )
      }
    }

    // For guest orders, ensure we have an email
    if (!orderData.userId && !orderData.customerEmail) {
      return NextResponse.json(
        { error: 'Email is required for guest orders' },
        { status: 400 }
      )
    }
    
    // Create order in Sanity
    console.log('💾 Creating order in Sanity...')
    const result = await sanityWriteClient.create(orderData)

    console.log('✅ Order created successfully:', result._id)

    // Create order in Winestro
    console.log('📦 Creating order in Winestro...')
    const winestroService = new WinestroOrderService()
    const winestroResult = await winestroService.createOrder(result as any)

    if (winestroResult.success && winestroResult.winestroOrderNumber) {
      // Update Sanity order with Winestro order number
      console.log('🔄 Updating Sanity order with Winestro order number...')
      await sanityWriteClient
        .patch(result._id)
        .set({ winestroOrderNumber: winestroResult.winestroOrderNumber })
        .commit()
      console.log('✅ Winestro order created:', winestroResult.winestroOrderNumber)
    } else {
      // Log error but don't fail the order - it still exists in Sanity for manual reconciliation
      console.error('⚠️  Winestro order creation failed:', winestroResult.error)
      console.error('⚠️  Order saved in Sanity but needs manual processing in Winestro')
    }

    return NextResponse.json({
      success: true,
      orderId: result._id,
      orderNumber: result.orderNumber,
      winestroOrderNumber: winestroResult.winestroOrderNumber
    })
    
  } catch (error: unknown) {
    console.error('❌ API Route Error:', error)
    
    // Enhanced error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: error instanceof Error && 'statusCode' in error ? (error as { statusCode: unknown }).statusCode : undefined,
      type: error instanceof Error && 'type' in error ? (error as { type: unknown }).type : undefined,
      description: error instanceof Error && 'description' in error ? (error as { description: unknown }).description : undefined,
      details: error instanceof Error && 'details' in error ? (error as { details: unknown }).details : undefined
    }
    
    console.error('Error details:', errorDetails)
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 API Route: Updating order...')
    
    const { orderId, updates } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    console.log('📝 Updating order:', orderId, updates)
    
    // Update order in Sanity
    const result = await sanityWriteClient
      .patch(orderId)
      .set(updates)
      .commit()
    
    console.log('✅ Order updated successfully:', result._id)
    
    return NextResponse.json({ 
      success: true, 
      orderId: result._id 
    })
    
  } catch (error: unknown) {
    console.error('❌ API Route Update Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}