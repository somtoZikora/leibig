import { createClient } from '@sanity/client'
import fetch from 'node-fetch'

// Source Sanity client (your current account)
const sourceClient = createClient({
  projectId: 'pmw0w9kh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skpCIyD4w0ymdlMOEyWNkcPwiPJ0U06kyxs5IlIQCR7kURP9AsI8uEtDYVv1KhuO3901QrBahluaZNKkhMirCR3iN9j1IfISejFB3cfsIIQ3GdEouB95vMZAKqhku0Mu6MRKvv3A6AYFqjjVFs6Qj8Tza9T5dKuzvAvUT6Eogk3iWeZ1HjZg'
})

// Destination Sanity client (new account)
const destinationClient = createClient({
  projectId: '2hqr3d91',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skDCBEuOwBxHRBlM0A37oc2hkO3HYWQo71VteJlWFL8TAYQxZ0YR9dWtlKy5tFUv2j7VMtih2N2xU4mNgJfEGz27LZOfjH1K3KP4GGsKP1uXVvMDUIyh2e9oxSi2ZQ3GCdTgGUFQgqZfCjIWobhIZgUSRPBp4sXttsGFvk7y6BfxWw0PeqLV'
})

// Helper function to clean document for migration
const cleanDocument = (doc) => {
  const cleaned = { ...doc }
  delete cleaned._id
  delete cleaned._createdAt
  delete cleaned._updatedAt
  delete cleaned._rev
  return cleaned
}

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

// Asset mapping to update references
let assetMapping = {}

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

// Main migration function
const runMigration = async () => {
  console.log('🚀 Starting Sanity data migration...')
  console.log('📊 Source Project:', 'pmw0w9kh')
  console.log('📊 Destination Project:', '2hqr3d91')
  console.log('-----------------------------------')
  
  try {
    // Step 1: Migrate assets first
    console.log('Step 1/4: Migrating assets...')
    assetMapping = await migrateAssets()
    
    // Step 2: Migrate categories
    console.log('Step 2/4: Migrating categories...')
    const categoryMapping = await migrateCategories()
    
    // Step 3: Migrate products
    console.log('Step 3/4: Migrating products...')
    const productMapping = await migrateProducts(categoryMapping)
    
    // Step 4: Migrate orders
    console.log('Step 4/4: Migrating orders...')
    await migrateOrders(productMapping)
    
    console.log('-----------------------------------')
    console.log('🎉 Migration completed successfully!')
    console.log(`📊 Categories migrated: ${categoryMapping.length}`)
    console.log(`📊 Products migrated: ${productMapping.length}`)
    console.log(`📊 Assets migrated: ${Object.keys(assetMapping).length}`)
    
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