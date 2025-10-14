import { NextRequest, NextResponse } from 'next/server'
import { client, wineQueries } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const slug = searchParams.get('slug')
    const categoryId = searchParams.get('categoryId')
    const categorySlug = searchParams.get('categorySlug')
    const variant = searchParams.get('variant')
    const searchTerm = searchParams.get('searchTerm')

    let query: string
    let params: Record<string, any> = {}

    switch (type) {
      case 'starter-sets':
        query = wineQueries.starterSets
        break

      case 'top-sellers':
        query = wineQueries.topSellers
        params = {
          limit: limit ? parseInt(limit) : 4,
          offset: offset ? parseInt(offset) : 0
        }
        break

      case 'single-product':
        if (!slug) {
          return NextResponse.json(
            { error: 'Slug is required for single product' },
            { status: 400 }
          )
        }
        query = wineQueries.singleProduct
        params = { slug }
        break

      case 'categories':
        query = wineQueries.categories
        break

      case 'by-category':
        if (!categoryId) {
          return NextResponse.json(
            { error: 'Category ID is required' },
            { status: 400 }
          )
        }
        query = wineQueries.productsByCategory
        params = { categoryId }
        break

      case 'by-category-slug':
        if (!categorySlug) {
          return NextResponse.json(
            { error: 'Category slug is required' },
            { status: 400 }
          )
        }
        query = wineQueries.productsByCategorySlug
        params = { categorySlug }
        break

      case 'by-variant':
        if (!variant) {
          return NextResponse.json(
            { error: 'Variant is required' },
            { status: 400 }
          )
        }
        query = wineQueries.productsByVariant
        params = { variant }
        break

      case 'search':
        if (!searchTerm) {
          return NextResponse.json(
            { error: 'Search term is required' },
            { status: 400 }
          )
        }
        query = wineQueries.searchProducts
        params = { searchTerm }
        break

      case 'filtered':
        // Handle complex filtering for shop page
        const filters = {
          searchTerm: searchParams.get('searchTerm'),
          selectedStatuses: searchParams.get('selectedStatuses')?.split(',').filter(Boolean) || [],
          selectedVariants: searchParams.get('selectedVariants')?.split(',').filter(Boolean) || [],
          selectedCategories: searchParams.get('selectedCategories')?.split(',').filter(Boolean) || [],
          priceRange: searchParams.get('priceRange')?.split(',').map(Number) || [0, 1000],
          sortBy: searchParams.get('sortBy') || 'title-asc',
          limit: limit ? parseInt(limit) : 20,
          offset: offset ? parseInt(offset) : 0
        }

        // Build filter conditions
        const filterConditions = ['_type == "product"']
        
        // Search filter
        if (filters.searchTerm) {
          filterConditions.push(`title match "${filters.searchTerm}*"`)
        }
        
        // Status filter
        if (filters.selectedStatuses.length > 0) {
          const statusFilter = filters.selectedStatuses.map(status => `status == "${status}"`).join(' || ')
          filterConditions.push(`(${statusFilter})`)
        }
        
        // Variant filter
        if (filters.selectedVariants.length > 0) {
          const variantFilter = filters.selectedVariants.map(variant => `variant == "${variant}"`).join(' || ')
          filterConditions.push(`(${variantFilter})`)
        }
        
        // Category filter
        if (filters.selectedCategories.length > 0) {
          const categoryFilter = filters.selectedCategories.map(catId => `category._ref == "${catId}"`).join(' || ')
          filterConditions.push(`(${categoryFilter})`)
        }
        
        // Price filter
        filterConditions.push(`price >= ${filters.priceRange[0]} && price <= ${filters.priceRange[1]}`)
        
        const whereClause = filterConditions.join(' && ')
        
        // Build sort clause
        let orderClause = ''
        switch (filters.sortBy) {
          case 'title-asc':
            orderClause = 'order(title asc)'
            break
          case 'title-desc':
            orderClause = 'order(title desc)'
            break
          case 'price-asc':
            orderClause = 'order(price asc)'
            break
          case 'price-desc':
            orderClause = 'order(price desc)'
            break
          case 'rating-desc':
            orderClause = 'order(rating desc)'
            break
          default:
            orderClause = 'order(title asc)'
        }

        query = `*[${whereClause}] | ${orderClause} [${filters.offset}...${filters.offset + filters.limit}] {
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
        }`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }

    const data = await client.fetch(query, params)
    
    return NextResponse.json({ 
      success: true, 
      data,
      count: Array.isArray(data) ? data.length : 1
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
