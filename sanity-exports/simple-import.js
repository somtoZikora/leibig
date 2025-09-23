#!/usr/bin/env node

/**
 * Simplified Sanity Data Import Script (without images)
 * This script imports data without image references to avoid missing asset errors
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Destination Sanity client (new account)
const destinationClient = createClient({
  projectId: '2hqr3d91',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skbnX9WHmYtYpc2uLtyf7hmz5hHhWM23zhGRGKameGtko06kJzy39tGyWAjx1DQL3FerZ7Rju4If0yP0zaQvet7JRejn3rAp4EXEnTUrowVw1Ur7bzuA6qNeyFAAZUyYoYLqiJpIwGinPpP0atkoPy2DKIQptNPILdfpaB8u4VIcbYLfIvBn'
})

const cleanDocument = (doc) => {
  const cleaned = { ...doc }
  delete cleaned._id
  delete cleaned._createdAt
  delete cleaned._updatedAt
  delete cleaned._rev
  
  // Remove image references to avoid missing asset errors
  delete cleaned.image
  delete cleaned.gallery
  
  return cleaned
}

const importData = async () => {
  console.log('🚀 Starting simplified data import to project: 2hqr3d91')
  console.log('📝 Note: Images will be skipped to avoid missing asset errors')
  
  try {
    // Import categories first
    const categoriesPath = path.join(process.cwd(), 'sanity-exports', 'categories.json')
    if (fs.existsSync(categoriesPath)) {
      console.log('📂 Importing categories...')
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
      
      for (const category of categories) {
        try {
          const cleaned = cleanDocument(category)
          await destinationClient.create(cleaned)
          console.log(`✅ Imported category: ${category.title}`)
        } catch (error) {
          console.error(`❌ Failed to import category ${category.title}:`, error.message)
        }
      }
    }
    
    // Import products
    const productsPath = path.join(process.cwd(), 'sanity-exports', 'products.json')
    if (fs.existsSync(productsPath)) {
      console.log('🍷 Importing products...')
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      
      for (const product of products) {
        try {
          const cleaned = cleanDocument(product)
          // Also remove category references for now
          delete cleaned.category
          await destinationClient.create(cleaned)
          console.log(`✅ Imported product: ${product.title}`)
        } catch (error) {
          console.error(`❌ Failed to import product ${product.title}:`, error.message)
        }
      }
    }
    
    // Skip orders for now as they reference products
    console.log('📦 Skipping orders (they reference products that may not exist yet)')
    
    console.log('-----------------------------------')
    console.log('🎉 Simplified import completed!')
    console.log('📝 Next steps:')
    console.log('1. Check your Sanity Studio at https://2hqr3d91.sanity.studio/')
    console.log('2. Add images manually through the Studio interface')
    console.log('3. Link categories to products as needed')
    console.log('4. Test your application with the new project')
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

importData().catch(console.error)