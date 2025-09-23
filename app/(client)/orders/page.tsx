"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import NoAccessToOrders from '@/components/NoAccessToOrders'
import { Package, Calendar, Eye, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { client, wineQueries, urlFor, type Order } from '@/lib/sanity'

const OrdersPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      
      try {
        const userOrders = await client.fetch(wineQueries.ordersByUser, { userId: user.id })
        setOrders(userOrders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (isSignedIn && user) {
      fetchOrders()
    }
  }, [user, isSignedIn])

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  // Show NoAccessToOrders component if user is not signed in
  if (!isSignedIn) {
    return <NoAccessToOrders redirectUrl="/orders" />
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'paid':
        return 'bg-blue-100 text-blue-700'
      case 'processing':
        return 'bg-orange-100 text-orange-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'refunded':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend'
      case 'paid':
        return 'Bezahlt'
      case 'processing':
        return 'Bearbeitung'
      case 'shipped':
        return 'Versandt'
      case 'delivered':
        return 'Zugestellt'
      case 'cancelled':
        return 'Storniert'
      case 'refunded':
        return 'Rückerstattet'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meine Bestellungen
          </h1>
          <p className="text-gray-600">
            Übersicht über alle Ihre Weinbestellungen
          </p>
        </div>

        {isLoadingOrders ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Bestellungen werden geladen...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Noch keine Bestellungen
            </h2>
            <p className="text-gray-600 mb-6">
              Sie haben noch keine Weinbestellungen aufgegeben.
            </p>
            <Link href="/shop">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Package className="w-4 h-4 mr-2" />
                Jetzt Weine entdecken
              </Button>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Bestellung {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(order.status)
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="relative w-10 h-12 bg-gray-100 rounded border-2 border-white overflow-hidden">
                          {item.productSnapshot.image ? (
                            <Image
                              src={urlFor(item.productSnapshot.image)?.width(40).height(48).url() || '/placeholder.svg'}
                              alt={item.productSnapshot.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                              <span className="text-orange-600 font-bold text-xs">
                                {item.productSnapshot.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative w-10 h-12 bg-gray-200 rounded border-2 border-white flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {order.items.length} Artikel • {order.items.slice(0, 2).map(item => item.productSnapshot.title).join(', ')}
                        {order.items.length > 2 && ', ...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Zahlungsmethode: {order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod}</span>
                    <span>•</span>
                    <span>Status: {getStatusText(order.paymentStatus)}</span>
                  </div>
                  <Link href={`/checkout/success?orderId=${order._id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Details anzeigen
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage