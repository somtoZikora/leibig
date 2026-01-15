import crypto from 'crypto'

interface ConversionsAPIEvent {
  event_name: string
  event_time: number
  event_source_url?: string
  action_source: string
  user_data: {
    em?: string // hashed email
    ph?: string // hashed phone
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string // Facebook click ID
    fbp?: string // Facebook browser ID
  }
  custom_data?: {
    currency?: string
    value?: number
    content_ids?: string[]
    content_name?: string
    content_type?: string
    contents?: Array<{
      id: string
      quantity: number
      item_price?: number
    }>
    num_items?: number
  }
}

/**
 * Hash data using SHA-256 for Meta Conversions API
 */
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

/**
 * Send event to Meta Conversions API
 */
export async function sendMetaConversionEvent(
  eventName: string,
  eventData: {
    email?: string
    phone?: string
    ipAddress?: string
    userAgent?: string
    fbc?: string
    fbp?: string
    eventSourceUrl?: string
    customData?: ConversionsAPIEvent['custom_data']
  }
): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN

  if (!pixelId || !accessToken) {
    console.warn('Meta Pixel ID or Conversions API token not configured')
    return false
  }

  try {
    const event: ConversionsAPIEvent = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventData.eventSourceUrl,
      action_source: 'website',
      user_data: {
        client_ip_address: eventData.ipAddress,
        client_user_agent: eventData.userAgent,
        fbc: eventData.fbc,
        fbp: eventData.fbp,
      },
    }

    // Hash email if provided
    if (eventData.email) {
      event.user_data.em = hashData(eventData.email)
    }

    // Hash phone if provided
    if (eventData.phone) {
      event.user_data.ph = hashData(eventData.phone)
    }

    // Add custom data if provided
    if (eventData.customData) {
      event.custom_data = eventData.customData
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [event],
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('Meta Conversions API error:', result)
      return false
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Meta Conversions API event sent:', eventName, result)
    }

    return true
  } catch (error) {
    console.error('Failed to send Meta Conversions API event:', error)
    return false
  }
}

/**
 * Track Purchase event via Conversions API
 */
export async function trackPurchase(data: {
  email?: string
  value: number
  currency: string
  contents: Array<{ id: string; quantity: number; item_price?: number }>
  ipAddress?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  eventSourceUrl?: string
}) {
  return sendMetaConversionEvent('Purchase', {
    email: data.email,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    fbc: data.fbc,
    fbp: data.fbp,
    eventSourceUrl: data.eventSourceUrl,
    customData: {
      currency: data.currency,
      value: data.value,
      contents: data.contents,
      num_items: data.contents.reduce((sum, item) => sum + item.quantity, 0),
    },
  })
}

/**
 * Track ViewContent event via Conversions API
 */
export async function trackViewContent(data: {
  contentId: string
  contentName: string
  contentType: string
  value?: number
  currency?: string
  ipAddress?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  eventSourceUrl?: string
}) {
  return sendMetaConversionEvent('ViewContent', {
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    fbc: data.fbc,
    fbp: data.fbp,
    eventSourceUrl: data.eventSourceUrl,
    customData: {
      content_ids: [data.contentId],
      content_name: data.contentName,
      content_type: data.contentType,
      value: data.value,
      currency: data.currency,
    },
  })
}

/**
 * Track AddToCart event via Conversions API
 */
export async function trackAddToCart(data: {
  contentId: string
  contentName: string
  value: number
  currency: string
  ipAddress?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  eventSourceUrl?: string
}) {
  return sendMetaConversionEvent('AddToCart', {
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    fbc: data.fbc,
    fbp: data.fbp,
    eventSourceUrl: data.eventSourceUrl,
    customData: {
      content_ids: [data.contentId],
      content_name: data.contentName,
      content_type: 'product',
      value: data.value,
      currency: data.currency,
    },
  })
}

/**
 * Track InitiateCheckout event via Conversions API
 */
export async function trackInitiateCheckout(data: {
  value: number
  currency: string
  contents: Array<{ id: string; quantity: number }>
  numItems: number
  ipAddress?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  eventSourceUrl?: string
}) {
  return sendMetaConversionEvent('InitiateCheckout', {
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    fbc: data.fbc,
    fbp: data.fbp,
    eventSourceUrl: data.eventSourceUrl,
    customData: {
      currency: data.currency,
      value: data.value,
      contents: data.contents,
      num_items: data.numItems,
    },
  })
}
