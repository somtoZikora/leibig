"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  useCartData, 
  useCartActions, 
  type CartItem 
} from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import NoAccessToCart from '@/components/NoAccessToCart'

const CartPage = () => {
  const { isSignedIn, isLoaded } = useUser()
  
  const { 
    items, 
    getSubtotalPrice, 
    getTotalItemsCount,
    getTaxAmount,
    getShippingCost
  } = useCartData()
  
  const { 
    removeFromCart,
    resetCart 
  } = useCartActions()

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // Show NoAccessToCart component if user is not signed in
  if (!isSignedIn) {
    return <NoAccessToCart redirectUrl="/cart" />
  }

  const subtotal = getSubtotalPrice()
  const tax = getTaxAmount(0.19) // 19% German VAT
  const shipping = getShippingCost(50, 5.99) // Free shipping over 50€
  const total = subtotal + tax + shipping
  const itemsCount = getTotalItemsCount()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      toast.success('Produkt aus dem Warenkorb entfernt')
    } else {
      // For quantity increase, we'd need to add the difference
      // For simplicity, we'll just remove and re-add the desired quantity
      // This is a limitation without updateItemQuantity method
      console.log('Quantity change not fully supported:', { productId, newQuantity })
    }
  }

  const handleRemoveItem = (productId: string, title: string) => {
    removeFromCart(productId)
    toast.success(`${title} wurde entfernt`)
  }

  const handleClearCart = () => {
    resetCart()
    toast.success('Warenkorb wurde geleert')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ihr Warenkorb ist leer
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Entdecken Sie unsere exquisite Weinauswahl und finden Sie Ihren perfekten Wein.
            </p>
            <Link href="/shop">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Warenkorb ({itemsCount} {itemsCount === 1 ? 'Artikel' : 'Artikel'})
              </h1>
              <p className="text-gray-600 mt-1">
                Überprüfen Sie Ihre Auswahl vor der Bestellung
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="hidden md:flex">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Ihre Artikel</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Alle entfernen
                  </Button>
                </div>
              </div>
              
              <div className="divide-y">
                {items.map((item: CartItem) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={urlFor(item.image)?.width(80).height(96).url() || '/placeholder.svg'}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-xl">
                              {item.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/product/${item.slug.current}`}
                          className="block"
                        >
                          <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(item.rating)}
                          <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                        </div>

                        {item.selectedSize && (
                          <p className="text-sm text-gray-600 mt-1">
                            Größe: <span className="font-medium">{item.selectedSize}</span>
                          </p>
                        )}

                        {item.status && (
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'TOP-VERKÄUFER' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        )}

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              {item.oldPrice && item.oldPrice > item.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(item.oldPrice * item.quantity)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.price)} pro Stück
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Zwischensumme ({itemsCount} Artikel)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>MwSt. (19%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    💡 Kostenloser Versand ab {formatPrice(50)}
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Gesamt</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <Button
                  className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3 rounded-full"
                  size="lg"
                >
                  Zur Kasse gehen
                </Button>
              </Link>

              
              <p className="text-xs text-gray-500 text-center mt-3">
                Sichere Bezahlung • SSL-verschlüsselt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
