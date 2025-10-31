#!/usr/bin/env node

/**
 * Verification script to check if the migration was successful
 */

import { createClient } from '@sanity/client'

// Test project client
const testClient = createClient({
  projectId: 'wp652lez',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TEST_TOKEN || process.env.SANITY_API_TOKEN
})

const verifyMigration = async () => {
  console.log('🔍 Verifying migration to test project (wp652lez)...')
  console.log('-----------------------------------')
  
  try {
    // Check categories
    const categories = await testClient.fetch(`*[_type == "category"]`)
    console.log(`📂 Categories found: ${categories.length}`)
    
    // Check products
    const products = await testClient.fetch(`*[_type == "product"]`)
    console.log(`🍷 Products found: ${products.length}`)
    
    // Check assets
    const assets = await testClient.fetch(`*[_type == "sanity.imageAsset"]`)
    console.log(`📸 Assets found: ${assets.length}`)
    
    // Check orders
    const orders = await testClient.fetch(`*[_type == "order"]`)
    console.log(`📦 Orders found: ${orders.length}`)
    
    console.log('-----------------------------------')
    console.log('✅ Migration verification completed!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   • Categories: ${categories.length}`)
    console.log(`   • Products: ${products.length}`)
    console.log(`   • Assets: ${assets.length}`)
    console.log(`   • Orders: ${orders.length}`)
    
    if (categories.length > 0 && products.length > 0 && assets.length > 0) {
      console.log('')
      console.log('🎉 Migration appears to be successful!')
      console.log('Your project is now using the test project (wp652lez) with all migrated data.')
    } else {
      console.log('')
      console.log('⚠️  Some data might be missing. Please check the migration logs.')
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifyMigration().catch(console.error)
