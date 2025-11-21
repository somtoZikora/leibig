/**
 * Test script to verify Winestro API response structure
 * Run with: npx tsx scripts/test-winestro-api.ts
 */

// Winestro API credentials from the authenticated URL
const WINESTRO_CONFIG = {
  baseUrl: 'https://weinstore.net/xml/v21.0/wbo-API.php', // Using v21.0 from your URL
  uid: '5348',
  apiUser: 'api-usr5348',
  apiCode: 'bc60a86dea1c242d31acb41dd64d898d313a25a90b87d42c',
  shopId: '1'
}

function buildApiUrl(action: string, additionalParams: Record<string, string> = {}): string {
  const params = new URLSearchParams({
    UID: WINESTRO_CONFIG.uid,
    apiUSER: WINESTRO_CONFIG.apiUser,
    apiCODE: WINESTRO_CONFIG.apiCode,
    apiShopID: WINESTRO_CONFIG.shopId,
    apiACTION: action,
    output: 'json',
    ...additionalParams
  })

  return `${WINESTRO_CONFIG.baseUrl}?${params.toString()}`
}

async function testConnection() {
  console.log('🧪 Testing Winestro API Connection...\n')

  try {
    // Test 0: Try the exact URL structure you provided (without apiACTION)
    console.log('📋 Test 0: Testing exact URL structure from user...')
    const exactUrl = `${WINESTRO_CONFIG.baseUrl}?UID=${WINESTRO_CONFIG.uid}&apiUSER=${WINESTRO_CONFIG.apiUser}&apiCODE=${WINESTRO_CONFIG.apiCode}&apiShopID=${WINESTRO_CONFIG.shopId}&encoding=&output=json`
    console.log('URL:', exactUrl.replace(WINESTRO_CONFIG.apiCode, '***'))

    const exactResponse = await fetch(exactUrl)
    console.log('Status:', exactResponse.status, exactResponse.statusText)

    // Try to read the response body regardless of status
    const exactText = await exactResponse.text()
    console.log('Response body:', exactText)

    if (exactResponse.ok) {
      try {
        const exactData = JSON.parse(exactText)
        console.log('✅ Exact URL structure works!')
        console.log('Response keys:', Object.keys(exactData))
        console.log('Full response:', JSON.stringify(exactData, null, 2))
      } catch (e) {
        console.log('Could not parse as JSON')
      }
    }

    // Test 1: Fetch all products (limited output for testing)
    console.log('\n📋 Test 1: Fetching all products with apiACTION...')
    const allProductsUrl = buildApiUrl('getArtikel')
    console.log('URL:', allProductsUrl.replace(WINESTRO_CONFIG.apiCode, '***'))

    const response = await fetch(allProductsUrl)
    console.log('Status:', response.status, response.statusText)

    const responseText = await response.text()
    console.log('Response body:', responseText)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Response received')
    console.log('Response keys:', Object.keys(data))

    // Check if products array exists
    if (Array.isArray(data)) {
      console.log(`📦 Total products: ${data.length}`)
      if (data.length > 0) {
        console.log('\n🔍 Sample product structure (first product):')
        console.log(JSON.stringify(data[0], null, 2))
      }
    } else if (data.artikel) {
      console.log(`📦 Total products: ${Array.isArray(data.artikel) ? data.artikel.length : 1}`)
      if (data.artikel.length > 0) {
        console.log('\n🔍 Sample product structure (first product):')
        console.log(JSON.stringify(data.artikel[0], null, 2))
      }
    } else {
      console.log('⚠️  Unexpected response structure')
      console.log(JSON.stringify(data, null, 2))
    }

    // Test 2: Fetch single product by article number (if we found any)
    console.log('\n\n📋 Test 2: Fetching single product by article number...')
    let artikelNr = ''
    if (Array.isArray(data) && data.length > 0 && data[0].artikel_nr) {
      artikelNr = data[0].artikel_nr
    } else if (data.artikel && data.artikel[0]?.artikel_nr) {
      artikelNr = data.artikel[0].artikel_nr
    }

    if (artikelNr) {
      console.log(`Using article number: ${artikelNr}`)
      const singleProductUrl = buildApiUrl('getArtikel', { artikelnr: artikelNr })
      const singleResponse = await fetch(singleProductUrl)

      if (singleResponse.ok) {
        const singleData = await singleResponse.json()
        console.log('✅ Single product fetch successful')
        console.log(JSON.stringify(singleData, null, 2))
      }
    } else {
      console.log('⚠️  No article number found to test single product fetch')
    }

    // Test 3: Get stock for a product
    if (artikelNr) {
      console.log('\n\n📋 Test 3: Fetching stock for product...')
      const stockUrl = buildApiUrl('getBestand', { artikelnr: artikelNr })
      const stockResponse = await fetch(stockUrl)

      if (stockResponse.ok) {
        const stockData = await stockResponse.json()
        console.log('✅ Stock fetch successful')
        console.log(JSON.stringify(stockData, null, 2))
      }
    }

    console.log('\n\n✅ All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack:', error.stack)
    }
  }
}

// Run the tests
testConnection()
