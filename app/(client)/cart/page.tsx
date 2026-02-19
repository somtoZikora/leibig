"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useCartData,
  useCartActions,
  type CartItem,
  type AppliedVoucher
} from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { toast } from 'sonner'
import { useUser, SignInButton } from '@clerk/nextjs'
import { CheckoutDialog } from '@/components/CheckoutDialog'
import { calculateTotalBottles, isMultipleOfSix } from '@/lib/bottleCount'
import { ExpressPayPalButton } from '@/components/ExpressPayPalButton'

const CartPage = () => {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [promoCode, setPromoCode] = useState('')
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [bottleCount, setBottleCount] = useState<number>(0)
  
  const {
    items,
    appliedVoucher,
    getSubtotalPrice,
    getTotalItemsCount,
    getTaxAmount,
    getShippingCost,
    getVoucherDiscount
  } = useCartData()

  const {
    addItem,
    removeItem,
    removeFromCart,
    resetCart,
    applyVoucher,
    removeVoucher
  } = useCartActions()


  const subtotal = getSubtotalPrice()
  const discount = getVoucherDiscount()
  const shipping = getShippingCost(70, 7.90) // €7.90 shipping, free over €70
  const total = subtotal - discount + shipping
  const itemsCount = getTotalItemsCount()

  // Calculate bottle count when items change
  useEffect(() => {
    const updateBottleCount = async () => {
      if (items.length > 0) {
        const count = await calculateTotalBottles(items)
        setBottleCount(count)
      } else {
        setBottleCount(0)
      }
    }
    updateBottleCount()
  }, [items])

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Bitte geben Sie einen Gutscheincode ein')
      return
    }

    setIsValidatingVoucher(true)

    try {
      // Validate voucher against WINESTRO API
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          orderAmount: subtotal
        })
      })

      const data = await response.json()

      if (data.valid && data.voucher) {
        // Apply voucher to cart store
        const voucherToApply: AppliedVoucher = {
          code: data.voucher.code,
          value: data.voucher.value,
          percentage: data.voucher.percentage,
          minOrderAmount: data.voucher.minOrderAmount,
          expiresAt: data.voucher.expiresAt,
          usagesRemaining: data.voucher.usagesRemaining,
          discountAmount: data.discount || 0
        }

        applyVoucher(voucherToApply)

        // Show success message with discount info
        const discountText = data.voucher.percentage
          ? `${data.voucher.percentage}% Rabatt`
          : `€${data.voucher.value?.toFixed(2)} Rabatt`

        toast.success(`Gutscheincode angewendet! ${discountText} erhalten.`)
        setPromoCode('') // Clear input after successful application
      } else {
        toast.error(data.error || 'Ungültiger Gutscheincode')
      }
    } catch (error) {
      console.error('Error validating voucher:', error)
      toast.error('Fehler bei der Überprüfung des Gutscheincodes')
    } finally {
      setIsValidatingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    removeVoucher()
    toast.success('Gutscheincode entfernt')
  }

  const handleIncrement = (item: CartItem) => {
    if (item.quantity >= item.stock) {
      toast.error('Maximale Lagermenge erreicht')
      return
    }
    addItem(item, item.selectedSize)
  }

  const handleDecrement = (productId: string) => {
    removeItem(productId)
  }

  const handleRemoveItem = (productId: string, title: string) => {
    removeFromCart(productId)
    toast.success(`${title} wurde entfernt`)
  }

  const handleClearCart = () => {
    resetCart()
    toast.success('Warenkorb wurde geleert')
  }

  const handleCheckout = async () => {
    // Allow guest checkout - no authentication check needed

    // Calculate total bottles
    const totalBottles = await calculateTotalBottles(items)

    // Only enforce bottle minimum if cart contains wine products
    // If totalBottles is 0, cart only has non-wine items (accessories, vouchers, food)
    if (totalBottles > 0) {
      // Check minimum order quantity (6 bottles) only for wine orders
      if (totalBottles < 6) {
        toast.error(
          `Wir empfehlen mindestens 6 Flaschen für einen optimalen Versand. Sie haben derzeit ${totalBottles} ${totalBottles === 1 ? 'Flasche' : 'Flaschen'} im Warenkorb.`,
          { duration: 5000 }
        )
        return
      }

      // Check if bottle count is a multiple of 6
      if (!isMultipleOfSix(totalBottles)) {
        // Show dialog if not a multiple of 6
        setShowCheckoutDialog(true)
        return
      }
    }

    // Proceed to checkout (either no wine products, or valid wine bottle count)
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    setShowCheckoutDialog(false)
  }

  const handleProceedToCheckout = () => {
    setShowCheckoutDialog(false)
    router.push('/checkout')
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
      <div className="min-h-screen bg-[rgba(139,115,85,0.05)] pt-8">
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
    <div className="min-h-screen bg-white pb-16 md:pb-20">
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
                  <div key={`${item.id}-${item.selectedSize}`} className="relative flex items-center gap-4 p-4">
                    {/* Product Image */}
                    <div className="relative w-16 h-20 flex-shrink-0 bg-[rgba(139,115,85,0.05)] rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={urlFor(item.image)?.width(64).height(80).url() || '/placeholder.svg'}
                          alt={item.title}
                          fill
                          quality={100}
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
                    <div className="flex items-center bg-[rgba(139,115,85,0.1)] rounded-lg">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="px-3 py-2 text-black hover:bg-[rgba(139,115,85,0.2)] rounded-l-lg transition-colors hover:rounded-l-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-2 text-black font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-2 text-black hover:bg-[rgba(139,115,85,0.2)] rounded-r-lg transition-colors hover:rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              
              {/* Optional Sign In Prompt for Non-Authenticated Users */}
              {!isSignedIn && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Schnellerer Checkout?</strong>
                  </p>
                  <p className="text-xs text-blue-700 mb-3">
                    Melden Sie sich an für gespeicherte Adressen und Bestellverfolgung.
                  </p>
                  <SignInButton
                    mode="modal"
                    fallbackRedirectUrl="/cart"
                    forceRedirectUrl="/cart"
                  >
                    <Button variant="outline" className="w-full border-blue-300 hover:bg-blue-100 text-blue-900">
                      Anmelden
                    </Button>
                  </SignInButton>
                </div>
              )}

              {/* Bottle Count Indicator - Only show if cart contains wine products */}
              {bottleCount > 0 && (
                <div className={`mb-4 p-3 rounded-lg ${bottleCount < 6 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="text-sm font-medium mb-1">
                    Flaschenanzahl: <span className="font-bold">{bottleCount} {bottleCount === 1 ? 'Flasche' : 'Flaschen'}</span>
                  </div>
                  {bottleCount < 6 ? (
                    <div className="text-xs text-orange-700">
                      Empfehlung: mindestens 6 Flaschen
                      <br />
                      Noch <strong>{6 - bottleCount} {(6 - bottleCount) === 1 ? 'Flasche' : 'Flaschen'}</strong> bis zur empfohlenen Menge
                    </div>
                  ) : !isMultipleOfSix(bottleCount) ? (
                    <div className="text-xs text-green-700">
                      Für optimalen Versand empfehlen wir Vielfache von 6 (z.B. 6, 12, 18)
                    </div>
                  ) : (
                    <div className="text-xs text-green-700">
                      ✓ Perfekt für den Versand
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 md:space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && appliedVoucher && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span>Gutschein ({appliedVoucher.code})</span>
                      {appliedVoucher.percentage && (
                        <span className="text-xs text-gray-500">-{appliedVoucher.percentage}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-600">-{formatPrice(discount)}</span>
                      <button
                        onClick={handleRemoveVoucher}
                        className="text-xs text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
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
              {!appliedVoucher && (
                <div className="mt-4 md:mt-6 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <Input
                        placeholder="Gutscheincode hinzufügen"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isValidatingVoucher) {
                            handleApplyPromoCode()
                          }
                        }}
                        disabled={isValidatingVoucher}
                        className="pl-8 md:pl-10 bg-[rgba(139,115,85,0.05)] border-[rgba(139,115,85,0.2)] rounded-lg text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleApplyPromoCode}
                      disabled={isValidatingVoucher}
                      className="bg-black text-white px-4 rounded-lg hover:bg-[rgba(139,115,85,0.8)] text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingVoucher ? 'Überprüfen...' : 'Anwenden'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Applied Voucher Info */}
              {appliedVoucher && (
                <div className="mt-4 md:mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-900">
                          Gutschein angewendet: {appliedVoucher.code}
                        </div>
                        <div className="text-xs text-green-700">
                          {appliedVoucher.percentage
                            ? `${appliedVoucher.percentage}% Rabatt`
                            : `€${appliedVoucher.value?.toFixed(2)} Rabatt`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-green-700 hover:text-red-600 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              )}
              
              {/* Express Checkout with PayPal */}
              {bottleCount >= 6 || bottleCount === 0 ? (
                <>
                  <div className="mt-4 md:mt-6">
                    <ExpressPayPalButton
                      items={items}
                      subtotal={subtotal}
                      shipping={shipping}
                      total={total}
                      discount={discount}
                      voucherCode={appliedVoucher?.code}
                      onSuccess={resetCart}
                    />
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Oder</span>
                    </div>
                  </div>

                  {/* Traditional Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
                    size="lg"
                  >
                    Zur Kasse gehen
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Für Überweisung oder manuelle Adresseingabe
                  </p>
                </>
              ) : (
                <>
                  {/* Show only traditional checkout if bottle count is less than 6 */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full mt-4 md:mt-6 bg-black hover:bg-[rgba(139,115,85,0.8)] text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
                    size="lg"
                  >
                    Zur Kasse gehen
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 text-center">
                    PayPal Express ist ab 6 Flaschen verfügbar
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
        onContinueShopping={handleContinueShopping}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  )
}

export default CartPage
