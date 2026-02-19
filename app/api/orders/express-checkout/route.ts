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
  token: process.env.SANITY_API_TOKEN || '',
})

// Helper function to generate fallback order number (used only if Winestro fails)
const generateFallbackOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Express Checkout API: Starting order creation...')

    const { userId: authenticatedUserId } = await auth()
    const body = await req.json()

    const {
      paypalOrderId,
      paypalPaymentId,
      paypalPayerId,
      items,
      subtotal,
      discount,
      voucherCode,
      shipping,
      total,
      currency,
      shippingAddress,
      billingAddress,
      customerEmail,
      customerName,
      paymentMethod,
      paymentStatus,
      userId
    } = body

    console.log('📦 Express checkout data:', {
      paypalOrderId,
      customerEmail,
      itemCount: items?.length,
      total,
      userId,
      isGuest: !userId
    })

    // Validate required fields
    if (!paypalOrderId || !items || !shippingAddress || !customerEmail) {
      return NextResponse.json(
        { error: 'Fehlende erforderliche Felder' },
        { status: 400 }
      )
    }

    // Security: Validate userId matches authenticated user (if provided)
    // Note: This route is public to allow guest checkout, so auth() might return null
    if (userId) {
      try {
        // If we have an authenticated user, verify it matches
        if (authenticatedUserId && userId !== authenticatedUserId) {
          console.error('⚠️  Security violation: userId mismatch', {
            provided: userId,
            authenticated: authenticatedUserId
          })
          return NextResponse.json(
            { error: 'Unauthorized: User ID mismatch' },
            { status: 403 }
          )
        }

        // If no authenticatedUserId but body has userId, log warning but allow
        if (!authenticatedUserId) {
          console.warn('⚠️  Express checkout with userId (auth context not available)')
        }
      } catch (error) {
        console.error('⚠️  Auth check error:', error)
        // Continue with order creation
      }
    }

    // Prepare order data structure (matching traditional checkout format)
    const orderData = {
      _type: 'order',
      orderNumber: generateFallbackOrderNumber(), // Temporary, will be replaced by Winestro number
      customerEmail,
      customerName,
      userId: userId || undefined,
      isGuest: !userId,
      status: 'paid', // Already paid via PayPal Express
      items: items.map((item: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product
        },
        productSnapshot: {
          title: item.title,
          price: item.price,
          image: item.image
        },
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      })),
      subtotal,
      discount: discount || 0,
      voucherCode: voucherCode || undefined,
      tax: 0, // Tax calculation can be added if needed
      taxRate: 19,
      shipping,
      total,
      currency,
      billingAddress: billingAddress || shippingAddress,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails: {
        paypalOrderId,
        paypalPaymentId,
        paypalPayerId
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Step 1: Create order in Winestro FIRST to get Winestro order number
    console.log('📦 Creating order in Winestro first to get order number...')
    let finalOrderNumber = orderData.orderNumber
    let winestroOrderNumber: string | undefined

    try {
      const winestroService = new WinestroOrderService()
      const winestroResult = await winestroService.createOrder(orderData as any)

      if (winestroResult.success && winestroResult.winestroOrderNumber) {
        // Use Winestro order number as the primary order number
        finalOrderNumber = winestroResult.winestroOrderNumber
        winestroOrderNumber = winestroResult.winestroOrderNumber
        console.log('✅ Winestro order created with number:', finalOrderNumber)
      } else {
        console.error('⚠️  Winestro order creation failed:', winestroResult.error)
        console.warn('⚠️  Falling back to generated order number:', finalOrderNumber)
      }
    } catch (winestroError) {
      console.error('⚠️  Winestro sync error:', winestroError)
      console.warn('⚠️  Falling back to generated order number:', finalOrderNumber)
    }

    // Step 2: Create order in Sanity with Winestro order number
    const finalOrderData = {
      ...orderData,
      orderNumber: finalOrderNumber,
      winestroOrderNumber: winestroOrderNumber
    }

    console.log('💾 Creating order in Sanity with order number:', finalOrderNumber)
    const result = await sanityWriteClient.create(finalOrderData)
    console.log('✅ Order created in Sanity:', result._id)

    return NextResponse.json({
      success: true,
      orderId: result._id,
      orderNumber: finalOrderNumber
    })
  } catch (error) {
    console.error('❌ Express checkout error:', error)

    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }

    console.error('Error details:', errorDetails)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Bestellerstellung fehlgeschlagen',
        details: errorDetails
      },
      { status: 500 }
    )
  }
}
