/**
 * Winestro Order Service
 * Handles order creation in Winestro system via their API
 */

interface WinestroOrderParams {
  // Customer information (billing address)
  firma?: string          // Company name
  anrede: number          // Salutation: 0=Herr (Mr), 1=Frau (Mrs)
  name: string            // First name
  nname: string           // Last name
  email: string           // Email address
  strasse: string         // Street name
  hnummer: string         // House number
  plz: string             // Postal code
  ort: string             // City
  land: string            // Country code (DE, AT, etc.)

  // Delivery address (if different from billing) - prefixed with l_
  l_firma?: string
  l_anrede?: number
  l_name?: string
  l_nname?: string
  l_strasse?: string
  l_hnummer?: string
  l_plz?: string
  l_ort?: string
  l_land?: string

  // Order items
  positionen: number      // Number of line items
  [key: `wein_anzahl${number}`]: number  // Quantity for each item
  [key: `wein_id${number}`]: string      // Product artikel_nr for each item

  // Payment and costs
  zahlungsart: number     // Payment method ID (1=Invoice, 2=Bank Transfer, 4=PayPal, 9=Credit Card)
  versandkosten: string   // Shipping cost (decimal with period, e.g., "5.90")
  gebuehr: string         // Fee (decimal)
  Gesamtrabatt: string    // Total discount (decimal)

  // Order notes
  bemerkung?: string      // Customer notes/comments
}

interface WinestroOrderResponse {
  auftrag: {
    status: 'ok' | 'error'
    nr?: string           // Order number from Winestro
    error?: string        // Error message if status is error
  }
}

