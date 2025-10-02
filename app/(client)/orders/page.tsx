"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import NoAccessToOrders from '@/components/NoAccessToOrders'
import { Package, Calendar, Eye, ArrowRight, Loader2, Star } from 'lucide-react'
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

  // Show NoAccessToOrders component if user is not signed in
  if (!isSignedIn) {
    return <NoAccessToOrders redirectUrl="/orders" />
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'processing':
        return 'bg-orange-100 text-orange-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Startseite</Link>
            <span className="mx-2"></span>
            <span className="text-gray-900">Orders</span>
          </nav>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ongoing'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {isLoadingOrders ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link href="/shop">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Package className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          /* Orders List - Individual Order Items */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {order.items[0]?.productSnapshot.image ? (
                      <Image
                        src={urlFor(order.items[0].productSnapshot.image)?.width(64).height(80).url() || '/placeholder.svg'}
                        alt={order.items[0].productSnapshot.title}
                        width={64}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-lg">
                          W
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {order.items[0]?.productSnapshot.title || 'Vintage wine name'}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {renderStars(4)}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">4/5</span>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.items[0]?.productSnapshot.price || order.total)}
                    </p>
                  </div>

                  {/* Status and Delivery Date */}
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      getStatusColor(order.status)
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-sm text-gray-600">
                      On {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* See Details Link */}
                  <div className="ml-4">
                    <Link href={`/checkout/success?orderId=${order._id}`}>
                      <Button variant="ghost" className="text-orange-600 hover:text-orange-700 p-0 h-auto">
                        See Details
                      </Button>
                    </Link>
                  </div>
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