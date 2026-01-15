// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

/**
 * Send a custom event to Google Analytics
 */
export function gtagEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/**
 * Track page view
 */
export function gtagPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

/**
 * Track View Item event (product page view)
 */
export function gtagViewItem(params: {
  currency: string
  value: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity?: number
  }>
}) {
  gtagEvent('view_item', params)
}

/**
 * Track Add to Cart event
 */
export function gtagAddToCart(params: {
  currency: string
  value: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) {
  gtagEvent('add_to_cart', params)
}

/**
 * Track Begin Checkout event
 */
export function gtagBeginCheckout(params: {
  currency: string
  value: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) {
  gtagEvent('begin_checkout', params)
}

/**
 * Track Purchase event
 */
export function gtagPurchase(params: {
  transaction_id: string
  value: number
  currency: string
  tax?: number
  shipping?: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) {
  gtagEvent('purchase', params)
}
