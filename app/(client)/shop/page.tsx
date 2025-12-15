"use client"

import { useState, useEffect,Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight, Search, ShoppingCart, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductFilter from "@/components/ProductFilter"
import { WineProductCard } from "@/components/wine-product-card"
import { client, urlFor, type WineProduct, type ExpandedBundleProduct, type Category } from "@/lib/sanity"
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

function WineListingPage() {
  // Get URL search parameters and router
  const searchParams = useSearchParams()
  const router = useRouter()

  // State for products and loading
  const [products, setProducts] = useState<(WineProduct | ExpandedBundleProduct)[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Applied filter states (used for API calls)
  const [appliedCategories, setAppliedCategories] = useState<string[]>([])
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 500])
  const [appliedJahrgaenge, setAppliedJahrgaenge] = useState<string[]>([])
  const [appliedGeschmack, setAppliedGeschmack] = useState<string[]>([])
  const [appliedRebsorten, setAppliedRebsorten] = useState<string[]>([])
  const [appliedTasteCollection, setAppliedTasteCollection] = useState<string[]>([])
  const [appliedSortBy, setAppliedSortBy] = useState('title-asc')

  // Local filter states (what user is currently selecting)
  const [localCategories, setLocalCategories] = useState<string[]>([])
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 500])
  const [localJahrgaenge, setLocalJahrgaenge] = useState<string[]>([])
  const [localGeschmack, setLocalGeschmack] = useState<string[]>([])
  const [localRebsorten, setLocalRebsorten] = useState<string[]>([])
  const [localTasteCollection, setLocalTasteCollection] = useState<string[]>([])
  const [localSortBy, setLocalSortBy] = useState('title-asc')
  
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Cart actions
  const { addItem } = useCartActions()

  // Apply filters function - called when "Filter anwenden" button is clicked
  const applyFilters = () => {
    setAppliedCategories(localCategories)
    setAppliedPriceRange(localPriceRange)
    setAppliedJahrgaenge(localJahrgaenge)
    setAppliedGeschmack(localGeschmack)
    setAppliedRebsorten(localRebsorten)
    setAppliedSortBy(localSortBy)
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
    const category = searchParams.get('category')
    const tasteCollection = searchParams.get('tasteCollection')

    if (category) {
      // We'll set the category after categories are loaded
      // This will be handled in the categories fetch effect
    }

    if (tasteCollection) {
      setLocalTasteCollection([tasteCollection])
      setAppliedTasteCollection([tasteCollection])
    }
  }, [searchParams])

  // Local filter handlers (only update local state)
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

  const handleSortChange = (value: string) => {
    setLocalSortBy(value)
    setAppliedSortBy(value) // Apply sorting immediately
  }

  const handleJahrgangChange = (jahrgang: string, checked: boolean) => {
    if (checked) {
      setLocalJahrgaenge([...localJahrgaenge, jahrgang])
    } else {
      setLocalJahrgaenge(localJahrgaenge.filter((j) => j !== jahrgang))
    }
  }

  const handleGeschmackChange = (geschmack: string, checked: boolean) => {
    if (checked) {
      setLocalGeschmack([...localGeschmack, geschmack])
    } else {
      setLocalGeschmack(localGeschmack.filter((g) => g !== geschmack))
    }
  }

  const handleRebsorteChange = (rebsorte: string, checked: boolean) => {
    if (checked) {
      setLocalRebsorten([...localRebsorten, rebsorte])
    } else {
      setLocalRebsorten(localRebsorten.filter((r) => r !== rebsorte))
    }
  }

  const clearAllFilters = () => {
    setLocalCategories([])
    setLocalPriceRange([0, 500])
    setLocalJahrgaenge([])
    setLocalGeschmack([])
    setLocalRebsorten([])
    setLocalTasteCollection([])
    setLocalSortBy('title-asc')
    // Also clear applied filters
    setAppliedCategories([])
    setAppliedPriceRange([0, 500])
    setAppliedJahrgaenge([])
    setAppliedGeschmack([])
    setAppliedRebsorten([])
    setAppliedTasteCollection([])
    setAppliedSortBy('title-asc')
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
        // Build filter conditions for both products and bundles
        const filterConditions = ['_type in ["product", "bundle"]']

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

        // Note: Wine-specific filters (jahrgang, geschmack, rebsorte) are skipped for bundles
        // We only apply them to products (_type == "product")
        const wineFilters = []

        // Jahrgang filter (products only)
        if (appliedJahrgaenge.length > 0) {
          const jahrgangFilter = appliedJahrgaenge.map(jahrgang => `jahrgang == "${jahrgang}"`).join(' || ')
          wineFilters.push(`(${jahrgangFilter})`)
        }

        // Geschmack filter (products only)
        if (appliedGeschmack.length > 0) {
          const geschmackFilter = appliedGeschmack.map(geschmack => `geschmack == "${geschmack}"`).join(' || ')
          wineFilters.push(`(${geschmackFilter})`)
        }

        // Rebsorte filter (products only)
        if (appliedRebsorten.length > 0) {
          const rebsorteFilter = appliedRebsorten.map(rebsorte => `rebsorte == "${rebsorte}"`).join(' || ')
          wineFilters.push(`(${rebsorteFilter})`)
        }

        // TasteCollection filter (applies to both products and bundles)
        if (appliedTasteCollection.length > 0) {
          const tasteFilter = appliedTasteCollection.map(taste => `"${taste}" in tasteCollection`).join(' || ')
          filterConditions.push(`(${tasteFilter})`)
        }

        // Add wine-specific filters only if they exist
        // Show bundles when no wine-specific filters are applied
        if (wineFilters.length > 0) {
          const wineFilterClause = wineFilters.join(' && ')
          filterConditions.push(`(_type == "bundle" || (${wineFilterClause}))`)
        }

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

        // Fetch products and bundles (up to 200 items)
        const query = `
          *[${whereClause}] | ${orderClause} [0...200] {
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
            status,
            variant,
            category,
            tags,
            tasteCollection,
            _type == "product" => {
              sizes,
              stock,
              jahrgang,
              geschmack,
              rebsorte
            },
            _type == "bundle" => {
              bundleItems[] {
                _key,
                quantity,
                product-> {
                  _id,
                  title,
                  stock
                }
              }
            }
          }
        `

        const productsData = await client.fetch(query)

        setProducts(productsData || [])
        
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Fehler beim Laden der Produkte')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [appliedCategories, appliedPriceRange, appliedJahrgaenge, appliedGeschmack, appliedRebsorten, appliedTasteCollection, appliedSortBy, searchParams])

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
    <div className="min-h-screen bg-background pb-16 md:pb-20">

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
              <nav className="flex items-center space-x-2 text-sm text-blue-600">
                <Link href="/" className="hover:underline cursor-pointer">Startseite</Link>
                <ChevronRight className="h-4 w-4" />
                {appliedCategories.length === 1 ? (
                  <span className="text-gray-600">
                    {categories.find(cat => cat._id === appliedCategories[0])?.title || 'Kategorie'}
                  </span>
                ) : (
                  <span className="text-gray-600">Alle Produkte</span>
                )}
              </nav>
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
                selectedCategories={localCategories}
                priceRange={localPriceRange}
                selectedJahrgaenge={localJahrgaenge}
                selectedGeschmack={localGeschmack}
                selectedRebsorten={localRebsorten}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onJahrgangChange={handleJahrgangChange}
                onGeschmackChange={handleGeschmackChange}
                onRebsorteChange={handleRebsorteChange}
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <ProductFilter
                selectedCategories={localCategories}
                priceRange={localPriceRange}
                selectedJahrgaenge={localJahrgaenge}
                selectedGeschmack={localGeschmack}
                selectedRebsorten={localRebsorten}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onJahrgangChange={handleJahrgangChange}
                onGeschmackChange={handleGeschmackChange}
                onRebsorteChange={handleRebsorteChange}
                onApplyFilters={applyFilters}
                onClearFilters={clearAllFilters}
                categories={categories}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
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
                      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center"
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
              </>
            )}
          </div>
        </div>
      </div>
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

