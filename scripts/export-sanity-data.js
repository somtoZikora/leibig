#!/usr/bin/env node

/**
 * Sanity Data Migration Script
 * This script exports data from your current Sanity project and provides instructions for import
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Source Sanity client (your current account)
const sourceClient = createClient({
  projectId: 'pmw0w9kh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skpCIyD4w0ymdlMOEyWNkcPwiPJ0U06kyxs5IlIQCR7kURP9AsI8uEtDYVv1KhuO3901QrBahluaZNKkhMirCR3iN9j1IfISejFB3cfsIIQ3GdEouB95vMZAKqhku0Mu6MRKvv3A6AYFqjjVFs6Qj8Tza9T5dKuzvAvUT6Eogk3iWeZ1HjZg'
})

// Create exports directory
const exportsDir = path.join(process.cwd(), 'sanity-exports')
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir)
}

// Export functions
const exportCategories = async () => {
  console.log('📂 Exporting categories...')
  
  try {
    const categories = await sourceClient.fetch(`
      *[_type == "category"] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        description,
        image
      }
    `)
    
    fs.writeFileSync(
      path.join(exportsDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    )
    
    console.log(`✅ Exported ${categories.length} categories to categories.json`)
    return categories.length
    
  } catch (error) {
    console.error('❌ Failed to export categories:', error.message)
    return 0
  }
}

const exportProducts = async () => {
  console.log('🍷 Exporting products...')
  
  try {
    const products = await sourceClient.fetch(`
      *[_type == "product"] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        image,
        gallery,
        description,
        price,
        oldPrice,
        discount,
        rating,
        sizes,
        status,
        variant,
        category,
        tags,
        stock
      }
    `)
    
    fs.writeFileSync(
      path.join(exportsDir, 'products.json'),
      JSON.stringify(products, null, 2)
    )
    
    console.log(`✅ Exported ${products.length} products to products.json`)
    return products.length
    
  } catch (error) {
    console.error('❌ Failed to export products:', error.message)
    return 0
  }
}

const exportOrders = async () => {
  console.log('📦 Exporting orders...')
  
  try {
    const orders = await sourceClient.fetch(`
      *[_type == "order"] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        orderNumber,
        customerEmail,
        customerName,
        userId,
        status,
        items,
        subtotal,
        tax,
        taxRate,
        shipping,
        total,
        currency,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus,
        paymentId,
        paymentDetails,
        notes,
        trackingNumber,
        estimatedDelivery,
        actualDelivery,
        createdAt,
        updatedAt
      }
    `)
    
    fs.writeFileSync(
      path.join(exportsDir, 'orders.json'),
      JSON.stringify(orders, null, 2)
    )
    
    console.log(`✅ Exported ${orders.length} orders to orders.json`)
    return orders.length
    
  } catch (error) {
    console.error('❌ Failed to export orders:', error.message)
    return 0
  }
}

const createImportScript = () => {
  const importScript = `#!/usr/bin/env node

/**
 * Sanity Data Import Script
 * Run this script to import the exported data to your new Sanity project
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
  token: 'skDCBEuOwBxHRBlM0A37oc2hkO3HYWQo71VteJlWFL8TAYQxZ0YR9dWtlKy5tFUv2j7VMtih2N2xU4mNgJfEGz27LZOfjH1K3KP4GGsKP1uXVvMDUIyh2e9oxSi2ZQ3GCdTgGUFQgqZfCjIWobhIZgUSRPBp4sXttsGFvk7y6BfxWw0PeqLV'
})

const cleanDocument = (doc) => {
  const cleaned = { ...doc }
  delete cleaned._id
  delete cleaned._createdAt
  delete cleaned._updatedAt
  delete cleaned._rev
  return cleaned
}

const importData = async () => {
  console.log('🚀 Starting data import to project: 2hqr3d91')
  
  try {
    // Import categories first
    const categoriesPath = path.join(process.cwd(), 'sanity-exports', 'categories.json')
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
      
      for (const category of categories) {
        try {
          const cleaned = cleanDocument(category)
          await destinationClient.create(cleaned)
          console.log(\`✅ Imported category: \${category.title}\`)
        } catch (error) {
          console.error(\`❌ Failed to import category \${category.title}:\`, error.message)
        }
      }
    }
    
    // Import products
    const productsPath = path.join(process.cwd(), 'sanity-exports', 'products.json')
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      
      for (const product of products) {
        try {
          const cleaned = cleanDocument(product)
          await destinationClient.create(cleaned)
          console.log(\`✅ Imported product: \${product.title}\`)
        } catch (error) {
          console.error(\`❌ Failed to import product \${product.title}:\`, error.message)
        }
      }
    }
    
    // Import orders
    const ordersPath = path.join(process.cwd(), 'sanity-exports', 'orders.json')
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))
      
      for (const order of orders) {
        try {
          const cleaned = cleanDocument(order)
          await destinationClient.create(cleaned)
          console.log(\`✅ Imported order: \${order.orderNumber}\`)
        } catch (error) {
          console.error(\`❌ Failed to import order \${order.orderNumber}:\`, error.message)
        }
      }
    }
    
    console.log('🎉 Import completed!')
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

importData().catch(console.error)
`

  fs.writeFileSync(path.join(exportsDir, 'import-to-new-account.js'), importScript)
  console.log('📄 Created import script: import-to-new-account.js')
}

// Main export function
const runExport = async () => {
  console.log('🚀 Starting Sanity data export...')
  console.log('📊 Source Project: pmw0w9kh')
  console.log('📁 Export Directory:', exportsDir)
  console.log('-----------------------------------')
  
  try {
    const categoryCount = await exportCategories()
    const productCount = await exportProducts()
    const orderCount = await exportOrders()
    
    createImportScript()
    
    console.log('-----------------------------------')
    console.log('🎉 Export completed successfully!')
    console.log(`📊 Categories exported: ${categoryCount}`)
    console.log(`📊 Products exported: ${productCount}`)
    console.log(`📊 Orders exported: ${orderCount}`)
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Review the exported files in the sanity-exports directory')
    console.log('2. Run the import script: node sanity-exports/import-to-new-account.js')
    console.log('3. Check your new Sanity project (2hqr3d91) for the imported data')
    
  } catch (error) {
    console.error('❌ Export failed:', error)
  }
}

runExport().catch(console.error)