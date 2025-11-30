"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Calendar, Eye, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { client, wineQueries, urlFor, type Order } from '@/lib/sanity'

// Mock order data for demonstration
const mockOrders = [
  {
    _id: '1',
    orderNumber: 'KL-2024-001',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '2',
    orderNumber: 'KL-2024-002',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '3',
    orderNumber: 'KL-2024-003',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '4',
    orderNumber: 'KL-2024-004',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '5',
    orderNumber: 'KL-2024-005',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '6',
    orderNumber: 'KL-2024-006',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  },
  {
    _id: '7',
    orderNumber: 'KL-2024-007',
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-11-10',
    total: 120,
    paymentMethod: 'paypal',
    items: [
      {
        productSnapshot: {
          title: 'Vintage wine name',
          image: null,
          price: 120
        },
        quantity: 1
      }
    ]
  }
]

const OrdersPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing')
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      
      try {
        const userOrders = await client.fetch(wineQueries.ordersByUser, { userId: user.id })
        setOrders(userOrders || mockOrders) // Use mock data if no real orders
      } catch (error) {
        console.error('Error fetching orders:', error)
        // setOrders(mockOrders) // Fallback to mock data
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

  // If user is not signed in, show empty state
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-600">Startseite</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900">Bestellungen</span>
            </nav>
          </div>

          {/* Empty state for non-authenticated users */}
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bitte melden Sie sich an
            </h2>
            <p className="text-gray-600 mb-6">
              Melden Sie sich an, um Ihre Bestellungen anzuzeigen.
            </p>
            <Link href="/sign-in">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Anmelden
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
      month: '2-digit',
      day: '2-digit'
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Startseite</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">Bestellungen</span>
          </nav>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="relative flex space-x-8">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === 'ongoing'
                    ? 'text-gray-800 font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Laufend
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'text-gray-800 font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Abgeschlossen
              </button>
              
              {/* Wide underline indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200"></div>
              <div 
                className={`absolute bottom-0 h-0.5 bg-gray-800 transition-all duration-300 ${
                  activeTab === 'ongoing' 
                    ? 'left-0 right-1/2' 
                    : 'left-1/2 right-0'
                }`}
              ></div>
            </div>
          </div>
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
              Sie haben noch keine Bestellungen aufgegeben.
            </p>
            <Link href="/shop">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Package className="w-4 h-4 mr-2" />
                Jetzt einkaufen
              </Button>
            </Link>
          </div>
        ) : (
          /* Orders List - Individual Order Items */
          <div className="space-y-4">
            {orders.map((order) => {
              // Get all product names from order items
              const productNames = order.items.map(item =>
                item.productSnapshot?.title || 'Produkt'
              ).join(', ')

              return (
                <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Order Icon */}
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-orange-600" />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0 w-full md:w-auto">
                      <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1">
                        Bestellung {order.orderNumber}
                      </h3>

                      {/* Product Names */}
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {productNames}
                      </p>

                      {/* Total Price */}
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        {formatPrice(order.total)}
                      </p>

                      {/* Status and Delivery Date - Mobile Layout */}
                      <div className="flex flex-col md:hidden gap-2 mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <p className="text-sm text-gray-500">
                          Am {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Status and Delivery Date - Desktop Layout */}
                    <div className="hidden md:flex flex-col items-end text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-sm text-gray-500">
                        Am {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* See Details Link */}
                    <div className="w-full md:w-auto">
                      <Link href={`/orders/${order.orderNumber}`}>
                        <Button
                          variant="ghost"
                          className="text-orange-600 hover:text-orange-700 p-0 h-auto w-full md:w-auto text-left md:text-center"
                        >
                          Details ansehen
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage