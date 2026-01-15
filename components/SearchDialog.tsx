import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
// import { useState, useEffect } from 'react'
import Image from 'next/image'
// import { useSanityClient } from '@/lib/sanity'
import { client } from '@/lib/sanity'
import { urlFor, type WineProduct } from '@/lib/sanity'
import Link from 'next/link'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<WineProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  // Save search to localStorage
  const saveRecentSearch = (search: string) => {
    const trimmed = search.trim()
    if (!trimmed) return

    setRecentSearches(prev => {
      // Remove if already exists, add to front, limit to 4
      const filtered = prev.filter(s => s !== trimmed)
      const updated = [trimmed, ...filtered].slice(0, 4)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      setNoResults(false)
      return
    }

    const searchProducts = async () => {
      setIsLoading(true)
      try {
        const searchResults = await client.fetch(`*[_type == "product" && title match $searchTerm + "*"] | order(title asc) [0...8] {
          _id,
          title,
          slug,
          image,
          price,
          oldPrice,
          discount,
          rating,
          status,
          variant
        }`, {
          searchTerm: searchTerm.trim()
        })

        setResults(searchResults)
        setNoResults(searchResults.length === 0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setNoResults(true)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const formatPrice = (price: number, oldPrice?: number) => {
    const formatter = (p: number) => new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: p % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(p)

    if (oldPrice && oldPrice > price) {
      const discount = Math.round(((oldPrice - price) / oldPrice) * 100)
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{formatter(price)}</span>
          <span className="text-sm text-gray-400 line-through">{formatter(oldPrice)}</span>
          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
      )
    }
    return <span className="font-semibold text-gray-900">{formatter(price)}</span>
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-black/20"
      onClick={onClose}
      onTouchEnd={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClose()}
    >
      <div
        className="w-full max-w-md mt-16 mx-1 md:mx-0 p-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Weine suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-full text-gray-600 placeholder:text-gray-600 focus:bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all duration-200"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search results */}
        {searchTerm && (
          <div className="mt-4">
            {isLoading ? (
              <div className="py-4 text-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Suche...</p>
              </div>
            ) : noResults ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Keine Ergebnisse gefunden</p>
                <p className="text-sm text-gray-400 mt-1">Versuchen Sie es mit anderen Suchbegriffen</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug.current}`}
                    className="block p-2 hover:bg-[rgba(139,115,85,0.05)] rounded-lg transition-colors"
                    onClick={() => {
                      saveRecentSearch(searchTerm)
                      setSearchTerm('')
                      onClose()
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={urlFor(product.image)?.width(100).height(100).url() || '/placeholder.svg'}
                            alt={product.title}
                            width={48}
                            height={48}
                            quality={100}
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                        <div className="text-sm text-gray-600">
                          {formatPrice(product.price, product.oldPrice)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent searches */}
        {!searchTerm && recentSearches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Letzte Suchen</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchTerm(search)}
                  className="px-3 py-1 text-sm bg-[rgba(139,115,85,0.1)] text-gray-700 rounded-full hover:bg-[rgba(139,115,85,0.2)] transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular categories (mock data) */}
        {!searchTerm && (
          <div className="mt-6 pb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Beliebte Kategorien</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSearchTerm('Weißwein')}
                className="px-3 py-2 text-sm bg-[rgba(139,115,85,0.1)] text-gray-700 rounded-md hover:bg-[rgba(139,115,85,0.2)] transition-colors text-left"
              >
                Weißwein
              </button>
              <button
                onClick={() => setSearchTerm('Rotwein')}
                className="px-3 py-2 text-sm bg-[rgba(139,115,85,0.1)] text-gray-700 rounded-md hover:bg-[rgba(139,115,85,0.2)] transition-colors text-left"
              >
                Rotwein
              </button>
              <button
                onClick={() => setSearchTerm('Champagner')}
                className="px-3 py-2 text-sm bg-[rgba(139,115,85,0.1)] text-gray-700 rounded-md hover:bg-[rgba(139,115,85,0.2)] transition-colors text-left"
              >
                Champagner
              </button>
              <button
                onClick={() => setSearchTerm('Rosé')}
                className="px-3 py-2 text-sm bg-[rgba(139,115,85,0.1)] text-gray-700 rounded-md hover:bg-[rgba(139,115,85,0.2)] transition-colors text-left"
              >
                Rosé
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close search"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}