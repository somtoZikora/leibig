import { createClient } from '@sanity/client'

// Write client (without CDN for write operations)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false, // Disable CDN for write operations
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Write token
})

// Types for Winestro API responses
export interface WinestroProduct {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  discount?: number
  images?: string[]
  category?: string
  tags?: string[]
  stock?: number
  rating?: number
  variants?: string[]
  status?: string
  // Add more fields based on Winestro API structure
}

export interface WinestroApiResponse {
  products: WinestroProduct[]
  total: number
  page: number
  limit: number
}

export class WinestroSyncService {
  private winestroApiUrl: string
  private winestroApiKey: string

  constructor() {
    this.winestroApiUrl = process.env.WINESTRO_API_URL || ''
    this.winestroApiKey = process.env.WINESTRO_API_KEY || ''
    
    if (!this.winestroApiUrl || !this.winestroApiKey) {
      throw new Error('Winestro API configuration missing. Please set WINESTRO_API_URL and WINESTRO_API_KEY in your .env file')
    }
  }

  /**
   * Test connection to Winestro API
   */
  async testWinestroConnection(): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    try {
      const response = await fetch(`${this.winestroApiUrl}/products?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.winestroApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Winestro API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: 'Successfully connected to Winestro API',
        data: {
          totalProducts: data.total,
          sampleProduct: data.products?.[0]?.name
        }
      }
    } catch (error: unknown) {
      return {
        success: false,
        message: `Failed to connect to Winestro API: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Fetch products from Winestro API
   */
  async fetchWinestroProducts(page = 1, limit = 50): Promise<WinestroProduct[]> {
    try {
      console.log(`📡 Fetching products from Winestro API (page ${page}, limit ${limit})...`)
      
      const response = await fetch(`${this.winestroApiUrl}/products?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.winestroApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Winestro API error: ${response.status} ${response.statusText}`)
      }

      const data: WinestroApiResponse = await response.json()
      console.log(`✅ Fetched ${data.products.length} products from Winestro`)
      
      return data.products
    } catch (error) {
      console.error('❌ Error fetching products from Winestro:', error)
      throw error
    }
  }

  /**
   * Upload image to Sanity from URL
   */
  async uploadImageToSanity(imageUrl: string, filename?: string): Promise<Record<string, unknown>> {
    try {
      console.log(`📸 Uploading image to Sanity: ${imageUrl}`)
      
      // Fetch image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }

      const imageBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(imageBuffer)
      
      // Upload to Sanity
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: filename || `winestro-image-${Date.now()}.jpg`
      })

      console.log(`✅ Uploaded image to Sanity: ${asset._id}`)
      return asset
    } catch (error) {
      console.error('❌ Error uploading image to Sanity:', error)
      throw error
    }
  }

  /**
   * Transform Winestro product to Sanity format
   */
  transformProductData(winestroProduct: WinestroProduct): Record<string, unknown> {
    // Generate slug from name
    const slug = winestroProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Map Winestro status to your Sanity status
    const mapStatus = (status?: string): "TOP-VERKÄUFER" | "STARTERSETS" | undefined => {
      if (!status) return undefined
      
      const statusMap: Record<string, "TOP-VERKÄUFER" | "STARTERSETS"> = {
        'bestseller': 'TOP-VERKÄUFER',
        'starter': 'STARTERSETS',
        'top': 'TOP-VERKÄUFER'
      }
      
      return statusMap[status.toLowerCase()]
    }

    // Map variant
    const mapVariant = (category?: string): "Im Angebot" | "Neuheiten" | "Weine" => {
      if (!category) return "Weine"
      
      const variantMap: Record<string, "Im Angebot" | "Neuheiten" | "Weine"> = {
        'sale': 'Im Angebot',
        'new': 'Neuheiten',
        'wine': 'Weine'
      }
      
      return variantMap[category.toLowerCase()] || "Weine"
    }

    return {
      _type: 'product',
      title: winestroProduct.name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: winestroProduct.description || '',
      price: winestroProduct.price,
      oldPrice: winestroProduct.originalPrice,
      discount: winestroProduct.discount,
      rating: winestroProduct.rating || 5,
      status: mapStatus(winestroProduct.status),
      variant: mapVariant(winestroProduct.category),
      tags: winestroProduct.tags || [],
      stock: winestroProduct.stock || 0,
      // External reference to track Winestro product ID
      winestroId: winestroProduct.id
    }
  }

  /**
   * Create or update product in Sanity
   */
  async createOrUpdateProduct(productData: Record<string, unknown>, images?: Record<string, unknown>[]): Promise<Record<string, unknown>> {
    try {
      // Check if product already exists (by winestroId)
      const existingProduct = await writeClient.fetch(
        `*[_type == "product" && winestroId == $winestroId][0]`,
        { winestroId: productData.winestroId }
      )

      let result
      if (existingProduct) {
        // Update existing product
        console.log(`🔄 Updating existing product: ${productData.title}`)
        result = await writeClient
          .patch(existingProduct._id)
          .set({
            ...productData,
            image: images?.[0] ? {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: images[0]._id
              }
            } : existingProduct.image,
            gallery: images && images.length > 1 ? 
              images.slice(1).map(img => ({
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: img._id
                }
              })) : existingProduct.gallery
          })
          .commit()
      } else {
        // Create new product
        console.log(`➕ Creating new product: ${productData.title}`)
        result = await writeClient.create({
          ...productData,
          image: images?.[0] ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: images[0]._id
            }
          } : undefined,
          gallery: images && images.length > 1 ? 
            images.slice(1).map(img => ({
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: img._id
              }
            })) : undefined
        })
      }

      console.log(`✅ Product saved to Sanity: ${result._id}`)
      return result
    } catch (error) {
      console.error('❌ Error saving product to Sanity:', error)
      throw error
    }
  }

  /**
   * Sync a single product from Winestro to Sanity
   */
  async syncSingleProduct(winestroProductId: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(`🔄 Syncing single product: ${winestroProductId}`)
      
      // Fetch single product from Winestro
      const response = await fetch(`${this.winestroApiUrl}/products/${winestroProductId}`, {
        headers: {
          'Authorization': `Bearer ${this.winestroApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch product ${winestroProductId}: ${response.status}`)
      }

      const winestroProduct: WinestroProduct = await response.json()
      
      // Transform data
      const productData = this.transformProductData(winestroProduct)
      
      // Upload images if available
      const uploadedImages: Record<string, unknown>[] = []
      if (winestroProduct.images && winestroProduct.images.length > 0) {
        for (const imageUrl of winestroProduct.images) {
          try {
            const asset = await this.uploadImageToSanity(imageUrl)
            uploadedImages.push(asset)
          } catch (error) {
            console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error)
          }
        }
      }
      
      // Create/update in Sanity
      const result = await this.createOrUpdateProduct(productData, uploadedImages)
      
      return {
        success: true,
        message: `Successfully synced product: ${winestroProduct.name}`,
        data: {
          sanityId: result._id,
          winestroId: winestroProductId,
          imagesUploaded: uploadedImages.length
        }
      }
    } catch (error: unknown) {
      return {
        success: false,
        message: `Failed to sync product ${winestroProductId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Sync only new or updated products (incremental sync)
   */
  async syncIncrementalProducts(): Promise<{ 
    success: boolean
    message: string
    stats: {
      total: number
      new: number
      updated: number
      failed: number
      errors: string[]
    }
  }> {
    const stats = {
      total: 0,
      new: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    }

    try {
      console.log('🔄 Starting incremental sync...')
      
      // Get last sync timestamp from Sanity
      const lastSyncDoc = await writeClient.fetch(
        `*[_type == "syncLog"] | order(_createdAt desc)[0]`
      )
      
      const lastSyncTime = lastSyncDoc?._createdAt || '1970-01-01T00:00:00Z'
      console.log(`📅 Last sync: ${lastSyncTime}`)
      
      // Fetch only products updated since last sync
      const response = await fetch(`${this.winestroApiUrl}/products?updated_since=${lastSyncTime}`, {
        headers: {
          'Authorization': `Bearer ${this.winestroApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Winestro API error: ${response.status}`)
      }

      const data = await response.json()
      const products = data.products || []
      
      console.log(`📊 Found ${products.length} products to sync`)
      stats.total = products.length
      
      for (const product of products) {
        try {
          // Check if product exists in Sanity
          const existingProduct = await writeClient.fetch(
            `*[_type == "product" && winestroId == $winestroId][0]`,
            { winestroId: product.id }
          )
          
          const productData = this.transformProductData(product)
          
          // Upload images if available
          const uploadedImages: Record<string, unknown>[] = []
          if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
              try {
                const asset = await this.uploadImageToSanity(imageUrl)
                uploadedImages.push(asset)
              } catch (error) {
                console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error)
              }
            }
          }
          
          // Create or update product
          await this.createOrUpdateProduct(productData, uploadedImages)
          
          if (existingProduct) {
            stats.updated++
            console.log(`🔄 Updated: ${product.name}`)
          } else {
            stats.new++
            console.log(`➕ Created: ${product.name}`)
          }
          
        } catch (error: any) {
          stats.failed++
          const errorMsg = `Failed to sync ${product.name}: ${error.message}`
          stats.errors.push(errorMsg)
          console.error(`❌ ${errorMsg}`)
        }
      }
      
      // Create sync log entry
      await writeClient.create({
        _type: 'syncLog',
        timestamp: new Date().toISOString(),
        stats,
        success: true
      })
      
      console.log(`✅ Incremental sync completed: ${stats.new} new, ${stats.updated} updated`)
      
      return {
        success: true,
        message: `Incremental sync completed. ${stats.new} new products, ${stats.updated} updated products.`,
        stats
      }
      
    } catch (error: any) {
      console.error('❌ Incremental sync failed:', error)
      return {
        success: false,
        message: `Incremental sync failed: ${error.message}`,
        stats
      }
    }
  }
  async syncProducts(options: { 
    limit?: number
    batchSize?: number
    startPage?: number 
  } = {}): Promise<{ 
    success: boolean
    message: string
    stats: {
      total: number
      successful: number
      failed: number
      errors: string[]
    }
  }> {
    const { limit = 100, batchSize = 20, startPage = 1 } = options
    const stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    }

    try {
      console.log(`🚀 Starting Winestro product sync...`)
      console.log(`📊 Settings: limit=${limit}, batchSize=${batchSize}, startPage=${startPage}`)
      
      let currentPage = startPage
      let totalProcessed = 0
      
      while (totalProcessed < limit) {
        const remainingLimit = Math.min(batchSize, limit - totalProcessed)
        
        try {
          // Fetch products from Winestro
          const products = await this.fetchWinestroProducts(currentPage, remainingLimit)
          
          if (products.length === 0) {
            console.log('📋 No more products to sync')
            break
          }
          
          stats.total += products.length
          
          // Process each product
          for (const winestroProduct of products) {
            try {
              console.log(`🔄 Processing: ${winestroProduct.name}`)
              
              // Transform data
              const productData = this.transformProductData(winestroProduct)
              
              // Upload images if available
              let uploadedImages: any[] = []
              if (winestroProduct.images && winestroProduct.images.length > 0) {
                for (const imageUrl of winestroProduct.images) {
                  try {
                    const asset = await this.uploadImageToSanity(imageUrl)
                    uploadedImages.push(asset)
                  } catch (error) {
                    console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error)
                  }
                }
              }
              
              // Create/update in Sanity
              await this.createOrUpdateProduct(productData, uploadedImages)
              
              stats.successful++
              console.log(`✅ Successfully synced: ${winestroProduct.name}`)
              
            } catch (error: unknown) {
              stats.failed++
              const errorMsg = `Failed to sync ${winestroProduct.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
              stats.errors.push(errorMsg)
              console.error(`❌ ${errorMsg}`)
            }
            
            totalProcessed++
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          currentPage++
          
        } catch (error: unknown) {
          const errorMsg = `Failed to fetch page ${currentPage}: ${error instanceof Error ? error.message : 'Unknown error'}`
          stats.errors.push(errorMsg)
          console.error(`❌ ${errorMsg}`)
          break
        }
      }
      
      console.log(`🎉 Sync completed!`)
      console.log(`📊 Stats: ${stats.successful} successful, ${stats.failed} failed, ${stats.total} total`)
      
      return {
        success: stats.successful > 0,
        message: `Sync completed. Successfully synced ${stats.successful} out of ${stats.total} products.`,
        stats
      }
      
    } catch (error: unknown) {
      console.error('❌ Sync process failed:', error)
      return {
        success: false,
        message: `Sync process failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        stats
      }
    }
  }
}