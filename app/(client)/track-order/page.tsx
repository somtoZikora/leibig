"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Package, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { client } from '@/lib/sanity'

const TrackOrderPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !orderNumber.trim()) {
      toast.error('Bitte geben Sie E-Mail und Bestellnummer ein')
      return
    }

    setIsLoading(true)

    try {
      // Query Sanity for guest order
      const order = await client.fetch(
        `*[_type == "order" && customerEmail == $email && orderNumber == $orderNumber && isGuest == true][0] {
          _id,
          orderNumber,
          status
        }`,
        { email: email.toLowerCase().trim(), orderNumber: orderNumber.trim() }
      )

      if (!order) {
        toast.error('Bestellung nicht gefunden. Bitte überprüfen Sie Ihre Angaben.')
        return
      }

      // Redirect to order details page
      router.push(`/orders/${order._id}?guest=true`)
    } catch (error) {
      console.error('Error tracking order:', error)
      toast.error('Fehler beim Abrufen der Bestellung. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bestellung verfolgen
          </h1>
          <p className="text-gray-600">
            Geben Sie Ihre E-Mail-Adresse und Bestellnummer ein, um den Status Ihrer Bestellung zu überprüfen
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail-Adresse *
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Bestellnummer *
              </label>
              <Input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="WS-123456-ABCDEF"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Sie finden Ihre Bestellnummer in der Bestätigungs-E-Mail
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesucht...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Bestellung suchen
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Haben Sie ein Konto?{' '}
              <a href="/sign-in" className="text-orange-600 hover:text-orange-700 font-medium">
                Melden Sie sich an
              </a>
              {' '}um alle Ihre Bestellungen zu sehen
            </p>
          </div>
        </Card>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Hilfe benötigt?
          </h3>
          <p className="text-xs text-blue-800">
            Falls Sie Probleme beim Auffinden Ihrer Bestellung haben, kontaktieren Sie bitte unseren Kundenservice mit Ihrer E-Mail-Adresse.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage
