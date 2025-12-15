"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCartActions, useWishlistItems, type WishlistItem } from "@/lib/store"
import { urlFor } from "@/lib/sanity"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function WishlistPage() {
  const wishlistItems = useWishlistItems()
  const { addItem, removeFromWishlist, clearWishlist } = useCartActions()
  const [isClient, setIsClient] = useState(false)

  // Wait for client-side hydration to prevent mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      _id: item.id,
      title: item.title,
      slug: item.slug,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      discount: item.discount,
      rating: item.rating,
      status: item.status,
      variant: item.variant,
      stock: item.stock,
      sizes: item.sizes
    })
    toast.success(`${item.title} zum Warenkorb hinzugefügt`)
  }

  const handleRemoveFromWishlist = (item: WishlistItem) => {
    removeFromWishlist(item.id)
    toast.success(`${item.title} aus der Wunschliste entfernt`)
  }

  const handleClearWishlist = () => {
    clearWishlist()
    toast.success("Wunschliste geleert")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  // Show loading skeleton during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meine Wunschliste</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Artikel' : 'Artikel'}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Alle löschen
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Heart className="h-24 w-24 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Deine Wunschliste ist leer</h2>
            <p className="text-gray-600 mb-8">
              Füge Produkte hinzu, die du später kaufen möchtest
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-black hover:bg-gray-800">
                Jetzt einkaufen
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <Link href={`/product/${item.slug.current}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={urlFor(item.image)?.width(400).height(400).url() || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">Kein Bild</span>
                          </div>
                        )}

                        {/* Remove button overlay */}
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault()
                              handleRemoveFromWishlist(item)
                            }}
                            className="bg-white/90 hover:bg-white rounded-full h-8 w-8"
                          >
                            <X className="h-4 w-4 text-gray-700" />
                          </Button>
                        </div>

                        {/* Discount badge */}
                        {item.discount && item.discount > 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              -{item.discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <Link href={`/product/${item.slug.current}`}>
                        <h3 className="font-medium text-sm line-clamp-2 hover:underline">
                          {item.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2">
                        {item.oldPrice && item.oldPrice > item.price ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.oldPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-black hover:bg-gray-800"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        In den Warenkorb
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
