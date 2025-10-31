"use client"

import { type WineProduct, type Category, type SanityImage } from './sanity'
// import { 
//   USE_MOCK_DATA, 
//   mockProducts, 
//   mockCategories,
//   getMockStarterSets,
//   getMockTopSellers,
//   getMockProductBySlug,
//   getMockProductsByCategory,
//   getMockProductsByVariant,
//   searchMockProducts
// } from './mockData'

// Data service that handles switching between mock and real data
export class DataService {
  // Product queries
  static async getStarterSets(): Promise<WineProduct[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for starter sets')
    //   return getMockStarterSets()
    // }
    
    try {
      const response = await fetch('/api/products?type=starter-sets')
      if (!response.ok) {
        throw new Error('Failed to fetch starter sets')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching starter sets:', error)
      return []
    }
  }

  static async getTopSellers(limit: number = 4, offset: number = 0): Promise<WineProduct[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for top sellers')
    //   const topSellers = getMockTopSellers()
    //   return topSellers.slice(offset, offset + limit)
    // }
    
    try {
      const response = await fetch(`/api/products?type=top-sellers&limit=${limit}&offset=${offset}`)
      if (!response.ok) {
        throw new Error('Failed to fetch top sellers')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching top sellers:', error)
      return []
    }
  }

  static async getProductBySlug(slug: string): Promise<WineProduct | null> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for single product')
    //   return getMockProductBySlug(slug) || null
    // }
    
    try {
      const response = await fetch(`/api/products?type=single-product&slug=${encodeURIComponent(slug)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const result = await response.json()
      return result.data || null
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  }

  static async getProductsByCategory(categorySlug: string): Promise<WineProduct[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for products by category')
    //   return getMockProductsByCategory(categorySlug)
    // }
    
    try {
      const response = await fetch(`/api/products?type=by-category-slug&categorySlug=${encodeURIComponent(categorySlug)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products by category')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  static async getProductsByVariant(variant: string): Promise<WineProduct[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for products by variant')
    //   return getMockProductsByVariant(variant)
    // }
    
    try {
      const response = await fetch(`/api/products?type=by-variant&variant=${encodeURIComponent(variant)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products by variant')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching products by variant:', error)
      return []
    }
  }

  static async searchProducts(searchTerm: string): Promise<WineProduct[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for product search')
    //   return searchMockProducts(searchTerm)
    // }
    
    try {
      const response = await fetch(`/api/products?type=search&searchTerm=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error('Failed to search products')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Category queries
  static async getCategories(): Promise<Category[]> {
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for categories')
    //   return mockCategories
    // }
    
    try {
      const response = await fetch('/api/products?type=categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const result = await response.json()
      return result.data || []
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
    // if (USE_MOCK_DATA) {
    //   console.log('🍷 Using mock data for filtered products')
    //   let filteredProducts = [...mockProducts]

    //   // Apply filters
    //   if (filters.searchTerm) {
    //     filteredProducts = filteredProducts.filter(p => 
    //       p.title.toLowerCase().includes(filters.searchTerm!.toLowerCase())
    //     )
    //   }

    //   if (filters.selectedStatuses && filters.selectedStatuses.length > 0) {
    //     filteredProducts = filteredProducts.filter(p => 
    //       filters.selectedStatuses!.includes(p.status || '')
    //     )
    //   }

    //   if (filters.selectedVariants && filters.selectedVariants.length > 0) {
    //     filteredProducts = filteredProducts.filter(p => 
    //       filters.selectedVariants!.includes(p.variant || '')
    //     )
    //   }

    //   if (filters.selectedCategories && filters.selectedCategories.length > 0) {
    //     filteredProducts = filteredProducts.filter(p => 
    //       p.category && filters.selectedCategories!.includes(p.category._ref)
    //     )
    //   }

    //   if (filters.priceRange) {
    //     filteredProducts = filteredProducts.filter(p => 
    //       p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
    //     )
    //   }

    //   // Apply sorting
    //   if (filters.sortBy) {
    //     switch (filters.sortBy) {
    //       case 'title-asc':
    //         filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
    //         break
    //       case 'title-desc':
    //         filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
    //         break
    //       case 'price-asc':
    //         filteredProducts.sort((a, b) => a.price - b.price)
    //         break
    //       case 'price-desc':
    //         filteredProducts.sort((a, b) => b.price - a.price)
    //         break
    //       case 'rating-desc':
    //         filteredProducts.sort((a, b) => b.rating - a.rating)
    //         break
    //     }
    //   }

    //   // Apply pagination
    //   const offset = filters.offset || 0
    //   const limit = filters.limit || filteredProducts.length
    //   return filteredProducts.slice(offset, offset + limit)
    // }
    
    // Use the new API route for filtered products
    try {
      const searchParams = new URLSearchParams()
      searchParams.set('type', 'filtered')
      
      if (filters.searchTerm) searchParams.set('searchTerm', filters.searchTerm)
      if (filters.selectedStatuses?.length) searchParams.set('selectedStatuses', filters.selectedStatuses.join(','))
      if (filters.selectedVariants?.length) searchParams.set('selectedVariants', filters.selectedVariants.join(','))
      if (filters.selectedCategories?.length) searchParams.set('selectedCategories', filters.selectedCategories.join(','))
      if (filters.priceRange) searchParams.set('priceRange', filters.priceRange.join(','))
      if (filters.sortBy) searchParams.set('sortBy', filters.sortBy)
      if (filters.limit) searchParams.set('limit', filters.limit.toString())
      if (filters.offset) searchParams.set('offset', filters.offset.toString())
      
      const response = await fetch(`/api/products?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch filtered products')
      }
      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching filtered products:', error)
      return []
    }
  }
}

// Export the toggle status for debugging
export const isUsingMockData = false

// Re-export WineProduct type for convenience
export type { WineProduct } from './sanity'