interface SanityOrder {
  orderNumber: string
  customerEmail: string
  customerName: string
  items: Array<{
    product: { _ref: string }
    quantity: number
  }>
  billingAddress: {
    company?: string
    firstName: string
    lastName: string
    street: string
    houseNumber: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  shippingAddress: {
    company?: string
    firstName: string
    lastName: string
    street: string
    houseNumber: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  notes?: string
  paymentMethod: string
  shipping: number
  total: number
}

export class WinestroOrderService {
  private readonly winestroBaseUrl: string
  private readonly winestroUID: string
  private readonly winestroApiUser: string
  private readonly winestroApiCode: string
  private readonly winestroShopId: string

  constructor() {
    this.winestroBaseUrl = process.env.WINESTRO_BASE_URL || ''
    this.winestroUID = process.env.WINESTRO_UID || ''
    this.winestroApiUser = process.env.WINESTRO_API_USER || ''
    this.winestroApiCode = process.env.WINESTRO_API_CODE || ''
    this.winestroShopId = process.env.WINESTRO_SHOP_ID || '1'

    if (!this.winestroBaseUrl || !this.winestroUID || !this.winestroApiUser || !this.winestroApiCode) {
      console.warn('⚠️  Winestro credentials not fully configured')
    }
  }

  /**
   * Create an order in Winestro system
   */
  async createOrder(sanityOrder: SanityOrder): Promise<{ success: boolean; winestroOrderNumber?: string; error?: string }> {
    try {
      console.log('📦 Creating order in Winestro...', {
        orderNumber: sanityOrder.orderNumber,
        email: sanityOrder.customerEmail
      })

      // Fetch product details to get winestroId for each item
      const itemsWithWinestroIds = await this.getProductWinestroIds(sanityOrder.items)

      // Check if shipping address is different from billing
      const hasSeparateShipping = this.isDifferentAddress(
        sanityOrder.billingAddress,
        sanityOrder.shippingAddress
      )

      // Transform Sanity order to Winestro format
      const winestroParams = await this.transformOrderData(
        sanityOrder,
        itemsWithWinestroIds,
        hasSeparateShipping
      )

      // Build API URL with all parameters
      const url = this.buildOrderUrl(winestroParams)

      // Make API request to Winestro
      console.log('🔄 Sending order to Winestro API...')
      const response = await fetch(url, {
        method: 'GET', // Winestro API uses GET with query parameters
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Winestro API returned ${response.status}: ${response.statusText}`)
      }

      const data: WinestroOrderResponse = await response.json()

      // Log the full response for debugging
      console.log('📥 Winestro API response:', JSON.stringify(data, null, 2))

      // Check if response has expected structure
      if (!data || !data.auftrag) {
        console.error('❌ Invalid Winestro API response structure:', data)
        return {
          success: false,
          error: 'Invalid response from Winestro API - missing auftrag object'
        }
      }

      if (data.auftrag.status === 'ok' && data.auftrag.nr) {
        console.log('✅ Order created in Winestro:', data.auftrag.nr)
        return {
          success: true,
          winestroOrderNumber: data.auftrag.nr
        }
      } else {
        console.error('❌ Winestro order creation failed:', data.auftrag.error || 'Unknown error')
        return {
          success: false,
          error: data.auftrag.error || 'Unknown error from Winestro'
        }
      }
    } catch (error) {
      console.error('❌ Error creating Winestro order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Fetch winestroId for products from Sanity
   * Handles both regular products and bundles (expands bundles into component products)
   */
  private async getProductWinestroIds(items: SanityOrder['items']): Promise<Array<{ winestroId: string; quantity: number }>> {
    const { createClient } = await import('@sanity/client')

    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      useCdn: false
    })

    const allItems: Array<{ winestroId: string; quantity: number }> = []

    for (const item of items) {
      // Fetch product with type detection and bundle items
      const product = await sanityClient.fetch(
        `*[_id == $productId][0]{
          _type,
          winestroId,
          artikelnummer,
          bundleItems[]{
            quantity,
            product->{
              _id,
              winestroId,
              artikelnummer
            }
          }
        }`,
        { productId: item.product._ref }
      )

      if (!product) {
        console.warn(`⚠️  Product ${item.product._ref} not found - skipping`)
        continue
      }

      // Handle bundles by expanding into component products
      if (product._type === 'bundle' && product.bundleItems?.length > 0) {
        console.log(`📦 Expanding bundle ${item.product._ref} into ${product.bundleItems.length} component products`)

        for (const bundleItem of product.bundleItems) {
          const componentProduct = bundleItem.product
          const winestroId = componentProduct?.winestroId || componentProduct?.artikelnummer

          if (!winestroId) {
            console.warn(`⚠️  Bundle component product ${componentProduct?._id} has no winestroId - skipping`)
            continue
          }

          // Calculate total quantity: order quantity × bundle item quantity
          const totalQuantity = item.quantity * bundleItem.quantity

          allItems.push({
            winestroId,
            quantity: totalQuantity
          })
        }
      } else {
        // Handle regular products
        const winestroId = product?.winestroId || product?.artikelnummer

        if (!winestroId) {
          console.warn(`⚠️  Product ${item.product._ref} has no winestroId - skipping`)
          continue
        }

        allItems.push({
          winestroId,
          quantity: item.quantity
        })
      }
    }

    return allItems
  }

  /**
   * Check if shipping address is different from billing address
   */
  private isDifferentAddress(
    billing: SanityOrder['billingAddress'],
    shipping: SanityOrder['shippingAddress']
  ): boolean {
    return (
      billing.street !== shipping.street ||
      billing.houseNumber !== shipping.houseNumber ||
      billing.city !== shipping.city ||
      billing.postalCode !== shipping.postalCode ||
      billing.country !== shipping.country
    )
  }

  /**
   * Transform Sanity order data to Winestro API format
   */
  private async transformOrderData(
    order: SanityOrder,
    items: Array<{ winestroId: string; quantity: number }>,
    hasSeparateShipping: boolean
  ): Promise<Record<string, string | number>> {
    const params: Record<string, string | number> = {
      // Billing address (customer)
      anrede: this.mapSalutation(order.billingAddress.firstName),
      name: order.billingAddress.firstName,
      nname: order.billingAddress.lastName,
      email: order.customerEmail,
      strasse: order.billingAddress.street,
      hnummer: order.billingAddress.houseNumber,
      plz: order.billingAddress.postalCode,
      ort: order.billingAddress.city,
      land: this.mapCountryCode(order.billingAddress.country)
    }

    // Add company if provided
    if (order.billingAddress.company) {
      params.firma = order.billingAddress.company
    }

    // Add delivery address if different
    if (hasSeparateShipping) {
      params.l_anrede = this.mapSalutation(order.shippingAddress.firstName)
      params.l_name = order.shippingAddress.firstName
      params.l_nname = order.shippingAddress.lastName
      params.l_strasse = order.shippingAddress.street
      params.l_hnummer = order.shippingAddress.houseNumber
      params.l_plz = order.shippingAddress.postalCode
      params.l_ort = order.shippingAddress.city
      params.l_land = this.mapCountryCode(order.shippingAddress.country)

      if (order.shippingAddress.company) {
        params.l_firma = order.shippingAddress.company
      }
    }

    // Add order items
    params.positionen = items.length
    items.forEach((item, index) => {
      const itemNumber = index + 1
      params[`wein_anzahl${itemNumber}`] = item.quantity
      params[`wein_id${itemNumber}`] = item.winestroId
    })

    // Add payment and costs
    params.zahlungsart = this.mapPaymentMethod(order.paymentMethod)
    params.versandkosten = order.shipping.toFixed(2)
    params.gebuehr = "0"
    params.Gesamtrabatt = "0"

    // Add customer notes if provided
    if (order.notes) {
      params.bemerkung = order.notes
    }

    return params
  }

  /**
   * Map first name to salutation (0=Herr/Mr, 1=Frau/Mrs)
   * This is a simple heuristic - ideally should be a form field
   */
  private mapSalutation(firstName: string): number {
    // Default to 0 (Herr/Mr) - this could be improved with a dedicated form field
    return 0
  }

  /**
   * Map country name to 2-letter ISO code
   */
  private mapCountryCode(country: string): string {
    const countryMap: Record<string, string> = {
      'Deutschland': 'DE',
      'Germany': 'DE',
      'Österreich': 'AT',
      'Austria': 'AT',
      'Schweiz': 'CH',
      'Switzerland': 'CH',
      'Frankreich': 'FR',
      'France': 'FR',
      'Italien': 'IT',
      'Italy': 'IT',
      'Spanien': 'ES',
      'Spain': 'ES',
      'Niederlande': 'NL',
      'Netherlands': 'NL',
      'Belgien': 'BE',
      'Belgium': 'BE',
      'Luxemburg': 'LU',
      'Luxembourg': 'LU'
    }

    // If already a 2-letter code, return as-is
    if (country.length === 2) {
      return country.toUpperCase()
    }

    return countryMap[country] || 'DE' // Default to DE if not found
  }

  /**
   * Map payment method to Winestro payment method ID
   */
  private mapPaymentMethod(paymentMethod: string): number {
    const paymentMap: Record<string, number> = {
      'paypal': 4,
      'credit_card': 9,
      'bank_transfer': 2,
      'invoice': 1  // Rechnung (auf Rechnung)
    }

    return paymentMap[paymentMethod] || 4 // Default to PayPal
  }

  /**
   * Build Winestro API URL with all parameters
   */
  private buildOrderUrl(params: Record<string, string | number>): string {
    const urlParams = new URLSearchParams({
      UID: this.winestroUID,
      apiUSER: this.winestroApiUser,
      apiCODE: this.winestroApiCode,
      apiShopID: this.winestroShopId,
      apiACTION: 'newOrder',
      output: 'json'
    })

    // Add all order parameters
    Object.entries(params).forEach(([key, value]) => {
      urlParams.append(key, String(value))
    })

    return `${this.winestroBaseUrl}?${urlParams.toString()}`
  }
}
