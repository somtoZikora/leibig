import { createClient, SanityDocument } from '@sanity/client'
import { writeClient as sanityWriteClient } from './sanity'

// Write client (without CDN for write operations)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false, // Disable CDN for write operations
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Write token
})

// Types for Winestro API responses
// Based on Winestro XML API v21.0 documentation
export interface WinestroProduct {
  // Legacy/fallback fields (for backwards compatibility)
  id?: string
  name?: string
  description?: string
  price?: number
  originalPrice?: number
  discount?: number
  images?: string[]
  category?: string
  tags?: string[]
  stock?: number
  rating?: number
  variants?: string[]
  status?: string

  // Actual Winestro API fields (artikel_* from XML API)
  artikel_nr?: string  // Article number (primary identifier)
  artikel_name?: string  // Product name
  artikel_beschreibung?: string  // Description text
  artikel_typ?: string  // Article type/group
  artikel_typ_id?: string  // Internal type number

  // Pricing
  artikel_preis?: number | string  // Current price (€)
  artikel_streichpreis?: number | string  // Previous/crossed-out price
  artikel_literpreis?: number | string  // Price per liter
  artikel_mwst?: number | string  // VAT rate

  // Wine-specific properties
  artikel_jahrgang?: string  // Vintage year
  artikel_sorte?: string  // Grape variety
  artikel_qualitaet?: string  // Quality designation
  artikel_geschmack?: string  // Taste profile
  artikel_lage?: string  // Vineyard location
  artikel_anbaugebiet?: string  // Growing region
  artikel_alkohol?: number | string  // Alcohol percentage
  artikel_saeure?: number | string  // Acidity level
  artikel_zucker?: number | string  // Sugar content
  artikel_liter?: number | string  // Bottle volume
  artikel_gewicht?: number | string  // Weight in kg
  artikel_sulfite?: number | string  // Contains sulfites (1/0)

  // Nutrition information
  artikel_brennwert?: number | string  // Energy/calories per 100ml
  artikel_kohlenhydrate?: number | string  // Carbohydrates per 100ml
  artikel_eiweiss?: number | string  // Protein per 100ml
  artikel_fett?: number | string  // Fat per 100ml
  artikel_salz?: number | string  // Salt per 100ml

  // Images (use _big versions for better quality)
  artikel_bild?: string  // Small image URL
  artikel_bild_big?: string  // Large image URL (preferred)
  artikel_bild_2?: string  // Small image 2
  artikel_bild_big_2?: string  // Large image 2
  artikel_bild_3?: string  // Small image 3
  artikel_bild_big_3?: string  // Large image 3
  artikel_bild_4?: string  // Small image 4
  artikel_bild_big_4?: string  // Large image 4

  // Stock/Inventory
  artikel_bestand?: number | string  // Total free stock
  artikel_bestand_webshop?: number | string  // Web shop warehouse stock
  artikel_bestand_warnung_ab?: number | string  // Stock warning threshold
  artikel_bestand_firmenverbund?: number | string  // Corporate group stock

  // Additional metadata
  artikel_erzeuger_text?: string  // Producer information text
  artikel_erzeuger_name?: string  // Producer name
  artikel_last_modified?: string  // Last modification timestamp
  artikel_farbe?: string  // Color (rot/weiß/rosé)
  artikel_ean13?: string  // EAN-13 barcode
  artikel_ean13_kiste?: string  // Case EAN-13
  artikel_zutaten?: string  // Ingredients list
  artikel_mhd?: string  // Best-by date
  artikel_versandfrei?: number | string  // Free shipping flag
  artikel_ausgetrunken?: string  // Discontinued date
  artikel_videolink?: string  // Video URL
  artikel_apnr?: string  // Wine approval number
  artikel_kategorie?: string  // Sales category
}

export interface WinestroApiResponse {
  products: WinestroProduct[]
  total: number
  page: number
  limit: number
}

export class WinestroSyncService {
  private winestroBaseUrl: string
  private winestroUID: string
  private winestroApiUser: string
  private winestroApiCode: string
  private winestroShopId: string

