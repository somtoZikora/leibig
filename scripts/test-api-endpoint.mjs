/**
 * Test the voucher validation API endpoint
 * Make sure dev server is running: npm run dev
 */

async function testApiEndpoint() {
  console.log('🧪 Testing /api/vouchers/validate endpoint...\n')

  const testCases = [
    { code: '68083', orderAmount: 100, expectedValid: true, description: '10% voucher with €100 order' },
    { code: '17528', orderAmount: 50, expectedValid: true, description: '€8 fixed voucher' },
    { code: 'INVALID', orderAmount: 100, expectedValid: false, description: 'Invalid code' }
  ]

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.description}`)
    console.log(`   Code: ${testCase.code}`)
    console.log(`   Order Amount: €${testCase.orderAmount}`)

    try {
      const response = await fetch('http://localhost:3000/api/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: testCase.code,
          orderAmount: testCase.orderAmount
        })
      })

      const data = await response.json()

      console.log(`   Status: ${response.status}`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))

      if (data.valid === testCase.expectedValid) {
        console.log(`   ✅ PASS - Got expected result\n`)
      } else {
        console.log(`   ❌ FAIL - Expected valid=${testCase.expectedValid}, got valid=${data.valid}\n`)
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`)
    }
  }
}

// Check if server is running first
console.log('Checking if dev server is running at http://localhost:3000...\n')

try {
  const healthCheck = await fetch('http://localhost:3000')
  if (healthCheck.ok) {
    console.log('✅ Server is running!\n')
    await testApiEndpoint()
  } else {
    console.log('⚠️  Server responded but with error status\n')
    await testApiEndpoint()
  }
} catch (error) {
  console.error('❌ Dev server is not running!')
  console.error('   Please start it with: npm run dev\n')
  process.exit(1)
}
