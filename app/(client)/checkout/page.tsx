"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartData, useCartActions } from '@/lib/store'
import { testSanityConnection, urlFor } from '@/lib/sanity'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CreditCard, ShoppingBag } from 'lucide-react'
import NoAccessToCart from '@/components/NoAccessToCart'

interface ShippingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
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
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland'
  })

  const subtotal = getTotalPrice()
  const tax = getTaxAmount(0.19)
  const shipping = getShippingCost(50, 5.99)
  const total = subtotal + tax + shipping

  // Update email when user loads
  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      setShippingData(prev => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
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

  if (!user) {
    return <NoAccessToCart redirectUrl="/checkout" />
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
        userInfo: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress
        },
        cartItems: items.length,
        total
      })
      
      const orderNumber = generateOrderNumber()
      
      const orderData = {
        _type: 'order',
        orderNumber,
        customerEmail: shippingData.email,
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        userId: user.id,
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
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.street,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country,
          phone: shippingData.phone
        },
        billingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.street,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country
        },
        paymentMethod: 'paypal',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'street', 'city', 'postalCode', 'country']
    return required.every(field => shippingData[field as keyof ShippingFormData].trim() !== '')
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
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Lieferadresse</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vorname *
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
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
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straße und Hausnummer *
                  </label>
                  <Input
                    type="text"
                    name="street"
                    value={shippingData.street}
                    onChange={handleInputChange}
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
                    value={shippingData.city}
                    onChange={handleInputChange}
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
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
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
                    value={shippingData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
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
                          src={urlFor(item.image).width(48).height(60).url() || '/placeholder.svg'}
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
                <div className="flex justify-between">
                  <span>MwSt. (19%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Gesamt</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <hr className="my-6" />

              {/* PayPal Payment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Zahlung
                </h3>
                
                {validateForm() ? (
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
                                  tax_total: {
                                    currency_code: "EUR",
                                    value: tax.toFixed(2)
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
                              orderCapture.id,
                              orderCapture.payer?.payer_id || ''
                            )

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
                ) : (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Bitte füllen Sie alle Pflichtfelder aus, um fortzufahren.
                    </p>
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