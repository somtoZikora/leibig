"use client"

import { client, wineQueries, type WineProduct, type Category, type SanityImage } from './sanity'
import { 
  USE_MOCK_DATA, 
  mockProducts, 
  mockCategories,
  getMockStarterSets,
  getMockTopSellers,
  getMockProductBySlug,
  getMockProductsByCategory,
  getMockProductsByVariant,
  searchMockProducts
} from './mockData'

// Data service that handles switching between mock and real data
export class DataService {
  // Product queries
  static async getStarterSets(): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for starter sets')
      return getMockStarterSets()
    }
    
    try {
      return await client.fetch(wineQueries.starterSets)
    } catch (error) {
      console.error('Error fetching starter sets:', error)
      return []
    }
  }

  static async getTopSellers(limit: number = 4, offset: number = 0): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for top sellers')
      const topSellers = getMockTopSellers()
      return topSellers.slice(offset, offset + limit)
    }
    
    try {
      return await client.fetch(wineQueries.topSellers, { limit, offset })
    } catch (error) {
      console.error('Error fetching top sellers:', error)
      return []
    }
  }

  static async getProductBySlug(slug: string): Promise<WineProduct | null> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for single product')
      return getMockProductBySlug(slug) || null
    }
    
    try {
      return await client.fetch(wineQueries.singleProduct, { slug })
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  }

  static async getProductsByCategory(categorySlug: string): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for products by category')
      return getMockProductsByCategory(categorySlug)
    }
    
    try {
      return await client.fetch(wineQueries.productsByCategorySlug, { categorySlug })
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  static async getProductsByVariant(variant: string): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for products by variant')
      return getMockProductsByVariant(variant)
    }
    
    try {
      return await client.fetch(wineQueries.productsByVariant, { variant })
    } catch (error) {
      console.error('Error fetching products by variant:', error)
      return []
    }
  }

  static async searchProducts(searchTerm: string): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for product search')
      return searchMockProducts(searchTerm)
    }
    
    try {
      return await client.fetch(wineQueries.searchProducts, { searchTerm })
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Category queries
  static async getCategories(): Promise<Category[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for categories')
      return mockCategories
    }
    
    try {
      return await client.fetch(wineQueries.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Generic product query with filters (for shop page)
  static async getProductsWithFilters(filters: {
    searchTerm?: string
    selectedStatuses?: string[]
    selectedVariants?: string[]
    selectedCategories?: string[]
    priceRange?: [number, number]
    sortBy?: string
    limit?: number
    offset?: number
  }): Promise<WineProduct[]> {
    if (USE_MOCK_DATA) {
      console.log('🍷 Using mock data for filtered products')
      let filteredProducts = [...mockProducts]

      // Apply filters
      if (filters.searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        )
      }

      if (filters.selectedStatuses && filters.selectedStatuses.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          filters.selectedStatuses!.includes(p.status || '')
        )
      }

      if (filters.selectedVariants && filters.selectedVariants.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          filters.selectedVariants!.includes(p.variant || '')
        )
      }

      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.category && filters.selectedCategories!.includes(p.category._ref)
        )
      }

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p => 
          p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
        )
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'title-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
            break
          case 'title-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
            break
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating)
            break
        }
      }

      // Apply pagination
      const offset = filters.offset || 0
      const limit = filters.limit || filteredProducts.length
      return filteredProducts.slice(offset, offset + limit)
    }
    
    // Real data implementation would go here
    // For now, fallback to basic query
    try {
      return await client.fetch(`*[_type == "product"] | order(title asc) [${filters.offset || 0}...${(filters.offset || 0) + (filters.limit || 20)}] {
        _id,
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
      }`)
    } catch (error) {
      console.error('Error fetching filtered products:', error)
      return []
    }
  }
}

// Export the toggle status for debugging
export const isUsingMockData = USE_MOCK_DATA

// Re-export WineProduct type for convenience
export type { WineProduct } from './sanity'
