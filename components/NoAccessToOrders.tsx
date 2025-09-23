"use client"

import React from 'react'
import { SignInButton } from '@clerk/nextjs'
import { Package, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoAccessToOrdersProps {
  redirectUrl?: string
}

const NoAccessToOrders = ({ redirectUrl = "/orders" }: NoAccessToOrdersProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Anmeldung erforderlich
          </h1>
          
          <p className="text-gray-600 mb-8">
            Um Ihre Bestellungen anzuzeigen, müssen Sie sich zunächst anmelden oder ein Konto erstellen.
          </p>
          
          <div className="space-y-4">
            <SignInButton 
              fallbackRedirectUrl={redirectUrl}
              forceRedirectUrl={redirectUrl}
            >
              <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                <LogIn className="w-4 h-4 mr-2" />
                Jetzt anmelden
              </Button>
            </SignInButton>
            
            <p className="text-sm text-gray-500">
              Nach der Anmeldung werden Sie automatisch zu Ihren Bestellungen weitergeleitet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoAccessToOrders