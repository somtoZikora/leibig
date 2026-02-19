/**
 * Test voucher validation directly
 */

const WINESTRO_CONFIG = {
  baseUrl: process.env.WINESTRO_BASE_URL || 'https://nephele-s5.de/xml/v23.0/wbo-API.php',
  uid: process.env.WINESTRO_UID || '5348',
  apiUser: process.env.WINESTRO_API_USER || 'api-usr5348',
  apiCode: process.env.WINESTRO_API_CODE || 'bc60a86dea1c242d31acb41dd64d898d313a25a90b87d42c',
  shopId: process.env.WINESTRO_SHOP_ID || '1'
}

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

async function testValidation() {
  console.log('🧪 Testing voucher validation...\n')

  try {
    // Fetch vouchers
    const url = buildApiUrl('getGutscheine')
    const response = await fetch(url)
    const data = await response.json()

    console.log('📥 Raw API Response:')
    console.log(JSON.stringify(data, null, 2))
    console.log()

    const vouchers = data.gutschein || []
    console.log(`Found ${vouchers.length} vouchers\n`)

    // Test code to validate
    const testCode = '68083'
    const orderAmount = 100

    console.log(`🔍 Testing validation for code: "${testCode}"`)
    console.log(`   Order amount: €${orderAmount}\n`)

    // Find matching voucher
    console.log('Searching for matching voucher...')
    vouchers.forEach((v, idx) => {
      console.log(`  ${idx + 1}. Code: "${v.code}" (type: ${typeof v.code})`)
      console.log(`     String comparison: "${v.code}" === "${testCode}" => ${v.code === testCode}`)
      console.log(`     Lowercase comparison: "${String(v.code).toLowerCase()}" === "${testCode.toLowerCase()}" => ${String(v.code).toLowerCase() === testCode.toLowerCase()}`)
    })
    console.log()

    const matchingVoucher = vouchers.find(
      v => String(v.code).toLowerCase() === testCode.toLowerCase()
    )

    if (!matchingVoucher) {
      console.log('❌ No matching voucher found')
      return
    }

    console.log('✅ Found matching voucher:')
    console.log(JSON.stringify(matchingVoucher, null, 2))
    console.log()

    // Check expiration
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiryDate = new Date(matchingVoucher.gueltig_bis)
    expiryDate.setHours(0, 0, 0, 0)

    console.log(`📅 Date check:`)
    console.log(`   Today: ${today.toISOString().split('T')[0]}`)
    console.log(`   Expires: ${matchingVoucher.gueltig_bis}`)
    console.log(`   Expired: ${expiryDate < today}`)
    console.log()

    // Check usage
    console.log(`🔢 Usage check:`)
    console.log(`   Remaining uses: ${matchingVoucher.nutzbar}`)
    console.log(`   Has uses: ${matchingVoucher.nutzbar > 0}`)
    console.log()

    // Check minimum
    console.log(`💰 Minimum order check:`)
    console.log(`   Minimum: €${matchingVoucher.ab_wert}`)
    console.log(`   Order: €${orderAmount}`)
    console.log(`   Meets minimum: ${orderAmount >= Number(matchingVoucher.ab_wert)}`)
    console.log()

    // Calculate discount
    let discountAmount = 0
    if (matchingVoucher.wert && Number(matchingVoucher.wert) > 0) {
      discountAmount = Number(matchingVoucher.wert)
      console.log(`💵 Fixed discount: €${discountAmount}`)
    } else if (matchingVoucher.prozent && Number(matchingVoucher.prozent) > 0) {
      discountAmount = (orderAmount * Number(matchingVoucher.prozent)) / 100
      console.log(`💵 Percentage discount: ${matchingVoucher.prozent}% = €${discountAmount}`)
    }

    if (expiryDate >= today && matchingVoucher.nutzbar > 0 && orderAmount >= Number(matchingVoucher.ab_wert)) {
      console.log('\n✅ Voucher is VALID and should work!')
    } else {
      console.log('\n❌ Voucher is INVALID')
      if (expiryDate < today) console.log('   Reason: Expired')
      if (matchingVoucher.nutzbar <= 0) console.log('   Reason: No uses remaining')
      if (orderAmount < Number(matchingVoucher.ab_wert)) console.log('   Reason: Below minimum order')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testValidation()
