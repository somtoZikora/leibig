"use client"

import { Search, Loader2 } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { Input } from './ui/input'
import { client, wineQueries, urlFor, type WineProduct } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<WineProduct[]>([])
  const [noResults, setNoResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search functionality with debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setProducts([])
        setNoResults(false)
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      setIsOpen(true)
      setNoResults(false)

      try {
        const searchResults = await client.fetch(wineQueries.searchProducts, {
          searchTerm: query.trim()
        })

        setProducts(searchResults)
        setNoResults(searchResults.length === 0)
      } catch (error) {
        console.error('Search error:', error)
        setProducts([])
        setNoResults(true)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleProductClick = () => {
    setIsOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const formatPrice = (price: number, oldPrice?: number) => {
    if (oldPrice && oldPrice > price) {
      const discount = Math.round(((oldPrice - price) / oldPrice) * 100)
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{price}€</span>
          <span className="text-sm text-gray-400 line-through">{oldPrice}€</span>
          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
      )
    }
    return <span className="font-semibold text-gray-900">{price}€</span>
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={cn(
          "text-sm",
          index < rating ? "text-yellow-400" : "text-gray-300"
        )}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Produkte suchen..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 bg-[#F3F4F6] border-gray-200 focus:bg-white rounded-full transition-all duration-200 focus:ring-2 focus:ring-orange-200"
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Suche läuft...</span>
              </div>
            </div>
          ) : noResults ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Search className="h-8 w-8 text-gray-300" />
                <p>Keine Produkte gefunden für &ldquo;<span className="font-medium">{query}</span>&rdquo;</p>
                <p className="text-sm">Versuchen Sie andere Suchbegriffe</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  {products.length} Ergebnis{products.length !== 1 ? 'se' : ''} für &ldquo;<span className="font-medium">{query}</span>&rdquo;
                </p>
              </div>
              <div className="py-2">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product?.slug?.current}`}
                    onClick={handleProductClick}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.image ? (
                          <Image
                            src={urlFor(product.image).width(48).height(64).url() || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-lg">
                              {product.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {product.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                        </div>

                        <div className="mt-1">
                          {formatPrice(product.price, product.oldPrice)}
                        </div>

                        {product.status && (
                          <div className="mt-1">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                              product.status === "TOP-VERKÄUFER" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-blue-100 text-blue-700"
                            )}>
                              {product.status}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-4 h-4 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {products.length >= 8 && (
                <div className="p-3 border-t border-gray-100">
                  <Link
                    href={`/shop?search=${encodeURIComponent(query)}`}
                    onClick={handleProductClick}
                    className="block w-full text-center py-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Alle Ergebnisse anzeigen →
                  </Link>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
