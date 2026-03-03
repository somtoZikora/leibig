/**
 * Winestro Voucher Service
 * Handles voucher (Gutschein) validation via Winestro API
 */

export interface WinestroVoucher {
  id_shop_gutschein: number      // Voucher identifier
  gueltig_bis: string             // Expiration date (YYYY-MM-DD)
  wert?: number                   // Fixed monetary value (if applicable)
  prozent?: number                // Percentage discount (if applicable)
  code: string                    // Voucher code
  ab_wert?: number                // Minimum order amount required
  nutzbar: number                 // Number of times voucher can be used
}

export interface WinestroVouchersResponse {
  gutschein?: WinestroVoucher[]  // API returns "gutschein" (singular) not "gutscheine"
  error?: string
}

export interface VoucherValidationResult {
  valid: boolean
  voucher?: {
    code: string
    value?: number           // Fixed discount amount in EUR
    percentage?: number      // Percentage discount (0-100)
    minOrderAmount?: number  // Minimum order amount required
    expiresAt: string        // Expiration date
    usagesRemaining: number  // Number of uses remaining
  }
  error?: string
  discount?: number          // Calculated discount amount for this order
}

export class WinestroVoucherService {
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
   * Fetch all active vouchers from Winestro
   */
  async getActiveVouchers(): Promise<WinestroVoucher[]> {
    try {
      console.log('🎫 Fetching active vouchers from Winestro...')

      const url = this.buildApiUrl('getGutscheine')

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Winestro API returned ${response.status}: ${response.statusText}`)
      }

      const data: WinestroVouchersResponse = await response.json()

      console.log('📥 Winestro vouchers response:', JSON.stringify(data, null, 2))

      if (!data.gutschein || !Array.isArray(data.gutschein)) {
        console.warn('⚠️  No vouchers found in Winestro response')
        return []
      }

      console.log(`✅ Retrieved ${data.gutschein.length} active vouchers from Winestro`)
      return data.gutschein
    } catch (error) {
      console.error('❌ Error fetching Winestro vouchers:', error)
      throw error
    }
  }

  /**
   * Validate a voucher code against Winestro's active vouchers
   * @param code - The voucher code to validate
   * @param orderAmount - The current order subtotal to check against minimum requirements
   */
  async validateVoucher(code: string, orderAmount: number): Promise<VoucherValidationResult> {
    try {
      console.log(`🔍 Validating voucher code: ${code} for order amount: €${orderAmount}`)

      // Fetch all active vouchers
      const vouchers = await this.getActiveVouchers()

      // Find matching voucher (case-insensitive)
      const matchingVoucher = vouchers.find(
        v => v.code.toLowerCase() === code.toLowerCase()
      )

      if (!matchingVoucher) {
        console.log('❌ Voucher code not found')
        return {
          valid: false,
          error: 'Ungültiger Gutscheincode'
        }
      }

      // Check if voucher is expired
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      const expiryDate = new Date(matchingVoucher.gueltig_bis)
      expiryDate.setHours(0, 0, 0, 0)

      if (expiryDate < today) {
        console.log(`❌ Voucher expired on ${matchingVoucher.gueltig_bis}`)
        return {
          valid: false,
          error: 'Dieser Gutschein ist abgelaufen'
        }
      }

      // Check if voucher has usages remaining
      if (matchingVoucher.nutzbar <= 0) {
        console.log('❌ Voucher has no remaining usages')
        return {
          valid: false,
          error: 'Dieser Gutschein wurde bereits vollständig eingelöst'
        }
      }

      // Check minimum order amount
      if (matchingVoucher.ab_wert && orderAmount < matchingVoucher.ab_wert) {
        console.log(`❌ Order amount €${orderAmount} is below minimum €${matchingVoucher.ab_wert}`)
        return {
          valid: false,
          error: `Mindestbestellwert von €${matchingVoucher.ab_wert.toFixed(2)} nicht erreicht`
        }
      }

      // Calculate discount amount
      let discountAmount = 0
      if (matchingVoucher.wert && matchingVoucher.wert > 0) {
        // Fixed value discount
        discountAmount = matchingVoucher.wert * 1
      } else if (matchingVoucher.prozent && matchingVoucher.prozent > 0) {
        // Percentage discount
        discountAmount = (orderAmount * matchingVoucher.prozent) / 100
      }

      console.log(`✅ Voucher valid! Discount: €${discountAmount.toFixed(2)}`)

      return {
        valid: true,
        voucher: {
          code: matchingVoucher.code,
          value: (matchingVoucher.wert ?? 0) * 1,
          percentage: (matchingVoucher.prozent ?? 0) * 1,
          minOrderAmount: matchingVoucher.ab_wert,
          expiresAt: matchingVoucher.gueltig_bis,
          usagesRemaining: matchingVoucher.nutzbar
        },
        discount: discountAmount
      }
    } catch (error) {
      console.error('❌ Error validating voucher:', error)
      return {
        valid: false,
        error: 'Fehler bei der Überprüfung des Gutscheincodes'
      }
    }
  }

  /**
   * Build Winestro API URL with authentication parameters
   */
  private buildApiUrl(action: string): string {
    const urlParams = new URLSearchParams({
      UID: this.winestroUID,
      apiUSER: this.winestroApiUser,
      apiCODE: this.winestroApiCode,
      apiShopID: this.winestroShopId,
      apiACTION: action,
      output: 'json'
    })

    return `${this.winestroBaseUrl}?${urlParams.toString()}`
  }
}
