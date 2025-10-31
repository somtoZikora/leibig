#!/usr/bin/env node

import { createClient } from '@sanity/client'

// Test project client
const testClient = createClient({
  projectId: 'wp652lez',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TEST_TOKEN || process.env.SANITY_API_TOKEN
})

const checkTestProject = async () => {
  console.log('🔍 Checking test project (wp652lez) data...')
  
  try {
    const products = await testClient.fetch(`*[_type == "product"]`)
    const categories = await testClient.fetch(`*[_type == "category"]`)
    const assets = await testClient.fetch(`*[_type == "sanity.imageAsset"]`)
    
    console.log(`📊 Test project contains:`)
    console.log(`   • Products: ${products.length}`)
    console.log(`   • Categories: ${categories.length}`)
    console.log(`   • Assets: ${assets.length}`)
    
    if (products.length > 0) {
      console.log('✅ Test project has data!')
      console.log('Sample product:', products[0].title)
    } else {
      console.log('❌ Test project appears to be empty')
    }
    
  } catch (error) {
    console.error('❌ Error checking test project:', error.message)
  }
}

checkTestProject().catch(console.error)
