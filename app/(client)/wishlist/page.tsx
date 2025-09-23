"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartData, useCartActions, type WishlistItem } from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { wishlist } = useCartData()
  const { removeFromWishlist, clearWishlist, addItem } = useCartActions()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Small delay to prevent hydration mismatch
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleRemoveFromWishlist = (productId: string, title: string) => {
    removeFromWishlist(productId)
    toast.success('Aus der Wunschliste entfernt', {
      description: `${title} wurde aus Ihrer Wunschliste entfernt`,
    })
  }

  const handleClearWishlist = () => {
    if (wishlist.length === 0) return
    
    clearWishlist()
    toast.success('Wunschliste geleert', {
      description: 'Alle Artikel wurden aus Ihrer Wunschliste entfernt',
    })
  }

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      _id: item.id,
      title: item.title,
      slug: { current: '' }, // Will be handled by the cart
      image: item.image,
      price: item.price,
      rating: 5, // Default rating
      status: undefined,
      variant: undefined,
      stock: 100, // Default stock
      sizes: undefined
    })
    
    toast.success('Zum Warenkorb hinzugefügt', {
      description: `${item.title} wurde zu Ihrem Warenkorb hinzugefügt`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meine Wunschliste</h1>
              <p className="text-gray-600">
                {wishlist.length === 0 
                  ? 'Ihre Wunschliste ist leer' 
                  : `${wishlist.length} ${wishlist.length === 1 ? 'Artikel' : 'Artikel'} in Ihrer Wunschliste`
                }
              </p>
            </div>
          </div>
          
          {wishlist.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Alle entfernen
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Ihre Wunschliste ist leer
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Entdecken Sie unsere Produktkollektion und fügen Sie Ihre Lieblings-Düfte zu Ihrer Wunschliste hinzu.
            </p>
            <Link href="/wines">
              <Button className="bg-black text-white hover:bg-gray-800">
                Produkte entdecken
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  {item.image ? (
                    <Image
                      src={urlFor(item.image)?.width(300).height(300).url() || '/placeholder.svg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-32 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      In den Warenkorb
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Entfernen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlist.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/wines">
              <Button variant="outline" className="px-8">
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}