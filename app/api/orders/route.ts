import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

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
      total: orderData.total
    })
    
    // Validate required fields
    if (!orderData._type || orderData._type !== 'order') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      )
    }
    
    // Create order in Sanity
    console.log('💾 Creating order in Sanity...')
    const result = await sanityWriteClient.create(orderData)
    
    console.log('✅ Order created successfully:', result._id)
    
    return NextResponse.json({ 
      success: true, 
      orderId: result._id,
      orderNumber: result.orderNumber 
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