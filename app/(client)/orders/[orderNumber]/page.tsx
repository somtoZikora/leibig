"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Package, Calendar, Loader2, ArrowLeft, MapPin, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { client, wineQueries, urlFor, type Order } from '@/lib/sanity'

const OrderDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const orderNumber = params.orderNumber as string

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return

      try {
        const orderData = await client.fetch(wineQueries.orderByNumber, { orderNumber })

        // Check if order belongs to current user
        if (orderData && user && orderData.userId !== user.id) {
          router.push('/orders')
          return
        }

        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setIsLoadingOrder(false)
      }
    }

    if (isSignedIn && user && orderNumber) {
      fetchOrder()
    }
  }, [orderNumber, user, isSignedIn, router])

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  // If user is not signed in, redirect to orders
  if (!isSignedIn) {
    router.push('/orders')
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500 text-white'
      case 'shipped':
        return 'bg-blue-500 text-white'
      case 'processing':
        return 'bg-orange-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'paid':
        return 'bg-green-600 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Zugestellt'
      case 'shipped':
        return 'Versandt'
      case 'processing':
        return 'In Bearbeitung'
      case 'pending':
        return 'Ausstehend'
      case 'cancelled':
        return 'Storniert'
      case 'paid':
        return 'Bezahlt'
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'paypal':
        return 'PayPal'
      case 'credit_card':
        return 'Kreditkarte'
      case 'bank_transfer':
        return 'Vorkasse'
      case 'invoice':
        return 'Auf Rechnung'
      default:
        return method
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Bestellungen
            </Button>
          </Link>
        </div>

        {isLoadingOrder ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Bestellung wird geladen...</p>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bestellung nicht gefunden
            </h2>
            <p className="text-gray-600 mb-6">
              Diese Bestellung existiert nicht oder Sie haben keine Berechtigung, sie anzuzeigen.
            </p>
            <Link href="/orders">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Zu meinen Bestellungen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Bestellung {order.orderNumber}
                  </h1>
                  <p className="text-gray-600">
                    Aufgegeben am {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bestellte Artikel</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="w-20 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      {item.productSnapshot?.image ? (
                        <Image
                          src={urlFor(item.productSnapshot.image)?.width(80).height(96).url() || '/placeholder.svg'}
                          alt={item.productSnapshot.title}
                          width={80}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="w-8 h-12 bg-gray-300 rounded-sm"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productSnapshot?.title || 'Produkt'}
                      </h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Größe: {item.selectedSize}</p>
                      )}
                      <p className="text-sm text-gray-600">Menge: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.unitPrice)} je Stück
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Versand</span>
                  <span>{order.shipping === 0 ? 'Kostenlos' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>MwSt. ({order.taxRate}%)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Gesamt</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Zahlungsart:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getPaymentMethodText(order.paymentMethod)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ihre Anmerkungen</h2>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailPage
