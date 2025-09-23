"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, Eye, ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { client, wineQueries, urlFor, type Order } from '@/lib/sanity'
import { useUser } from '@clerk/nextjs'

const SuccessPage = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      
      try {
        const orderData = await client.fetch(wineQueries.singleOrder, { orderId })
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const printInvoice = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bestellung nicht gefunden</h1>
          <Link href="/shop">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Zurück zum Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vielen Dank für Ihre Bestellung!
          </h1>
          <p className="text-gray-600">
            Ihre Bestellung wurde erfolgreich aufgegeben und wird bearbeitet.
          </p>
        </div>

        {/* Order Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Bestellung {order.orderNumber}
              </h2>
              <p className="text-gray-600">
                Aufgegeben am {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={printInvoice}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Drucken
              </Button>
              <Link href="/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Alle Bestellungen
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Bestellt</p>
              <p className="text-xs text-gray-500">Bestellung aufgegeben</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mb-2">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">In Bearbeitung</p>
              <p className="text-xs text-gray-500">Wird vorbereitet</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mb-2">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">Versandt</p>
              <p className="text-xs text-gray-500">Unterwegs zu Ihnen</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bestellte Artikel</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.productSnapshot.image ? (
                      <Image
                        src={urlFor(item.productSnapshot.image).width(64).height(80).url() || '/placeholder.svg'}
                        alt={item.productSnapshot.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-lg">
                          {item.productSnapshot.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.productSnapshot.title}</h4>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">Größe: {item.selectedSize}</p>
                    )}
                    <p className="text-sm text-gray-600">Menge: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)} pro Stück</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" id="invoice">
          <div className="print:block">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rechnung</h2>
                <p className="text-gray-600">Bestellung {order.orderNumber}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-900">Wineshop</h3>
                <p className="text-sm text-gray-600">
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rechnungsadresse</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                  <p>{order.billingAddress.street}</p>
                  <p>{order.billingAddress.postalCode} {order.billingAddress.city}</p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Lieferadresse</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Tel: {order.shippingAddress.phone}</p>}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span>{order.shipping === 0 ? 'Kostenlos' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>MwSt. ({order.taxRate}%)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Gesamtbetrag</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Zahlungsmethode:</strong> PayPal</p>
                  <p><strong>Zahlungsstatus:</strong> Bezahlt</p>
                  {order.paymentId && (
                    <p><strong>Transaktions-ID:</strong> {order.paymentId}</p>
                  )}
                </div>
                <div>
                  <p><strong>Bestelldatum:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>E-Mail:</strong> {order.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Weiter einkaufen
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="w-4 h-4 mr-2" />
              Meine Bestellungen
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice, #invoice * {
            visibility: visible;
          }
          #invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default SuccessPage