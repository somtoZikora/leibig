/**
 * Fetch Active Vouchers from WINESTRO
 *
 * This script fetches all active vouchers (discount codes) from WINESTRO
 * and displays them in a readable format for testing purposes.
 *
 * Usage:
 *   node scripts/fetch-vouchers.mjs
 *
 * Note: Update WINESTRO_CONFIG below with your credentials
 */

// WINESTRO API Configuration
// TODO: Replace with your actual credentials from .env file
const WINESTRO_CONFIG = {
  baseUrl: process.env.WINESTRO_BASE_URL || 'https://nephele-s5.de/xml/v23.0/wbo-API.php',
  uid: process.env.WINESTRO_UID || '5348',
  apiUser: process.env.WINESTRO_API_USER || 'api-usr5348',
  apiCode: process.env.WINESTRO_API_CODE || 'bc60a86dea1c242d31acb41dd64d898d313a25a90b87d42c',
  shopId: process.env.WINESTRO_SHOP_ID || '1'
}

// Check if credentials are configured
if (!WINESTRO_CONFIG.uid || !WINESTRO_CONFIG.apiUser || !WINESTRO_CONFIG.apiCode) {
  console.error('❌ WINESTRO credentials not configured!')
  console.error('\nPlease set environment variables or edit the script:')
  console.error('   - WINESTRO_BASE_URL')
  console.error('   - WINESTRO_UID')
  console.error('   - WINESTRO_API_USER')
  console.error('   - WINESTRO_API_CODE')
  console.error('   - WINESTRO_SHOP_ID (optional, defaults to 1)')
  process.exit(1)
}

/**
 * Build WINESTRO API URL
 */
function buildApiUrl(action) {
  const params = new URLSearchParams({
    UID: WINESTRO_CONFIG.uid,
    apiUSER: WINESTRO_CONFIG.apiUser,
    apiCODE: WINESTRO_CONFIG.apiCode,
    apiShopID: WINESTRO_CONFIG.shopId,
    apiACTION: action,
    output: 'json'
  })

  return `${WINESTRO_CONFIG.baseUrl}?${params.toString()}`
}

/**
 * Fetch active vouchers from WINESTRO
 */
async function fetchVouchers() {
  console.log('🎫 Fetching active vouchers from WINESTRO...\n')

  try {
    const url = buildApiUrl('getGutscheine')
    console.log('🔗 API URL:', url.replace(WINESTRO_CONFIG.apiCode, '***'))
    console.log()

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('📥 Raw API Response:', JSON.stringify(data, null, 2))
    console.log()

    // Check for vouchers in response (API returns "gutschein" not "gutscheine")
    if (!data.gutschein || !Array.isArray(data.gutschein)) {
      console.log('ℹ️  No active vouchers found in WINESTRO')
      console.log('   (Response structure may be different than expected)')
      return []
    }

    const vouchers = data.gutschein
    console.log(`✅ Found ${vouchers.length} active voucher(s):\n`)
    console.log('─'.repeat(80))

    vouchers.forEach((voucher, index) => {
      console.log(`\n${index + 1}. Voucher Code: ${voucher.code}`)
      console.log('   ├─ ID:', voucher.id_shop_gutschein)

      // Discount type and value
      if (voucher.prozent && Number(voucher.prozent) > 0) {
        console.log(`   ├─ Discount: ${voucher.prozent}% (percentage)`)
      } else if (voucher.wert && Number(voucher.wert) > 0) {
        console.log(`   ├─ Discount: €${Number(voucher.wert).toFixed(2)} (fixed amount)`)
      } else {
        console.log('   ├─ Discount: Not specified')
      }

      // Minimum order amount
      if (voucher.ab_wert) {
        console.log(`   ├─ Minimum Order: €${Number(voucher.ab_wert).toFixed(2)}`)
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
        const testAmount = Number(voucher.ab_wert) + 10
        console.log(`      • Valid: Order amount €${testAmount.toFixed(2)} (meets minimum)`)
        console.log(`      • Invalid: Order amount €${(Number(voucher.ab_wert) - 1).toFixed(2)} (below minimum)`)
      } else {
        console.log('      • Valid: Any order amount')
      }

      if (voucher.prozent && Number(voucher.prozent) > 0) {
        const exampleOrder = 100
        const discount = (exampleOrder * Number(voucher.prozent)) / 100
        console.log(`      • Example: €${exampleOrder} order → €${discount.toFixed(2)} discount`)
      } else if (voucher.wert && Number(voucher.wert) > 0) {
        console.log(`      • Example: Any order → €${Number(voucher.wert).toFixed(2)} discount`)
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
      const code = String(voucher.code).padEnd(20)
      const discount = (voucher.prozent && Number(voucher.prozent) > 0)
        ? `${voucher.prozent}%`.padEnd(20)
        : (voucher.wert && Number(voucher.wert) > 0)
          ? `€${Number(voucher.wert).toFixed(2)}`.padEnd(20)
          : 'N/A'.padEnd(20)
      const minOrder = voucher.ab_wert
        ? `€${Number(voucher.ab_wert).toFixed(2)}`.padEnd(15)
        : 'None'.padEnd(15)
      const expires = String(voucher.gueltig_bis).padEnd(15)
      const uses = String(voucher.nutzbar)

      console.log(code + discount + minOrder + expires + uses)
    })
    console.log('─'.repeat(80))

    // Export for easy copy-paste testing
    if (vouchers.length > 0) {
      console.log('\n📋 Codes for Copy-Paste Testing:')
      vouchers.forEach(v => {
        console.log(`   ${v.code}`)
      })
      console.log()
    }

    return vouchers

  } catch (error) {
    console.error('❌ Error fetching vouchers:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

// Run the script
fetchVouchers()
