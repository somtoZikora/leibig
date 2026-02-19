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
    // Note: This route is public to allow guest checkout, so auth() might return null
    if (orderData.userId) {
      try {
        const { userId: authenticatedUserId } = await auth()

        // If we have an authenticated user, verify it matches
        if (authenticatedUserId && orderData.userId !== authenticatedUserId) {
          console.error('⚠️  Security violation: userId mismatch', {
            provided: orderData.userId,
            authenticated: authenticatedUserId
          })
          return NextResponse.json(
            { error: 'Unauthorized: User ID mismatch' },
            { status: 403 }
          )
        }

        // If no authenticatedUserId but orderData has userId, log warning but allow
        // (happens when route is public but user is logged in via frontend)
        if (!authenticatedUserId) {
          console.warn('⚠️  Public route order creation with userId (auth context not available)')
        }
      } catch (error) {
        console.error('⚠️  Auth check error:', error)
        // Continue with order creation - don't block on auth errors for public routes
      }
    }

    // For guest orders, ensure we have an email
    if (!orderData.userId && !orderData.customerEmail) {
      return NextResponse.json(
        { error: 'Email is required for guest orders' },
        { status: 400 }
      )
    }

    // Step 1: Create order in Winestro FIRST to get Winestro order number
    console.log('📦 Creating order in Winestro first to get order number...')
    const winestroService = new WinestroOrderService()
    const winestroResult = await winestroService.createOrder(orderData as any)

    let finalOrderNumber = orderData.orderNumber

    if (winestroResult.success && winestroResult.winestroOrderNumber) {
      // Use Winestro order number as the primary order number
      finalOrderNumber = winestroResult.winestroOrderNumber
      console.log('✅ Winestro order created with number:', finalOrderNumber)
    } else {
      // Log error and fall back to generated order number
      console.error('⚠️  Winestro order creation failed:', winestroResult.error)
      console.warn('⚠️  Falling back to generated order number:', finalOrderNumber)
    }

    // Step 2: Create order in Sanity with Winestro order number
    const finalOrderData = {
      ...orderData,
      orderNumber: finalOrderNumber,
      winestroOrderNumber: winestroResult.winestroOrderNumber || undefined
    }

    console.log('💾 Creating order in Sanity with order number:', finalOrderNumber)
    const result = await sanityWriteClient.create(finalOrderData)

    console.log('✅ Order created successfully:', result._id)

    return NextResponse.json({
      success: true,
      orderId: result._id,
      orderNumber: finalOrderNumber,
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