"use client"

import { useState, useEffect,Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight, Search, ShoppingCart, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductFilter from "@/components/ProductFilter"
import { WineProductCard } from "@/components/wine-product-card"
import { client, urlFor, type WineProduct, type Category } from "@/lib/sanity"
import { useCartActions, useCartData } from "@/lib/store"
import { toast } from "sonner"
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, buttonAnimationProps, transitions } from '@/lib/animations'

// Sorting options
const sortOptions = [
  { value: 'title-asc', label: 'Name (A-Z)' },
  { value: 'title-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Preis (niedrig-hoch)' },
  { value: 'price-desc', label: 'Preis (hoch-niedrig)' },
  { value: 'rating-desc', label: 'Bewertung (hoch-niedrig)' },
]

// Static filter options
const statusOptions = [
  { id: "TOP-VERKÄUFER", label: "Top-Verkäufer" },
  { id: "STARTERSETS", label: "Startersets" },
]

const variantOptions = [
  { id: "Im Angebot", label: "Im Angebot" },
  { id: "Neuheiten", label: "Neuheiten" },
  { id: "Weine", label: "Weine" },
]

function WineListingPage() {
  // Get URL search parameters
  const searchParams = useSearchParams()
  
  // State for products and loading
  const [products, setProducts] = useState<WineProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Applied filter states (used for API calls)
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [appliedStatuses, setAppliedStatuses] = useState<string[]>([])
  const [appliedVariants, setAppliedVariants] = useState<string[]>([])
  const [appliedCategories, setAppliedCategories] = useState<string[]>([])
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 500])
  const [appliedSortBy, setAppliedSortBy] = useState('title-asc')
  
  // Local filter states (what user is currently selecting)
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [localStatuses, setLocalStatuses] = useState<string[]>([])
  const [localVariants, setLocalVariants] = useState<string[]>([])
  const [localCategories, setLocalCategories] = useState<string[]>([])
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 500])
  const [localSortBy, setLocalSortBy] = useState('title-asc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Cart actions
  const { addItem, addToWishlist, removeFromWishlist } = useCartActions()
  const { wishlist } = useCartData()

  // Apply filters function - called when "Filter anwenden" button is clicked
  const applyFilters = () => {
    setAppliedSearchTerm(localSearchTerm)
    setAppliedStatuses(localStatuses)
    setAppliedVariants(localVariants)
    setAppliedCategories(localCategories)
    setAppliedPriceRange(localPriceRange)
    setAppliedSortBy(localSortBy)
    setCurrentPage(1)
  }

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle URL parameters on component mount
  useEffect(() => {
    const variant = searchParams.get('variant')
    const category = searchParams.get('category')
    
    if (variant && variantOptions.some(v => v.id === variant)) {
      setLocalVariants([variant])
      setAppliedVariants([variant]) // Also apply it immediately for URL params
    }
    
    if (category) {
      // We'll set the category after categories are loaded
      // This will be handled in the categories fetch effect
    }
  }, [searchParams])

  // Local filter handlers (only update local state)
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setLocalStatuses([...localStatuses, statusId])
    } else {
      setLocalStatuses(localStatuses.filter((id) => id !== statusId))
    }
  }

  const handleVariantChange = (variantId: string, checked: boolean) => {
    if (checked) {
      setLocalVariants([...localVariants, variantId])
    } else {
      setLocalVariants(localVariants.filter((id) => id !== variantId))
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setLocalCategories([...localCategories, categoryId])
    } else {
      setLocalCategories(localCategories.filter((id) => id !== categoryId))
    }
  }

  const handlePriceRangeChange = (value: [number, number]) => {
    setLocalPriceRange(value)
  }

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
  }

  const handleSortChange = (value: string) => {
    setLocalSortBy(value)
  }

  const clearAllFilters = () => {
    setLocalSearchTerm('')
    setLocalStatuses([])
    setLocalVariants([])
    setLocalCategories([])
    setLocalPriceRange([0, 500])
    setLocalSortBy('title-asc')
    // Also clear applied filters
    setAppliedSearchTerm('')
    setAppliedStatuses([])
    setAppliedVariants([])
    setAppliedCategories([])
    setAppliedPriceRange([0, 500])
    setAppliedSortBy('title-asc')
    setCurrentPage(1)
  }

  // Add to cart handler
  const handleAddToCart = (product: WineProduct) => {
    addItem({
      _id: product._id,
      title: product.title,
      slug: product.slug,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      rating: product.rating,
      status: product.status,
      variant: product.variant,
      stock: product.stock,
      sizes: product.sizes
    })
    toast.success(`${product.title} zum Warenkorb hinzugefügt`)
  }

  // Add to wishlist handler
  const handleAddToWishlist = (product: WineProduct) => {
    const isInWishlist = wishlist.some(item => item.id === product._id)
    
    if (isInWishlist) {
      removeFromWishlist(product._id)
      toast.success(`${product.title} aus der Wunschliste entfernt`)
    } else {
      addToWishlist({
        id: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
        addedAt: new Date()
      })
      toast.success(`${product.title} zur Wunschliste hinzugefügt`)
    }
  }


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await client.fetch(`
          *[_type == "category"] | order(title asc) {
            _id,
            title,
            slug
          }
        `)
        setCategories(categoriesData || [])
        
        // Handle category URL parameter after categories are loaded
        const categorySlug = searchParams.get('category')
        if (categorySlug) {
          const category = categoriesData?.find((cat: Category) => cat.slug.current === categorySlug)
          if (category) {
            setLocalCategories([category._id])
            setAppliedCategories([category._id]) // Also apply it immediately for URL params
          } else {
            // Category doesn't exist in Sanity yet - show message to user
            console.log(`Category "${categorySlug}" not found in Sanity. Please add this category to the backend.`)
            toast.error(`Kategorie "${categorySlug}" wurde nicht gefunden. Bitte fügen Sie diese Kategorie im Backend hinzu.`)
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [searchParams])

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
      try {
        // Build filter conditions
        const filterConditions = ['_type == "product"']
        
        // Search filter
        if (appliedSearchTerm) {
          filterConditions.push(`title match "${appliedSearchTerm}*"`)
        }
        
        // Status filter
        if (appliedStatuses.length > 0) {
          const statusFilter = appliedStatuses.map(status => `status == "${status}"`).join(' || ')
          filterConditions.push(`(${statusFilter})`)
        }
        
        // Variant filter
        if (appliedVariants.length > 0) {
          const variantFilter = appliedVariants.map(variant => `variant == "${variant}"`).join(' || ')
          filterConditions.push(`(${variantFilter})`)
        }
        
        // Category filter
        if (appliedCategories.length > 0) {
          const categoryFilter = appliedCategories.map(catId => `category._ref == "${catId}"`).join(' || ')
          filterConditions.push(`(${categoryFilter})`)
        }
        
        // Handle URL category parameter for non-existent categories
        const urlCategorySlug = searchParams.get('category')
        if (urlCategorySlug && appliedCategories.length === 0) {
          // Category slug exists in URL but no matching category found in Sanity
          // This means the category doesn't exist yet, so show no products
          filterConditions.push('false') // This will return no products
        }
        
        // Price filter
        filterConditions.push(`price >= ${appliedPriceRange[0]} && price <= ${appliedPriceRange[1]}`)
        
        const whereClause = filterConditions.join(' && ')
        
        // Build sort clause
        let orderClause = ''
        switch (appliedSortBy) {
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
        
        // Calculate offset
        const offset = (currentPage - 1) * itemsPerPage
        
        // Fetch products
        const query = `
          *[${whereClause}] | ${orderClause} [${offset}...${offset + itemsPerPage}] {
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
          }
        `
        
        // Also get total count for pagination
        const countQuery = `count(*[${whereClause}])`
        
        const [productsData, totalCount] = await Promise.all([
          client.fetch(query),
          client.fetch(countQuery)
        ])
        
        setProducts(productsData || [])
        setTotalPages(Math.ceil(totalCount / itemsPerPage))
        
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Fehler beim Laden der Produkte')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [appliedSearchTerm, appliedStatuses, appliedVariants, appliedCategories, appliedPriceRange, appliedSortBy, currentPage, searchParams])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 md:h-4 md:w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }


  return (
    <div className="min-h-screen bg-background pb-16 md:pb-20 pt-20 md:pt-0">
      {/* Shop Banner */}
      <motion.div 
        className="relative w-full h-[150px] md:h-[450px] overflow-hidden"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      > 
        <Image
          src="/images/bg_shop.jpg"
          alt="Shop Banner - Premium Wine Collection"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        {/* Banner Content */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-avenir tracking-wide drop-shadow-2xl">
              Premium Wine Collection
            </h1>
            <p className="text-xs md:text-sm text-white/90 font-light mt-1 md:mt-2 drop-shadow-lg">
              Discover exceptional wines from around the world
            </p>
          </div>
        </div> */}
      </motion.div>

      {/* Header */}
      <motion.div 
        className="border-b bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...transitions.smooth }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground font-avenir">
                Seite {currentPage} | {products.length} von {totalPages * itemsPerPage} Produkten
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Sort Dropdown */}
              <div className="hidden md:block">
                <Select value={localSortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sortieren nach..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Button */}
              <div className="md:hidden">
              <ProductFilter
                searchTerm={localSearchTerm}
                selectedStatuses={localStatuses}
                selectedVariants={localVariants}
                selectedCategories={localCategories}
                priceRange={localPriceRange}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
                onVariantChange={handleVariantChange}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onApplyFilters={applyFilters}
                onClearFilters={clearAllFilters}
                categories={categories}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...transitions.smooth }}
      >
        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <motion.div 
            className="hidden md:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, ...transitions.smooth }}
          >
            <ProductFilter
              searchTerm={localSearchTerm}
              selectedStatuses={localStatuses}
              selectedVariants={localVariants}
              selectedCategories={localCategories}
              priceRange={localPriceRange}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              onVariantChange={handleVariantChange}
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onApplyFilters={applyFilters}
              onClearFilters={clearAllFilters}
              categories={categories}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, ...transitions.smooth }}
          >
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Produkte gefunden</h3>
                <p className="text-gray-500 mb-4">Versuchen Sie, Ihre Filter anzupassen oder einen anderen Suchbegriff zu verwenden.</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Filter zurücksetzen
                </Button>
              </div>
            ) : (
              <>
                {/* Wine Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      variants={staggerItem}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.1 }}
                    >
                      <WineProductCard 
                        product={product} 
                        id={product._id} 
                        isLoading={false} 
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex items-center justify-between w-full mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, ...transitions.smooth }}
                  >
                    {/* Previous Button - Far Left */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="w-10 h-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers - Centered */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                        let pageNumber;
                        const maxPages = isMobile ? 3 : 5;
                        if (totalPages <= maxPages) {
                          pageNumber = i + 1;
                        } else if (currentPage <= Math.ceil(maxPages / 2)) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                          pageNumber = totalPages - maxPages + 1 + i;
                        } else {
                          pageNumber = currentPage - Math.floor(maxPages / 2) + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-10 h-10 p-0 rounded-lg ${
                              currentPage === pageNumber 
                                ? 'bg-gray-200 text-black border-gray-300' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      {totalPages > (isMobile ? 3 : 5) && currentPage < totalPages - Math.floor((isMobile ? 3 : 5) / 2) && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      {totalPages > (isMobile ? 3 : 5) && currentPage < totalPages - Math.floor((isMobile ? 3 : 5) / 2) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages - 1)}
                            className="w-10 h-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50"
                          >
                            {totalPages - 1}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-10 h-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Next Button - Far Right */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="w-10 h-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Wrapper component with Suspense boundary
function ShopPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    }>
      <WineListingPage />
    </Suspense>
  )
}

export default ShopPageWrapper