  constructor() {
    this.winestroBaseUrl = process.env.WINESTRO_BASE_URL || 'https://weinstore.net/xml/v21.0/wbo-API.php'
    this.winestroUID = process.env.WINESTRO_UID || ''
    this.winestroApiUser = process.env.WINESTRO_API_USER || ''
    this.winestroApiCode = process.env.WINESTRO_API_CODE || ''
    this.winestroShopId = process.env.WINESTRO_SHOP_ID || '1'

    if (!this.winestroUID || !this.winestroApiUser || !this.winestroApiCode) {
      console.warn('⚠️  Winestro API configuration incomplete. Please set WINESTRO_UID, WINESTRO_API_USER, and WINESTRO_API_CODE in your .env file')
    }
  }

  /**
   * Build Winestro API URL with authentication parameters
   * @param action - The API action (e.g., 'getArtikel', 'getBestand')
   * @param additionalParams - Additional query parameters
   * @returns Complete API URL with all parameters
   */
  private buildApiUrl(action: string, additionalParams: Record<string, string | number> = {}): string {
    const params = new URLSearchParams({
      UID: this.winestroUID,
      apiUSER: this.winestroApiUser,
      apiCODE: this.winestroApiCode,
      apiShopID: this.winestroShopId,
      apiACTION: action,
      output: 'json'
    })

    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })

    return `${this.winestroBaseUrl}?${params.toString()}`
  }

  /**
   * Test connection to Winestro API
   */
  async testWinestroConnection(): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    try {
      const url = this.buildApiUrl('getArtikel')
      console.log('🧪 Testing connection to Winestro API...')
      console.log('🔗 URL:', url)

      const response = await fetch(url)

      // Handle 204 No Content (no products in shop)
      if (response.status === 204) {
        return {
          success: true,
          message: 'Connected to Winestro API successfully, but no products found in this shop (Shop ID: ' + this.winestroShopId + '). Check that products exist in this shop or try a different shop ID.',
          data: {
            totalProducts: 0
          }
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.text) {
            errorMessage = errorData.text
          }
        } catch {
          // Error response is not JSON, use the text as-is
          errorMessage = errorText.substring(0, 200) // Limit error text length
        }

        throw new Error(`Winestro API error: ${errorMessage}`)
      }

      // Get the raw response text first
      const responseText = await response.text()
      console.log('📄 Response preview:', responseText.substring(0, 200))

      // Check if response is empty
      if (!responseText || responseText.trim().length === 0) {
        return {
          success: true,
          message: 'Connected to Winestro API, but received empty response. This may indicate no products in shop ID: ' + this.winestroShopId,
          data: {
            totalProducts: 0
          }
        }
      }

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        // Response might be XML instead of JSON
        console.error('❌ Failed to parse response as JSON')
        throw new Error(`API returned invalid JSON. Response starts with: ${responseText.substring(0, 100)}... This might be an XML response. Check if the API supports JSON output or if credentials are incorrect.`)
      }

      // Winestro returns products in different structures
      // Could be array directly or wrapped in an object
      let products = []
      if (Array.isArray(data)) {
        products = data
      } else if (data.artikel) {
        products = Array.isArray(data.artikel) ? data.artikel : [data.artikel]
      } else if (data.item) {
        products = Array.isArray(data.item) ? data.item : [data.item]
      }

      return {
        success: true,
        message: 'Successfully connected to Winestro API',
        data: {
          totalProducts: products.length,
          sampleProduct: products[0]?.artikel_name || products[0]?.name
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
   * Note: Winestro API returns all products at once (no pagination)
   * The page and limit parameters are kept for backwards compatibility but are not used by the API
   */
  async fetchWinestroProducts(page = 1, limit = 50): Promise<WinestroProduct[]> {
    try {
      console.log(`📡 Fetching all products from Winestro API...`)

      // Winestro's getArtikel action without parameters returns ALL products in the shop
      const url = this.buildApiUrl('getArtikel')
      const response = await fetch(url)

      // Handle 204 No Content (no products in shop)
      if (response.status === 204) {
        console.log('⚠️  No products found in this shop (204 No Content)')
        return []
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Winestro API error (${response.status}): ${errorText}`)
      }

      // Get response text first to handle empty responses
      const responseText = await response.text()
      if (!responseText || responseText.trim().length === 0) {
        console.log('⚠️  API returned empty response')
        return []
      }

      const data = JSON.parse(responseText)

      // Parse products from response
      // Winestro can return products in different formats:
      // 1. Direct array of products
      // 2. Object with 'artikel' property containing array
      // 3. Object with 'artikel' property containing single object
      // 4. Object with 'item' property containing single object or array
      let products: WinestroProduct[] = []

      if (Array.isArray(data)) {
        products = data
      } else if (data.artikel) {
        products = Array.isArray(data.artikel) ? data.artikel : [data.artikel]
      } else if (data.item) {
        products = Array.isArray(data.item) ? data.item : [data.item]
      } else {
        console.warn('⚠️  Unexpected response structure from Winestro API')
        console.log('Response keys:', Object.keys(data))
      }

      console.log(`✅ Fetched ${products.length} products from Winestro`)

      return products
    } catch (error) {
      console.error('❌ Error fetching products from Winestro:', error)
      throw error
    }
  }

  /**
   * Upload image to Sanity from URL
   */
  private async uploadImageFromUrl(imageUrl: string, filename: string): Promise<{ _id: string; url: string } | null> {
    try {
      console.log(`📸 Uploading image: ${filename}`)
      
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }
      
      const buffer = Buffer.from(await response.arrayBuffer())
      const uploadedAsset = await sanityWriteClient.assets.upload('image', buffer, {
        filename
      })
      
      return {
        _id: uploadedAsset._id,
        url: uploadedAsset.url
      }
    } catch (error: unknown) {
      console.error('❌ Error uploading image:', error)
      return null
    }
  }

  /**
   * Transform Winestro product to Sanity format
   * Maps Winestro API field names (artikel_*) to Sanity schema
   */
  transformProductData(winestroProduct: WinestroProduct): Record<string, unknown> {
    // Get product name from actual Winestro field names
    console.log('🔍 Winestro product data:', winestroProduct)
    const productName = winestroProduct.artikel_name || winestroProduct.name || 'Untitled Product'

    // Generate slug from name
    const slug = productName
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Map Winestro status/type to Sanity status
    const mapStatus = (typ?: string): "TOP-VERKÄUFER" | "STARTERSETS" | undefined => {
      if (!typ) return undefined

      const statusMap: Record<string, "TOP-VERKÄUFER" | "STARTERSETS"> = {
        'bestseller': 'TOP-VERKÄUFER',
        'starter': 'STARTERSETS',
        'starterset': 'STARTERSETS',
        'top': 'TOP-VERKÄUFER'
      }

      return statusMap[typ.toLowerCase()]
    }

    // Map variant based on type
    const mapVariant = (typ?: string): "Im Angebot" | "Neuheiten" | "Weine" => {
      if (!typ) return "Weine"

      const variantMap: Record<string, "Im Angebot" | "Neuheiten" | "Weine"> = {
        'angebot': 'Im Angebot',
        'sale': 'Im Angebot',
        'neu': 'Neuheiten',
        'new': 'Neuheiten',
        'wein': 'Weine',
        'wine': 'Weine',
        'sekt': 'Weine'
      }

      return variantMap[typ.toLowerCase()] || "Weine"
    }

    // Helper to filter out empty objects and invalid values
    const getValue = (value: any): string | number | undefined => {
      if (value === null || value === undefined) return undefined
      // Check if it's an empty object
      if (typeof value === 'object' && Object.keys(value).length === 0) return undefined
      // Check if it's an empty string
      if (typeof value === 'string' && !value.trim()) return undefined
      // Return valid string or number
      if (typeof value === 'string' || typeof value === 'number') return value
      return undefined
    }

    // Parse price (could be string or number in Winestro API)
    const parsePrice = (price: any): number | undefined => {
      if (typeof price === 'number' && price > 0) return price
      if (typeof price === 'string') {
        const cleaned = price.replace(',', '.')
        const parsed = parseFloat(cleaned)
        return !isNaN(parsed) && parsed > 0 ? parsed : undefined
      }
      return undefined
    }

    return {
      _type: 'product',
      title: productName,
      slug: {
        _type: 'slug',
        current: slug
      },
      // Note: Description is NOT synced from Winestro - managed manually in Sanity
      // description field is omitted to preserve manually curated content
      price: parsePrice(winestroProduct.artikel_preis || winestroProduct.price) || 0,
      oldPrice: parsePrice(winestroProduct.artikel_streichpreis || winestroProduct.originalPrice),
      discount: winestroProduct.discount,
      rating: winestroProduct.rating || 5,
      status: mapStatus(winestroProduct.artikel_typ || winestroProduct.status),
      variant: mapVariant(winestroProduct.artikel_typ || winestroProduct.category),
      tags: winestroProduct.tags || [],
      stock: parseInt(String(winestroProduct.artikel_bestand_webshop || winestroProduct.stock || 0)),
      // External reference to track Winestro product ID
      winestroId: winestroProduct.artikel_nr || winestroProduct.id,
      // Winestro-specific fields
      artikelnummer: getValue(winestroProduct.artikel_nr),
      jahrgang: getValue(winestroProduct.artikel_jahrgang),
      rebsorte: getValue(winestroProduct.artikel_sorte),
      qualitaet: getValue(winestroProduct.artikel_qualitaet),
      geschmack: getValue(winestroProduct.artikel_geschmack),
      alkohol: winestroProduct.artikel_alkohol ? parseFloat(String(winestroProduct.artikel_alkohol)) : undefined,
      liter: winestroProduct.artikel_liter ? parseFloat(String(winestroProduct.artikel_liter)) : undefined,
      zucker: winestroProduct.artikel_zucker ? parseFloat(String(winestroProduct.artikel_zucker)) : undefined,
      saeure: winestroProduct.artikel_saeure ? parseFloat(String(winestroProduct.artikel_saeure)) : undefined,
      brennwert: winestroProduct.artikel_brennwert ? parseFloat(String(winestroProduct.artikel_brennwert)) : undefined,
      kohlenhydrate: winestroProduct.artikel_kohlenhydrate ? parseFloat(String(winestroProduct.artikel_kohlenhydrate)) : undefined,
      eiweiss: winestroProduct.artikel_eiweiss ? parseFloat(String(winestroProduct.artikel_eiweiss)) : undefined,
      fett: winestroProduct.artikel_fett ? parseFloat(String(winestroProduct.artikel_fett)) : undefined,
      salz: winestroProduct.artikel_salz ? parseFloat(String(winestroProduct.artikel_salz)) : undefined,
      erzeuger: (() => {
        // Build producer information: text first, then name
        const erzeugerParts: string[] = []

        const text = getValue(winestroProduct.artikel_erzeuger_text)
        const name = getValue(winestroProduct.artikel_erzeuger_name)

        if (text) erzeugerParts.push(text as string)
        if (name) erzeugerParts.push(name as string)

        return erzeugerParts.length > 0 ? erzeugerParts.join('\n') : undefined
      })()
    }
  }

  /**
   * Create or update product in Sanity
   */
  async createOrUpdateProduct(productData: Record<string, unknown>, images?: { _id: string; url: string }[], isNewProduct = false): Promise<Record<string, unknown>> {
    try {
      // Validate that we have a winestroId
      if (!productData.winestroId) {
        throw new Error(`Cannot sync product: missing winestroId. Product data: ${JSON.stringify(productData, null, 2)}`)
      }

      console.log(`🔍 Checking if product exists with winestroId: ${productData.winestroId}`)

      // Check if product already exists (by winestroId)
      const existingProduct = await writeClient.fetch(
        `*[_type == "product" && winestroId == $winestroId][0]`,
        { winestroId: productData.winestroId }
      )

      let result
      if (existingProduct) {
        // Update existing product - DO NOT re-upload images, keep existing ones
        console.log(`🔄 Updating existing product: ${productData.title} (ID: ${existingProduct._id}, keeping existing images)`)
        result = await writeClient
          .patch(existingProduct._id)
          .set({
            ...productData,
            // Keep existing images - don't overwrite
            image: existingProduct.image,
            gallery: existingProduct.gallery
          })
          .commit()
      } else {
        // Create new product
        console.log(`➕ Creating new product: ${productData.title}`)
        result = await writeClient.create({
          _type: 'product', // Add required _type field
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
   * @param artikelnr - The article number (artikel_nr) from Winestro
   */
  async syncSingleProduct(artikelnr: string): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    try {
      console.log(`🔄 Syncing single product: ${artikelnr}`)

      // Fetch single product from Winestro using artikelnr parameter
      const url = this.buildApiUrl('getArtikel', { artikelnr })
      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch product ${artikelnr}: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Parse the product from response (could be array or single object)
      let winestroProduct: WinestroProduct
      if (Array.isArray(data)) {
        winestroProduct = data[0]
      } else if (data.artikel) {
        winestroProduct = Array.isArray(data.artikel) ? data.artikel[0] : data.artikel
      } else if (data.item) {
        winestroProduct = data.item
      } else {
        winestroProduct = data
      }

      if (!winestroProduct) {
        throw new Error(`Product ${artikelnr} not found in Winestro`)
      }

      console.log('📦 Raw Winestro product data:')
      console.log(JSON.stringify(winestroProduct, null, 2))

      // Transform data
      const productData = this.transformProductData(winestroProduct)

      console.log('🔄 Transformed product data for Sanity:')
      console.log(JSON.stringify(productData, null, 2))
      
      // Upload images if available (use Winestro's large image URLs)
      const uploadedImages: { _id: string; url: string }[] = []
      const imageUrls = [
        winestroProduct.artikel_bild_big,
        winestroProduct.artikel_bild_big_2,
        winestroProduct.artikel_bild_big_3,
        winestroProduct.artikel_bild_big_4
      ].filter(Boolean) // Remove undefined/null values

      for (const imageUrl of imageUrls) {
        try {
          const fileName = `${winestroProduct.artikel_nr || 'product'}-${uploadedImages.length + 1}.jpg`
          const asset = await this.uploadImageFromUrl(imageUrl!, fileName)
          if (asset) {
            uploadedImages.push(asset)
          }
        } catch (error) {
          console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error)
        }
      }

      console.log(`📸 Uploaded ${uploadedImages.length} images`)

      // Create/update in Sanity
      console.log('💾 Saving to Sanity...')
      const result = await this.createOrUpdateProduct(productData, uploadedImages)
      
      return {
        success: true,
        message: `Successfully synced product: ${winestroProduct.artikel_name || winestroProduct.name}`,
        data: {
          sanityId: result._id,
          artikelnr: artikelnr,
          imagesUploaded: uploadedImages.length
        }
      }
    } catch (error: unknown) {
      return {
        success: false,
        message: `Failed to sync product ${artikelnr}: ${error instanceof Error ? error.message : 'Unknown error'}`
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

      // Note: Winestro API doesn't support date filtering
      // We fetch all products and check artikel_last_modified field
      const url = this.buildApiUrl('getArtikel')
      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Winestro API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Parse products from response
      let allProducts: WinestroProduct[] = []
      if (Array.isArray(data)) {
        allProducts = data
      } else if (data.artikel) {
        allProducts = Array.isArray(data.artikel) ? data.artikel : [data.artikel]
      } else if (data.item) {
        allProducts = Array.isArray(data.item) ? data.item : [data.item]
      }

      // Filter products that have been modified since last sync
      const products = allProducts.filter(product => {
        if (!product.artikel_last_modified) return true // Include products without timestamp
        return new Date(product.artikel_last_modified) > new Date(lastSyncTime)
      })
      
      console.log(`📊 Found ${products.length} products to sync`)
      stats.total = products.length
      
      for (const product of products) {
        try {
          // Check if product exists in Sanity
          const existingProduct = await writeClient.fetch(
            `*[_type == "product" && winestroId == $winestroId][0]`,
            { winestroId: product.artikel_nr || product.id }
          )

          const productData = this.transformProductData(product)

          // Upload images if available (use Winestro's large image URLs)
          const uploadedImages: { _id: string; url: string }[] = []
          const imageUrls = [
            product.artikel_bild_big,
            product.artikel_bild_big_2,
            product.artikel_bild_big_3,
            product.artikel_bild_big_4
          ].filter(Boolean)

          for (const imageUrl of imageUrls) {
            try {
              const fileName = `${product.artikel_nr || 'product'}-${uploadedImages.length + 1}.jpg`
              const asset = await this.uploadImageFromUrl(imageUrl!, fileName)
              if (asset) {
                uploadedImages.push(asset)
              }
            } catch (error) {
              console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error)
            }
          }

          // Create or update product
          await this.createOrUpdateProduct(productData, uploadedImages)

          if (existingProduct) {
            stats.updated++
            console.log(`🔄 Updated: ${product.artikel_name || product.name}`)
          } else {
            stats.new++
            console.log(`➕ Created: ${product.artikel_name || product.name}`)
          }

        } catch (error: unknown) {
          stats.failed++
          const errorMsg = `Failed to sync ${product.artikel_name || product.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
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
      
    } catch (error: unknown) {
      console.error('❌ Incremental sync failed:', error)
      return {
        success: false,
        message: `Incremental sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        stats
      }
    }
  }

  async createProduct(productData: Record<string, unknown>): Promise<SanityDocument> {
    try {
      console.log(`➕ Creating new product: ${productData.title}`)
      const result = await writeClient.create({
        _type: 'product', // Ensure _type is included
        ...productData
      })
      console.log(`✅ Product created: ${result._id}`)
      return result
    } catch (error) {
      console.error('❌ Error creating product:', error)
      throw error
    }
  }

  async updateProduct(productId: string, productData: Record<string, unknown>): Promise<SanityDocument> {
    try {
      console.log(`🔄 Updating product: ${productId}`)
      const result = await writeClient.patch(productId).set(productData).commit()
      console.log(`✅ Product updated: ${result._id}`)
      return result
    } catch (error) {
      console.error('❌ Error updating product:', error)
      throw error
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
              const uploadedImages: { _id: string; url: string }[] = []
              if (winestroProduct.images && winestroProduct.images.length > 0) {
                const primaryImageUrl = winestroProduct.images[0]

                const uploadResult = await this.uploadImageFromUrl(primaryImageUrl, `${winestroProduct.name || 'product'}-main.jpg`)
                if (uploadResult) {
                  productData.image = {
                    _type: 'image',
                    asset: {
                      _type: 'reference',
                      _ref: uploadResult._id
                    }
                  }
                  uploadedImages.push(uploadResult)
                }

                // Upload gallery images
                if (winestroProduct.images && Array.isArray(winestroProduct.images) && winestroProduct.images.length > 1) {
                  const galleryImages: { _id: string; url: string }[] = []

                  const additionalUploads = await Promise.all(
                    winestroProduct.images.slice(1).map((imageUrl: string, index: number) =>
                      this.uploadImageFromUrl(imageUrl, `${winestroProduct.name || 'product'}-${index + 1}.jpg`)
                    )
                  )

                  galleryImages.push(
                    ...additionalUploads.filter((asset): asset is { _id: string; url: string } => asset !== null)
                  )
                  uploadedImages.push(...galleryImages)

                  if (galleryImages.length > 0) {
                    productData.gallery = galleryImages.map(asset => ({
                      _type: 'image',
                      asset: {
                        _type: 'reference',
                        _ref: asset._id
                      }
                    }))
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