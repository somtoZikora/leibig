"use client"

import React, { useEffect } from 'react'
import { ShoppingCart, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface NoAccessToCartProps {
  redirectUrl?: string
}

const NoAccessToCart: React.FC<NoAccessToCartProps> = ({ 
  redirectUrl = '/cart' 
}) => {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  // Redirect to cart if user becomes authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectUrl)
    }
  }, [isSignedIn, isLoaded, router, redirectUrl])

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // If user is signed in, don't show this component (should redirect)
  if (isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-orange-600" />
          </div>
          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Anmeldung erforderlich
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Um auf Ihren Warenkorb zuzugreifen und Bestellungen aufzugeben, 
            müssen Sie sich zunächst anmelden oder ein Konto erstellen.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">!</span>
              </div>
              <div>
                <strong>Ihre Vorteile:</strong>
                <ul className="mt-1 space-y-1 text-left">
                  <li>• Warenkorb wird gespeichert</li>
                  <li>• Bestellhistorie einsehen</li>
                  <li>• Schnellerer Checkout</li>
                  <li>• Exklusive Angebote erhalten</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <SignInButton 
            mode="modal"
            fallbackRedirectUrl={redirectUrl}
            forceRedirectUrl={redirectUrl}
          >
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base font-medium">
              <User className="w-5 h-5 mr-2" />
              Jetzt anmelden
            </Button>
          </SignInButton>
          
          <p className="text-xs text-gray-500">
            Noch kein Konto? Die Registrierung ist kostenlos und dauert nur wenige Sekunden.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Oder möchten Sie weiter stöbern?
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/shop')}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Weiter einkaufen
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NoAccessToCart