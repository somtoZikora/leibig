"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  useCartData, 
  useCartActions, 
  type CartItem 
} from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

const CartPage = () => {
  const { isSignedIn, isLoaded } = useUser()
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  
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


  const subtotal = getSubtotalPrice()
  const discount = appliedDiscount
  const shipping = getShippingCost(50, 15) // 15€ shipping, free over 50€
  const total = subtotal - discount + shipping
  const itemsCount = getTotalItemsCount()

  const handleApplyPromoCode = () => {
    // Simple promo code logic - in real app, this would be validated on server
    if (promoCode.toLowerCase() === 'welcome20') {
      setAppliedDiscount(subtotal * 0.2) // 20% discount
      toast.success('Gutscheincode angewendet! 20% Rabatt erhalten.')
    } else if (promoCode.toLowerCase() === 'save10') {
      setAppliedDiscount(subtotal * 0.1) // 10% discount
      toast.success('Gutscheincode angewendet! 10% Rabatt erhalten.')
    } else {
      toast.error('Ungültiger Gutscheincode')
    }
  }

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
    }).format(price).replace('€', ' $')
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
    <div className="min-h-screen bg-white pb-16 md:pb-20 pt-0 md:pt-[200px]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Startseite</Link>
            <span>›</span>
            <span className="text-gray-900">Warenkorb</span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Ihr Warenkorb</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {items.map((item: CartItem) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="relative flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    {/* Product Image */}
                    <div className="relative w-16 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={urlFor(item.image)?.width(64).height(80).url() || '/placeholder.svg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="w-8 h-12 bg-gray-300 rounded-sm"></div>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-black text-lg">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-black font-normal mt-1">
                        Premiumwein
                      </p>

                      <p className="font-bold text-black text-lg mt-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Delete Button - Top Right */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Quantity Selector - Bottom Right */}
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-black hover:bg-gray-200 rounded-l-lg transition-colors hover:rounded-l-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-2 text-black font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-2 text-black hover:bg-gray-200 rounded-r-lg transition-colors hover:rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 sticky top-8">
              <h2 className="text-lg md:text-xl font-bold text-black mb-4 md:mb-6">Bestellübersicht</h2>
              
              {/* Sign In Prompt for Non-Authenticated Users */}
              {!isSignedIn && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 mb-3">
                    Melden Sie sich an, um Ihre Bestellung abzuschließen.
                  </p>
                  <Link href="/sign-in">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Anmelden zum Bestellen
                    </Button>
                  </Link>
                </div>
              )}
              
              <div className="space-y-3 md:space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Rabatt (-20%)</span>
                    <span className="font-medium text-red-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Liefergebühr</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}
                  </span>
                </div>
                
                <hr className="my-3 md:my-4 border-gray-200" />
                
                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span>Gesamt</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4 md:mt-6 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    <Input
                      placeholder="Gutscheincode hinzufügen"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-8 md:pl-10 bg-gray-50 border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromoCode}
                    className="bg-black text-white px-4 rounded-lg hover:bg-gray-800 text-sm md:text-base"
                  >
                    Anwenden
                  </Button>
                </div>
              </div>
              
              <Link href={isSignedIn ? "/checkout" : "/sign-in"}>
                <Button
                  className="w-full mt-4 md:mt-6 bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
                  size="lg"
                >
                  {isSignedIn ? "Zur Kasse gehen" : "Anmelden zum Bestellen"}
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
