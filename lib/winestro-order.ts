/**
 * Winestro Order Service
 * Handles order creation in Winestro system via their API
 */

import { splitBundlePrice, formatCents, type BundleComponentInput } from './winestro-bundle-pricing'
import { cleanAddressValue, splitStreetAndHouseNumber, toWinestroAnrede } from './address'

interface WinestroOrderParams {
  // Customer information (billing address)
  firma?: string          // Company name
  anrede: string          // Salutation code: "0"=Herr(n), "1"=Frau, '' = none (see toWinestroAnrede)
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
  l_anrede?: string
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
  [key: `artikel_sonderpreis${number}`]: string  // Optional special price per bottle (replaces WBO price)

  // Payment and costs
  zahlungsart: number     // Payment method ID (2=Bank Transfer, 4=PayPal, 9=Credit Card)
  versandkosten: string   // Shipping cost (decimal with period, e.g., "5.90")
  gebuehr: string         // Fee (decimal)

  // Voucher/Gutschein
  gutscheincode?: string  // Voucher code
  gutscheinwert?: string  // Voucher discount value (decimal)

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

interface WinestroOrderItem {
  winestroId: string
  quantity: number
  sonderpreisCents?: number  // Special price per bottle in cents (bundle components)
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
    salutation?: string     // 'herr' | 'frau' | 'divers' | 'keine_angabe' (absent for PayPal Express)
    street: string
    houseNumber?: string    // Missing for PayPal Express orders created before the split fix
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  shippingAddress: {
    company?: string
    firstName: string
    lastName: string
    salutation?: string     // 'herr' | 'frau' | 'divers' | 'keine_angabe' (absent for PayPal Express)
    street: string
    houseNumber?: string    // Missing for PayPal Express orders created before the split fix
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  notes?: string
  customerNotes?: string
  paymentMethod: string
  shipping: number
  total: number
  discount?: number
  voucherCode?: string
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
   * Handles both regular products and bundles (expands bundles into component products).
   * Bundle components carry a per-bottle special price so the bundle sums to the bundle price.
   */
  private async getProductWinestroIds(items: SanityOrder['items']): Promise<WinestroOrderItem[]> {
    const { createClient } = await import('@sanity/client')

    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      useCdn: false
    })

    const allItems: WinestroOrderItem[] = []

