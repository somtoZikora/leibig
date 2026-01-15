"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartData, useCartActions } from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CreditCard, ShoppingBag } from 'lucide-react'
import NoAccessToCart from '@/components/NoAccessToCart'
import '@/types/clerk'

interface AddressData {
  company: string
  firstName: string
  lastName: string
  street: string
  houseNumber: string
  city: string
  postalCode: string
  country: string
  phone: string
}

interface CheckoutFormData {
  email: string
  billingAddress: AddressData
  useSeparateShipping: boolean
  shippingAddress: AddressData
  customerNotes: string
  paymentMethod: 'paypal' | 'invoice' | 'bank_transfer'
}

const CheckoutPage = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { 
    items, 
    getTotalPrice, 
    getTaxAmount, 
    getShippingCost 
  } = useCartData()
  const { resetCart } = useCartActions()

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.emailAddresses[0]?.emailAddress || '',
    billingAddress: {
      company: '',
      firstName: '',
      lastName: '',
      street: '',
      houseNumber: '',
      city: '',
      postalCode: '',
      country: 'Deutschland',
      phone: ''
    },
    useSeparateShipping: false,
    shippingAddress: {
      company: '',
      firstName: '',
      lastName: '',
      street: '',
      houseNumber: '',
      city: '',
      postalCode: '',
      country: 'Deutschland',
      phone: ''
    },
    customerNotes: '',
    paymentMethod: 'paypal'
  })

  const subtotal = getTotalPrice() // Gross price (includes VAT)
  const tax = getTaxAmount(0.19)    // Extract VAT from gross for display/reporting
  const shipping = getShippingCost(70, 7.90)
  const total = subtotal + shipping // Don't add tax - already included in subtotal

  // Update email, name, and addresses when user loads
  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      const savedBillingAddress = user.publicMetadata?.defaultBillingAddress
      const savedShippingAddress = user.publicMetadata?.defaultShippingAddress

      setFormData(prev => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
        billingAddress: savedBillingAddress ? {
          company: savedBillingAddress.company || '',
          firstName: savedBillingAddress.firstName || user.firstName || '',
          lastName: savedBillingAddress.lastName || user.lastName || '',
          street: savedBillingAddress.street || '',
          houseNumber: savedBillingAddress.houseNumber || '',
          city: savedBillingAddress.city || '',
          postalCode: savedBillingAddress.postalCode || '',
          country: savedBillingAddress.country || 'Deutschland',
          phone: savedBillingAddress.phone || ''
        } : {
          ...prev.billingAddress,
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        },
        shippingAddress: savedShippingAddress ? {
          company: savedShippingAddress.company || '',
          firstName: savedShippingAddress.firstName || user.firstName || '',
          lastName: savedShippingAddress.lastName || user.lastName || '',
          street: savedShippingAddress.street || '',
          houseNumber: savedShippingAddress.houseNumber || '',
          city: savedShippingAddress.city || '',
          postalCode: savedShippingAddress.postalCode || '',
          country: savedShippingAddress.country || 'Deutschland',
          phone: savedShippingAddress.phone || ''
        } : prev.shippingAddress
      }))
    }
  }, [user])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  // Allow guest checkout - no authentication required
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ihr Warenkorb ist leer
            </h1>
            <p className="text-gray-600 mb-8">
              Fügen Sie Artikel hinzu, um mit der Bestellung fortzufahren.
            </p>
            <Button 
              onClick={() => router.push('/shop')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Weiter einkaufen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `WS-${timestamp.slice(-6)}-${random}`
  }

  const createOrder = async (paypalOrderId: string) => {
    try {
      console.log('🔄 Creating order via API route...', {
        paypalOrderId,
        userInfo: user ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress
        } : 'guest',
        cartItems: items.length,
        total
      })
      
      const orderNumber = generateOrderNumber()
      
      // Determine shipping address: use separate shipping if provided, otherwise use billing
      const finalShippingAddress = formData.useSeparateShipping
        ? formData.shippingAddress
        : formData.billingAddress

      const orderData = {
        _type: 'order',
        orderNumber,
        customerEmail: formData.email,
        customerName: `${formData.billingAddress.firstName} ${formData.billingAddress.lastName}`,
        userId: user?.id, // Optional for guest orders
        isGuest: !user, // Mark as guest order if no user
        status: 'pending',
        items: items.map(item => ({
          _type: 'orderItem',
          product: {
            _type: 'reference',
            _ref: item.id
          },
          productSnapshot: {
            title: item.title,
            price: item.price,
            image: item.image
          },
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        subtotal,
        tax,
        taxRate: 19,
        shipping,
        total,
        currency: 'EUR',
        billingAddress: {
          company: formData.billingAddress.company,
          firstName: formData.billingAddress.firstName,
          lastName: formData.billingAddress.lastName,
          street: formData.billingAddress.street,
          houseNumber: formData.billingAddress.houseNumber,
          city: formData.billingAddress.city,
          postalCode: formData.billingAddress.postalCode,
          country: formData.billingAddress.country,
          phone: formData.billingAddress.phone
        },
        shippingAddress: {
          company: finalShippingAddress.company,
          firstName: finalShippingAddress.firstName,
          lastName: finalShippingAddress.lastName,
          street: finalShippingAddress.street,
          houseNumber: finalShippingAddress.houseNumber,
          city: finalShippingAddress.city,
          postalCode: finalShippingAddress.postalCode,
          country: finalShippingAddress.country,
          phone: finalShippingAddress.phone
        },
        customerNotes: formData.customerNotes,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        paymentDetails: {
          paypalOrderId
        },
        createdAt: new Date().toISOString()
      }

      console.log('📄 Sending order data to API route...')
      
      // Use API route instead of direct Sanity client
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to create order')
      }
      
      console.log('✅ Order created successfully via API:', result.orderId)
      return result.orderId
      
    } catch (error) {
      console.error('❌ Error creating order via API:', error)
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        })
      }
      
      // Show user-friendly error message
      toast.error('Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
      throw error
    }
  }

  const updateOrderAfterPayment = async (orderId: string, paymentId: string, payerId: string) => {
    try {
      console.log('🔄 Updating order via API route...', {
        orderId,
        paymentId,
        payerId
      })

      const updates = {
        status: 'paid',
        paymentStatus: 'captured',
        paymentId: paymentId,
        'paymentDetails.paypalPaymentId': paymentId,
        'paymentDetails.paypalPayerId': payerId,
        updatedAt: new Date().toISOString()
      }

      // Use API route for updating order
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, updates })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update order')
      }

      console.log('✅ Order updated successfully via API:', result.orderId)

    } catch (error) {
      console.error('❌ Error updating order via API:', error)
      throw error
    }
  }

  const saveAddressesToUserMetadata = async () => {
    // Skip for guest users
    if (!user) {
      console.log('ℹ️  Guest checkout - skipping address save to user metadata')
      return
    }

    try {
      // Determine shipping address: use separate shipping if provided, otherwise use billing
      const finalShippingAddress = formData.useSeparateShipping
        ? formData.shippingAddress
        : formData.billingAddress

      const response = await fetch('/api/user/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultBillingAddress: formData.billingAddress,
          defaultShippingAddress: finalShippingAddress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save addresses')
      }

      console.log('✅ Addresses saved to user metadata')
    } catch (error) {
      // Silent fail - don't block checkout success if address saving fails
      console.error('❌ Error saving addresses to metadata:', error)
    }
  }

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [name]: value
      }
    }))
  }

  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value
      }
    }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      email: e.target.value
    }))
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      customerNotes: e.target.value
    }))
  }

  const toggleSeparateShipping = () => {
    setFormData(prev => ({
      ...prev,
      useSeparateShipping: !prev.useSeparateShipping
    }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value as 'paypal' | 'invoice' | 'bank_transfer'
    }))
  }

  const validateForm = () => {
    // Validate email
    if (!formData.email.trim()) return false

    // Validate billing address
    const billingRequired = ['firstName', 'lastName', 'street', 'houseNumber', 'city', 'postalCode', 'country']
    const billingValid = billingRequired.every(field =>
      formData.billingAddress[field as keyof AddressData].trim() !== ''
    )
    if (!billingValid) return false

    // Validate shipping address if separate
    if (formData.useSeparateShipping) {
      const shippingValid = billingRequired.every(field =>
        formData.shippingAddress[field as keyof AddressData].trim() !== ''
      )
      if (!shippingValid) return false
    }

    return true
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kasse</h1>
          <p className="text-gray-600">Vervollständigen Sie Ihre Bestellung</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing & Shipping Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
              {!user && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Als Gast bestellen</strong> - Sie können ohne Konto bestellen.{' '}
                    <SignInButton mode="modal" fallbackRedirectUrl="/checkout" forceRedirectUrl="/checkout">
                      <button className="underline font-medium hover:text-blue-900 cursor-pointer">
                        Anmelden
                      </button>
                    </SignInButton>
                    {' '}für schnelleren Checkout und Bestellverfolgung.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Rechnungsadresse</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firma (optional)
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.billingAddress.company}
                    onChange={handleBillingAddressChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vorname *
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.billingAddress.firstName}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nachname *
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.billingAddress.lastName}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straße *
                  </label>
                  <Input
                    type="text"
                    name="street"
                    value={formData.billingAddress.street}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hausnummer *
                  </label>
                  <Input
                    type="text"
                    name="houseNumber"
                    value={formData.billingAddress.houseNumber}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stadt *
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.billingAddress.city}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postleitzahl *
                  </label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land *
                  </label>
                  <Input
                    type="text"
                    name="country"
                    value={formData.billingAddress.country}
                    onChange={handleBillingAddressChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon (optional)
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.billingAddress.phone}
                    onChange={handleBillingAddressChange}
                  />
                </div>
              </div>
            </div>

            {/* Separate Shipping Address Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="separateShipping"
                  checked={formData.useSeparateShipping}
                  onCheckedChange={toggleSeparateShipping}
                />
                <label htmlFor="separateShipping" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Abweichende Lieferadresse
                </label>
              </div>

              {/* Shipping Address Form (conditional) */}
              {formData.useSeparateShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firma (optional)
                    </label>
                    <Input
                      type="text"
                      name="company"
                      value={formData.shippingAddress.company}
                      onChange={handleShippingAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vorname *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nachname *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Straße *
                    </label>
                    <Input
                      type="text"
                      name="street"
                      value={formData.shippingAddress.street}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hausnummer *
                    </label>
                    <Input
                      type="text"
                      name="houseNumber"
                      value={formData.shippingAddress.houseNumber}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stadt *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postleitzahl *
                    </label>
                    <Input
                      type="text"
                      name="postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land *
                    </label>
                    <Input
                      type="text"
                      name="country"
                      value={formData.shippingAddress.country}
                      onChange={handleShippingAddressChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon (optional)
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.shippingAddress.phone}
                      onChange={handleShippingAddressChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Anmerkungen zur Bestellung (optional)</h2>
              <Textarea
                placeholder="Besondere Hinweise zur Lieferung, Geschenkverpackung, etc."
                value={formData.customerNotes}
                onChange={handleNotesChange}
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3 text-sm">
                    <div className="relative w-12 h-15 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {item.image ? (
                        <Image
                          src={urlFor(item.image)?.width(48).height(60).url() || '/placeholder.svg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-gray-500">
                        {item.quantity}x • {item.selectedSize && `${item.selectedSize} • `}{formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Pricing */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span>{shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>enthaltene MwSt. (19%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Gesamt</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <hr className="my-6" />

              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Zahlung
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zahlungsart *
                  </label>
                  <Select value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Wählen Sie eine Zahlungsart" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="invoice">Auf Rechnung (für Stammkunden)</SelectItem>
                      <SelectItem value="bank_transfer">Vorkasse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PayPal Payment */}
                {formData.paymentMethod === 'paypal' && validateForm() ? (
                  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? (
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                        currency: "EUR",
                        intent: "capture"
                      }}
                    >
                    <PayPalButtons
                      disabled={isProcessing}
                      createOrder={async (data, actions) => {
                        setIsProcessing(true)
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "EUR",
                                value: total.toFixed(2),
                                breakdown: {
                                  item_total: {
                                    currency_code: "EUR",
                                    value: subtotal.toFixed(2)
                                  },
                                  shipping: {
                                    currency_code: "EUR",
                                    value: shipping.toFixed(2)
                                  }
                                }
                              },
                              items: items.map(item => ({
                                name: item.title,
                                unit_amount: {
                                  currency_code: "EUR",
                                  value: item.price.toFixed(2)
                                },
                                quantity: item.quantity.toString(),
                                description: item.selectedSize ? `Size: ${item.selectedSize}` : undefined
                              }))
                            }
                          ]
                        })
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const orderCapture = await actions.order?.capture()
                          if (orderCapture) {
                            // Create order in Sanity
                            const orderId = await createOrder(data.orderID!)

                            // Update order with payment details
                            await updateOrderAfterPayment(
                              orderId,
                              orderCapture.id || '',
                              orderCapture.payer?.payer_id || ''
                            )

                            // Save addresses to user metadata
                            await saveAddressesToUserMetadata()

                            // Clear cart
                            resetCart()

                            // Redirect to success page
                            router.push(`/checkout/success?orderId=${orderId}`)

                            toast.success('Zahlung erfolgreich! Ihre Bestellung wurde aufgegeben.')
                          }
                        } catch (error) {
                          console.error('Payment error:', error)
                          toast.error('Fehler bei der Zahlung. Bitte versuchen Sie es erneut.')
                        } finally {
                          setIsProcessing(false)
                        }
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err)
                        toast.error('PayPal-Fehler. Bitte versuchen Sie es erneut.')
                        setIsProcessing(false)
                      }}
                      onCancel={() => {
                        toast.info('Zahlung abgebrochen.')
                        setIsProcessing(false)
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 mb-2">
                      PayPal-Konfiguration fehlt.
                    </p>
                    <p className="text-xs text-red-600">
                      Bitte setzen Sie NEXT_PUBLIC_PAYPAL_CLIENT_ID in den Umgebungsvariablen.
                    </p>
                  </div>
                )
                ) : formData.paymentMethod === 'paypal' ? (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Bitte füllen Sie alle Pflichtfelder aus, um fortzufahren.
                    </p>
                  </div>
                ) : null}

                {/* Invoice Payment */}
                {formData.paymentMethod === 'invoice' && (
                  <div>
                    {validateForm() ? (
                      <div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Zahlung auf Rechnung</strong>
                          </p>
                          <p className="text-xs text-blue-700">
                            Diese Option steht nur für Stammkunden zur Verfügung. Sie erhalten eine Rechnung mit der Lieferung.
                          </p>
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              setIsProcessing(true)
                              // Create order without PayPal
                              const orderId = await createOrder('INVOICE')

                              // Save addresses to user metadata
                              await saveAddressesToUserMetadata()

                              // Clear cart
                              resetCart()

                              // Redirect to success page
                              router.push(`/checkout/success?orderId=${orderId}`)

                              toast.success('Bestellung erfolgreich aufgegeben!')
                            } catch (error) {
                              console.error('Order error:', error)
                              toast.error('Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.')
                            } finally {
                              setIsProcessing(false)
                            }
                          }}
                          disabled={isProcessing}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Wird verarbeitet...
                            </>
                          ) : (
                            'Kostenpflichtig bestellen'
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          Bitte füllen Sie alle Pflichtfelder aus, um fortzufahren.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bank Transfer Payment */}
                {formData.paymentMethod === 'bank_transfer' && (
                  <div>
                    {validateForm() ? (
                      <div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Vorkasse per Überweisung</strong>
                          </p>
                          <p className="text-xs text-blue-700">
                            Nach Ihrer Bestellung erhalten Sie unsere Bankverbindung. Die Ware wird nach Zahlungseingang versandt.
                          </p>
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              setIsProcessing(true)
                              // Create order without PayPal
                              const orderId = await createOrder('BANK_TRANSFER')

                              // Save addresses to user metadata
                              await saveAddressesToUserMetadata()

                              // Clear cart
                              resetCart()

                              // Redirect to success page
                              router.push(`/checkout/success?orderId=${orderId}`)

                              toast.success('Bestellung erfolgreich aufgegeben!')
                            } catch (error) {
                              console.error('Order error:', error)
                              toast.error('Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.')
                            } finally {
                              setIsProcessing(false)
                            }
                          }}
                          disabled={isProcessing}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Wird verarbeitet...
                            </>
                          ) : (
                            'Kostenpflichtig bestellen'
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          Bitte füllen Sie alle Pflichtfelder aus, um fortzufahren.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage