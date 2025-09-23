"use client"

import { useState, useEffect,Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Filter, Star, ChevronLeft, ChevronRight, Search, ShoppingCart, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { client, urlFor, type WineProduct, type Category } from "@/lib/sanity"
import { useCartActions, useCartData } from "@/lib/store"
import { toast } from "sonner"

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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedVariants, setSelectedVariants] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('title-asc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Cart actions
  const { addItem, addToWishlist, removeFromWishlist } = useCartActions()
  const { wishlist } = useCartData()

  // Handle URL parameters on component mount
  useEffect(() => {
    const variant = searchParams.get('variant')
    const category = searchParams.get('category')
    
    if (variant && variantOptions.some(v => v.id === variant)) {
      setSelectedVariants([variant])
    }
    
    if (category) {
      // We'll set the category after categories are loaded
      // This will be handled in the categories fetch effect
    }
  }, [searchParams])

  // Filter handlers
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, statusId])
    } else {
      setSelectedStatuses(selectedStatuses.filter((id) => id !== statusId))
    }
    setCurrentPage(1)
  }

  const handleVariantChange = (variantId: string, checked: boolean) => {
    if (checked) {
      setSelectedVariants([...selectedVariants, variantId])
    } else {
      setSelectedVariants(selectedVariants.filter((id) => id !== variantId))
    }
    setCurrentPage(1)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedStatuses([])
    setSelectedVariants([])
    setSelectedCategories([])
    setPriceRange([0, 500])
    setSortBy('title-asc')
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
            setSelectedCategories([category._id])
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
        if (searchTerm) {
          filterConditions.push(`title match "${searchTerm}*"`)
        }
        
        // Status filter
        if (selectedStatuses.length > 0) {
          const statusFilter = selectedStatuses.map(status => `status == "${status}"`).join(' || ')
          filterConditions.push(`(${statusFilter})`)
        }
        
        // Variant filter
        if (selectedVariants.length > 0) {
          const variantFilter = selectedVariants.map(variant => `variant == "${variant}"`).join(' || ')
          filterConditions.push(`(${variantFilter})`)
        }
        
        // Category filter
        if (selectedCategories.length > 0) {
          const categoryFilter = selectedCategories.map(catId => `category._ref == "${catId}"`).join(' || ')
          filterConditions.push(`(${categoryFilter})`)
        }
        
        // Handle URL category parameter for non-existent categories
        const urlCategorySlug = searchParams.get('category')
        if (urlCategorySlug && selectedCategories.length === 0) {
          // Category slug exists in URL but no matching category found in Sanity
          // This means the category doesn't exist yet, so show no products
          filterConditions.push('false') // This will return no products
        }
        
        // Price filter
        filterConditions.push(`price >= ${priceRange[0]} && price <= ${priceRange[1]}`)
        
        const whereClause = filterConditions.join(' && ')
        
        // Build sort clause
        let orderClause = ''
        switch (sortBy) {
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
  }, [searchTerm, selectedStatuses, selectedVariants, selectedCategories, priceRange, sortBy, currentPage, searchParams])

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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-lg">Filter</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
          Alle löschen
        </Button>
      </div>

      {/* Search */}
      <div>
        <h3 className="font-medium mb-3">Suchen</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Wein suchen..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="font-medium mb-3">Status</h3>
        <div className="space-y-2">
          {statusOptions.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.id}`}
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={(checked) => handleStatusChange(status.id, checked as boolean)}
              />
              <label htmlFor={`status-${status.id}`} className="text-sm cursor-pointer">
                {status.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="font-medium mb-3">Kategorie</h3>
        <div className="space-y-2">
          {variantOptions.map((variant) => (
            <div key={variant.id} className="flex items-center space-x-2">
              <Checkbox
                id={`variant-${variant.id}`}
                checked={selectedVariants.includes(variant.id)}
                onCheckedChange={(checked) => handleVariantChange(variant.id, checked as boolean)}
              />
              <label htmlFor={`variant-${variant.id}`} className="text-sm cursor-pointer">
                {variant.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories from Sanity */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Weinkategorien</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                />
                <label htmlFor={`category-${category._id}`} className="text-sm cursor-pointer">
                  {category.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Preis</h3>
        <div className="px-2">
          <Slider 
            value={priceRange} 
            onValueChange={handlePriceRangeChange} 
            max={500} 
            min={0} 
            step={10} 
            className="w-full" 
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Apply Filter Button - Mobile Only */}
      <div className="md:hidden pt-4">
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
          onClick={() => setIsFilterOpen(false)}
        >
          Filter anwenden
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Banner */}
      <div className="relative w-full h-[136px] overflow-hidden hidden md:block"> 

        <Image
          src="/images/bg_shop.jpg"
          alt="Shop Banner - Premium Wine Collection"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
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
      </div>

      {/* Header */}
      <div className="border-b bg-white">
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
                <Select value={sortBy} onValueChange={handleSortChange}>
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
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterContent />
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Card key={product._id} className="group p-4 hover:shadow-lg transition-all duration-200">
                      <div className="aspect-[3/4] relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                        {product.image ? (
                          <Image
                            src={urlFor(product.image).width(300).height(400).url()}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-2xl">
                              {product.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {product.discount && product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -{product.discount}%
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        {product.status && (
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'TOP-VERKÄUFER' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {product.status === 'TOP-VERKÄUFER' ? 'Top' : product.status}
                            </span>
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(product)
                            }}
                            disabled={product.stock === 0}
                            className="bg-white/90 hover:bg-white text-black"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToWishlist(product)
                            }}
                            className="bg-white/90 hover:bg-white text-black"
                          >
                            <Heart className={`h-4 w-4 ${
                              wishlist.some(item => item.id === product._id) 
                                ? 'fill-red-500 text-red-500' 
                                : ''
                            }`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link href={`/product/${product.slug.current}`}>
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-orange-600 transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Stock Status */}
                        <div className="text-xs">
                          {product.stock === 0 ? (
                            <span className="text-red-500">Ausverkauft</span>
                          ) : product.stock < 10 ? (
                            <span className="text-orange-500">Nur noch {product.stock} verfügbar</span>
                          ) : (
                            <span className="text-green-500">Auf Lager</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Vorherige
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Nächste
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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