    for (const item of items) {
      // Fetch product with type detection and bundle items
      const product = await sanityClient.fetch(
        `*[_id == $productId][0]{
          _type,
          price,
          winestroId,
          artikelnummer,
          bundleItems[]{
            quantity,
            bundlePrice,
            product->{
              _id,
              price,
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

        // Price components so the bundle sums to the bundle price in Winestro
        const components: BundleComponentInput[] = product.bundleItems.map((bundleItem: {
          quantity: number
          bundlePrice?: number | null
          product?: { price?: number | null; winestroId?: string; artikelnummer?: string } | null
        }) => ({
          winestroId: bundleItem.product?.winestroId || bundleItem.product?.artikelnummer || '',
          quantity: bundleItem.quantity,
          productPrice: bundleItem.product?.price,
          bundlePrice: bundleItem.bundlePrice
        }))
        const split = components.every(c => c.winestroId)
          ? splitBundlePrice(product.price, components, item.quantity)
          : { ok: false as const, reason: 'component without winestroId' }

        if (split.ok) {
          console.log(`💶 Bundle ${item.product._ref} priced at ${Number(product.price).toFixed(2)} € (${split.source}):`,
            split.positions.map(p => `${p.quantity}× ${p.winestroId} @ ${formatCents(p.unitPriceCents)}`).join(', '))
          for (const position of split.positions) {
            allItems.push({
              winestroId: position.winestroId,
              quantity: position.quantity,
              sonderpreisCents: position.unitPriceCents
            })
          }
          continue
        }

        console.warn(`⚠️  Bundle ${item.product._ref} sent at catalog prices - ${split.reason}`)

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
    const b = splitStreetAndHouseNumber(billing.street, billing.houseNumber)
    const s = splitStreetAndHouseNumber(shipping.street, shipping.houseNumber)
    return (
      b.street !== s.street ||
      b.houseNumber !== s.houseNumber ||
      cleanAddressValue(billing.city) !== cleanAddressValue(shipping.city) ||
      cleanAddressValue(billing.postalCode) !== cleanAddressValue(shipping.postalCode) ||
      cleanAddressValue(billing.country) !== cleanAddressValue(shipping.country)
    )
  }

  /**
   * Transform Sanity order data to Winestro API format
   */
  private async transformOrderData(
    order: SanityOrder,
    items: WinestroOrderItem[],
    hasSeparateShipping: boolean
  ): Promise<Record<string, string | number>> {
    // Never send undefined/null; split "Albertstr. 5" into street + house number when needed
    const billing = splitStreetAndHouseNumber(order.billingAddress.street, order.billingAddress.houseNumber)
    const params: Record<string, string | number> = {
      // Billing address (customer)
      anrede: toWinestroAnrede(order.billingAddress.salutation),
      name: cleanAddressValue(order.billingAddress.firstName),
      nname: cleanAddressValue(order.billingAddress.lastName),
      email: cleanAddressValue(order.customerEmail),
      strasse: billing.street,
      hnummer: billing.houseNumber,
      plz: cleanAddressValue(order.billingAddress.postalCode),
      ort: cleanAddressValue(order.billingAddress.city),
      land: this.mapCountryCode(cleanAddressValue(order.billingAddress.country))
    }

    // Add company if provided
    if (cleanAddressValue(order.billingAddress.company)) {
      params.firma = cleanAddressValue(order.billingAddress.company)
    }

    // Add delivery address if different
    if (hasSeparateShipping) {
      const delivery = splitStreetAndHouseNumber(order.shippingAddress.street, order.shippingAddress.houseNumber)
      params.l_anrede = toWinestroAnrede(order.shippingAddress.salutation)
      params.l_name = cleanAddressValue(order.shippingAddress.firstName)
      params.l_nname = cleanAddressValue(order.shippingAddress.lastName)
      params.l_strasse = delivery.street
      params.l_hnummer = delivery.houseNumber
      params.l_plz = cleanAddressValue(order.shippingAddress.postalCode)
      params.l_ort = cleanAddressValue(order.shippingAddress.city)
      params.l_land = this.mapCountryCode(cleanAddressValue(order.shippingAddress.country))

      if (cleanAddressValue(order.shippingAddress.company)) {
        params.l_firma = cleanAddressValue(order.shippingAddress.company)
      }
    }

    // Add order items
    params.positionen = items.length
    items.forEach((item, index) => {
      const itemNumber = index + 1
      params[`wein_anzahl${itemNumber}`] = item.quantity
      params[`wein_id${itemNumber}`] = item.winestroId
      if (item.sonderpreisCents !== undefined) {
        params[`artikel_sonderpreis${itemNumber}`] = formatCents(item.sonderpreisCents)
      }
    })

    // Add payment and costs
    params.zahlungsart = this.mapPaymentMethod(order.paymentMethod)
    params.versandkosten = order.shipping.toFixed(2)
    params.gebuehr = "0"

    // Add voucher/gutschein if provided
    if (order.voucherCode && order.discount) {
      params.gutscheincode = order.voucherCode
      params.gutscheinwert = order.discount.toFixed(2)
    }

    // Add customer notes if provided
    if (order.customerNotes) {
      params.bemerkung = order.customerNotes
    }

    return params
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
      'bank_transfer': 2
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
    // undefined/null must never reach Winestro as the literal text "undefined"/"null"
    Object.entries(params).forEach(([key, value]) => {
      urlParams.append(key, value === undefined || value === null ? '' : String(value))
    })

    return `${this.winestroBaseUrl}?${urlParams.toString()}`
  }
}
