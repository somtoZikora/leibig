import { NextRequest, NextResponse } from 'next/server'
import { WinestroVoucherService } from '@/lib/winestro-voucher'

/**
 * POST /api/vouchers/validate
 * Validates a voucher code against Winestro API
 *
 * Request body:
 * {
 *   code: string         // Voucher code to validate
 *   orderAmount: number  // Current order subtotal (for minimum order check)
 * }
 *
 * Response:
 * {
 *   valid: boolean
 *   voucher?: {
 *     code: string
 *     value?: number
 *     percentage?: number
 *     minOrderAmount?: number
 *     expiresAt: string
 *     usagesRemaining: number
 *   }
 *   discount?: number
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderAmount } = body

    // Validate request body
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          error: 'Gutscheincode ist erforderlich'
        },
        { status: 400 }
      )
    }

    if (orderAmount === undefined || typeof orderAmount !== 'number' || orderAmount < 0) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Ungültiger Bestellbetrag'
        },
        { status: 400 }
      )
    }

    // Validate voucher using Winestro API
    const voucherService = new WinestroVoucherService()
    const result = await voucherService.validateVoucher(code, orderAmount)

    // Return validation result
    if (result.valid) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Error in voucher validation API:', error)
    return NextResponse.json(
      {
        valid: false,
        error: 'Fehler bei der Überprüfung des Gutscheincodes'
      },
      { status: 500 }
    )
  }
}
