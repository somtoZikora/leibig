import { NextRequest, NextResponse } from 'next/server'
import { trackPurchase } from '@/lib/meta-conversions-api'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, email, value, currency, contents } = body

    // Get request headers for user info
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] ||
                      headersList.get('x-real-ip') ||
                      undefined
    const userAgent = headersList.get('user-agent') || undefined

    // Get Facebook cookies if available (passed from client)
    const fbc = body.fbc
    const fbp = body.fbp

    if (eventName === 'Purchase') {
      const success = await trackPurchase({
        email,
        value,
        currency,
        contents,
        ipAddress,
        userAgent,
        fbc,
        fbp,
        eventSourceUrl: body.eventSourceUrl,
      })

      return NextResponse.json({ success })
    }

    return NextResponse.json({ success: false, error: 'Unknown event type' }, { status: 400 })
  } catch (error) {
    console.error('Meta Conversion API route error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send conversion event' },
      { status: 500 }
    )
  }
}
