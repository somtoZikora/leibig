#!/usr/bin/env node

/**
 * Sanity Data Migration Script: wineshop -> test
 * This script migrates data from wineshop project (2hqr3d91) to test project (wp652lez)
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Source Sanity client (wineshop project)
const sourceClient = createClient({
  projectId: '2hqr3d91', // wineshop project
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skDCBEuOwBxHRBlM0A37oc2hkO3HYWQo71VteJlWFL8TAYQxZ0YR9dWtlKy5tFUv2j7VMtih2N2xU4mNgJfEGz27LZOfjH1K3KP4GGsKP1uXVvMDUIyh2e9oxSi2ZQ3GCdTgGUFQgqZfCjIWobhIZgUSRPBp4sXttsGFvk7y6BfxWw0PeqLV'
})

// Destination Sanity client (test project)
const destinationClient = createClient({
  projectId: '3y5r987r', // test project
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skB70nRYsDP9bVVzZSAoJ9imqzsLqaOvyT0wZBBV4QpZY4m3wcSjo11zg5EUOhlJ9rcyU5ji4rkz5Sz6RXzeNsyNbNxNRJVOboIYvbrC8jxuFxsGVU7frXx393DTp3YfA6lU1xFAXKGtIiXsWceNCMSxm5KIl8bexn1DTicTJcjX9L3BeA5L'
})

// Create exports directory for this migration
const exportsDir = path.join(process.cwd(), 'sanity-exports', 'wineshop-to-test')
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true })
}

// Helper function to clean document for migration
const cleanDocument = (doc) => {
  const cleaned = { ...doc }
  delete cleaned._id
  delete cleaned._createdAt
  delete cleaned._updatedAt
  delete cleaned._rev
  return cleaned
}

// Asset mapping to update references
let assetMapping = {}

// Function to migrate assets (images)
const migrateAssets = async () => {
  console.log('📸 Starting asset migration...')
  
  try {
    const assets = await sourceClient.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        _type,
        url,
        originalFilename,
        size,
        metadata
      }
    `)
    
    console.log(`Found ${assets.length} assets to migrate`)
    
    for (const asset of assets) {
      try {
        // Download the asset from source
        const response = await fetch(asset.url)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Upload to destination
        const uploadedAsset = await destinationClient.assets.upload('image', buffer, {
          filename: asset.originalFilename || 'migrated-image.jpg'
        })
        
        console.log(`✅ Migrated asset: ${asset.originalFilename || asset._id}`)
        
        // Store mapping for reference updates
        assetMapping[asset._id] = uploadedAsset._id
        
      } catch (error) {
        console.error(`❌ Failed to migrate asset ${asset._id}:`, error.message)
      }
    }
    
    console.log('✅ Asset migration completed')
    return assetMapping
    
  } catch (error) {
    console.error('❌ Asset migration failed:', error)
    return {}
  }
}

// Function to update asset references in documents
const updateAssetReferences = (obj, mapping) => {
  if (!obj || typeof obj !== 'object') return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => updateAssetReferences(item, mapping))
  }
  
  const updated = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === '_ref' && typeof value === 'string' && mapping[value]) {
      updated[key] = mapping[value]
    } else if (typeof value === 'object') {
      updated[key] = updateAssetReferences(value, mapping)
    } else {
      updated[key] = value
    }
  }
  
  return updated
}

// Function to migrate categories
const migrateCategories = async () => {
  console.log('📂 Starting category migration...')
  
  try {
    const categories = await sourceClient.fetch(`
      *[_type == "category"] {
        _id,
        _type,
        title,
        slug,
        description,
        image
      }
    `)
    
    console.log(`Found ${categories.length} categories to migrate`)
    
    const migratedCategories = []
    
    for (const category of categories) {
      try {
        const cleanedCategory = cleanDocument(category)
        
        // Update asset references
        const updatedCategory = updateAssetReferences(cleanedCategory, assetMapping)
        
        const result = await destinationClient.create(updatedCategory)
        migratedCategories.push({ original: category._id, new: result._id })
        
        console.log(`✅ Migrated category: ${category.title}`)
        
      } catch (error) {
        console.error(`❌ Failed to migrate category ${category.title}:`, error.message)
      }
    }
    
    console.log('✅ Category migration completed')
    return migratedCategories
    
  } catch (error) {
    console.error('❌ Category migration failed:', error)
    return []
  }
}

// Function to migrate products
const migrateProducts = async (categoryMapping) => {
  console.log('🍷 Starting product migration...')
  
  try {
    const products = await sourceClient.fetch(`
      *[_type == "product"] {
        _id,
        _type,
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
    
    console.log(`Found ${products.length} products to migrate`)
    
    const migratedProducts = []
    
    for (const product of products) {
      try {
        const cleanedProduct = cleanDocument(product)
        
        // Update asset references
        let updatedProduct = updateAssetReferences(cleanedProduct, assetMapping)
        
        // Update category references
        if (updatedProduct.category && updatedProduct.category._ref) {
          const categoryMap = categoryMapping.find(map => map.original === updatedProduct.category._ref)
          if (categoryMap) {
            updatedProduct.category._ref = categoryMap.new
          }
        }
        
        const result = await destinationClient.create(updatedProduct)
        migratedProducts.push({ original: product._id, new: result._id })
        
        console.log(`✅ Migrated product: ${product.title}`)
        
      } catch (error) {
        console.error(`❌ Failed to migrate product ${product.title}:`, error.message)
      }
    }
    
    console.log('✅ Product migration completed')
    return migratedProducts
    
  } catch (error) {
    console.error('❌ Product migration failed:', error)
    return []
  }
}

// Function to migrate orders
const migrateOrders = async (productMapping) => {
  console.log('📦 Starting order migration...')
  
  try {
    const orders = await sourceClient.fetch(`
      *[_type == "order"] {
        _id,
        _type,
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
    
    console.log(`Found ${orders.length} orders to migrate`)
    
    for (const order of orders) {
      try {
        const cleanedOrder = cleanDocument(order)
        
        // Update product references in order items
        if (cleanedOrder.items && Array.isArray(cleanedOrder.items)) {
          cleanedOrder.items = cleanedOrder.items.map(item => {
            if (item.product && item.product._ref) {
              const productMap = productMapping.find(map => map.original === item.product._ref)
              if (productMap) {
                return {
                  ...item,
                  product: {
                    ...item.product,
                    _ref: productMap.new
                  }
                }
              }
            }
            return item
          })
        }
        
        const result = await destinationClient.create(cleanedOrder)
        console.log(`✅ Migrated order: ${order.orderNumber}`)
        
      } catch (error) {
        console.error(`❌ Failed to migrate order ${order.orderNumber}:`, error.message)
      }
    }
    
    console.log('✅ Order migration completed')
    
  } catch (error) {
    console.error('❌ Order migration failed:', error)
  }
}

// Function to export data for backup
const exportData = async () => {
  console.log('💾 Creating backup export...')
  
  try {
    // Export categories
    const categories = await sourceClient.fetch(`*[_type == "category"]`)
    fs.writeFileSync(
      path.join(exportsDir, 'categories-backup.json'),
      JSON.stringify(categories, null, 2)
    )
    
    // Export products
    const products = await sourceClient.fetch(`*[_type == "product"]`)
    fs.writeFileSync(
      path.join(exportsDir, 'products-backup.json'),
      JSON.stringify(products, null, 2)
    )
    
    // Export orders
    const orders = await sourceClient.fetch(`*[_type == "order"]`)
    fs.writeFileSync(
      path.join(exportsDir, 'orders-backup.json'),
      JSON.stringify(orders, null, 2)
    )
    
    console.log('✅ Backup export completed')
    
  } catch (error) {
    console.error('❌ Backup export failed:', error)
  }
}

// Main migration function
const runMigration = async () => {
  console.log('🚀 Starting Sanity data migration: wineshop -> test')
  console.log('📊 Source Project: 2hqr3d91 (wineshop)')
  console.log('📊 Destination Project: wp652lez (test)')
  console.log('📁 Export Directory:', exportsDir)
  console.log('-----------------------------------')
  
  try {
    // Step 0: Create backup export
    console.log('Step 0/5: Creating backup export...')
    await exportData()
    
    // Step 1: Migrate assets first
    console.log('Step 1/5: Migrating assets...')
    assetMapping = await migrateAssets()
    
    // Step 2: Migrate categories
    console.log('Step 2/5: Migrating categories...')
    const categoryMapping = await migrateCategories()
    
    // Step 3: Migrate products
    console.log('Step 3/5: Migrating products...')
    const productMapping = await migrateProducts(categoryMapping)
    
    // Step 4: Migrate orders
    console.log('Step 4/5: Migrating orders...')
    await migrateOrders(productMapping)
    
    // Step 5: Create migration report
    console.log('Step 5/5: Creating migration report...')
    const report = {
      migrationDate: new Date().toISOString(),
      sourceProject: '2hqr3d91 (wineshop)',
      destinationProject: 'wp652lez (test)',
      results: {
        assetsMigrated: Object.keys(assetMapping).length,
        categoriesMigrated: categoryMapping.length,
        productsMigrated: productMapping.length,
        ordersMigrated: 'See logs above'
      },
      mappings: {
        assets: assetMapping,
        categories: categoryMapping,
        products: productMapping
      }
    }
    
    fs.writeFileSync(
      path.join(exportsDir, 'migration-report.json'),
      JSON.stringify(report, null, 2)
    )
    
    console.log('-----------------------------------')
    console.log('🎉 Migration completed successfully!')
    console.log(`📊 Assets migrated: ${Object.keys(assetMapping).length}`)
    console.log(`📊 Categories migrated: ${categoryMapping.length}`)
    console.log(`📊 Products migrated: ${productMapping.length}`)
    console.log(`📁 Backup files saved to: ${exportsDir}`)
    console.log(`📄 Migration report: ${path.join(exportsDir, 'migration-report.json')}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
runMigration().catch(console.error)

export {
  runMigration,
  migrateCategories,
  migrateProducts,
  migrateOrders,
  migrateAssets
}
