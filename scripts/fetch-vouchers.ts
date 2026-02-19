/**
 * Fetch Active Vouchers from WINESTRO
 *
 * This script fetches all active vouchers (discount codes) from WINESTRO
 * and displays them in a readable format for testing purposes.
 *
 * Usage:
 *   npx tsx scripts/fetch-vouchers.ts
 *
 * Note: Requires WINESTRO environment variables to be set
 */

import { WinestroVoucherService } from '../lib/winestro-voucher'

// Check for required environment variables
const requiredEnvVars = [
  'WINESTRO_BASE_URL',
  'WINESTRO_UID',
  'WINESTRO_API_USER',
  'WINESTRO_API_CODE'
]

const missingVars = requiredEnvVars.filter(v => !process.env[v])
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(v => console.error(`   - ${v}`))
  console.error('\nPlease ensure your .env file is configured correctly.')
  process.exit(1)
}

async function main() {
  console.log('🎫 Fetching active vouchers from WINESTRO...\n')

  try {
    const voucherService = new WinestroVoucherService()
    const vouchers = await voucherService.getActiveVouchers()

    if (vouchers.length === 0) {
      console.log('ℹ️  No active vouchers found in WINESTRO')
      return
    }

    console.log(`✅ Found ${vouchers.length} active voucher(s):\n`)
    console.log('─'.repeat(80))

    vouchers.forEach((voucher, index) => {
      console.log(`\n${index + 1}. Voucher Code: ${voucher.code}`)
      console.log('   ├─ ID:', voucher.id_shop_gutschein)

      // Discount type and value
      if (voucher.prozent) {
        console.log(`   ├─ Discount: ${voucher.prozent}% (percentage)`)
      } else if (voucher.wert) {
        console.log(`   ├─ Discount: €${voucher.wert.toFixed(2)} (fixed amount)`)
      } else {
        console.log('   ├─ Discount: Not specified')
      }

      // Minimum order amount
      if (voucher.ab_wert) {
        console.log(`   ├─ Minimum Order: €${voucher.ab_wert.toFixed(2)}`)
      } else {
        console.log('   ├─ Minimum Order: None')
      }

      // Expiration
      console.log(`   ├─ Expires: ${voucher.gueltig_bis}`)

      // Remaining uses
      console.log(`   └─ Remaining Uses: ${voucher.nutzbar}`)

      // Test examples
      console.log('\n   📝 Test Examples:')
      if (voucher.ab_wert) {
        const testAmount = voucher.ab_wert + 10
        console.log(`      • Valid: Order amount €${testAmount.toFixed(2)} (meets minimum)`)
        console.log(`      • Invalid: Order amount €${(voucher.ab_wert - 1).toFixed(2)} (below minimum)`)
      } else {
        console.log('      • Valid: Any order amount')
      }

      if (voucher.prozent) {
        const exampleOrder = 100
        const discount = (exampleOrder * voucher.prozent) / 100
        console.log(`      • Example: €${exampleOrder} order → €${discount.toFixed(2)} discount`)
      } else if (voucher.wert) {
        console.log(`      • Example: Any order → €${voucher.wert.toFixed(2)} discount`)
      }
    })

    console.log('\n' + '─'.repeat(80))
    console.log('\n💡 Tips for Testing:')
    console.log('   1. Copy a voucher code above')
    console.log('   2. Add products to cart (ensure subtotal meets minimum if required)')
    console.log('   3. Enter the code in the cart page')
    console.log('   4. Click "Anwenden" to validate\n')

    // Summary table
    console.log('📊 Quick Reference Table:')
    console.log('─'.repeat(80))
    console.log(
      'Code'.padEnd(20) +
      'Discount'.padEnd(20) +
      'Min. Order'.padEnd(15) +
      'Expires'.padEnd(15) +
      'Uses'
    )
    console.log('─'.repeat(80))

    vouchers.forEach(voucher => {
      const code = voucher.code.padEnd(20)
      const discount = voucher.prozent
        ? `${voucher.prozent}%`.padEnd(20)
        : voucher.wert
          ? `€${voucher.wert.toFixed(2)}`.padEnd(20)
          : 'N/A'.padEnd(20)
      const minOrder = voucher.ab_wert
        ? `€${voucher.ab_wert.toFixed(2)}`.padEnd(15)
        : 'None'.padEnd(15)
      const expires = voucher.gueltig_bis.padEnd(15)
      const uses = voucher.nutzbar.toString()

      console.log(code + discount + minOrder + expires + uses)
    })
    console.log('─'.repeat(80))

    // Export for easy copy-paste testing
    console.log('\n📋 Codes for Copy-Paste Testing:')
    vouchers.forEach(v => {
      console.log(`   ${v.code}`)
    })
    console.log()

  } catch (error) {
    console.error('❌ Error fetching vouchers:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  }
}

main()
