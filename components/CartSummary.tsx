"use client"

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useCartData } from '@/lib/store'

/**
 * CartSummary Component - Example of using the cart store
 * 
 * This component demonstrates how to use the cart store in any component.
 * It shows cart count, total price, and provides a link to the cart page.
 */
const CartSummary = () => {
  const { 
    getTotalPrice, 
    getTotalItemsCount 
  } = useCartData()

  const itemsCount = getTotalItemsCount()
  const totalPrice = getTotalPrice()

  if (itemsCount === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Ihr Warenkorb ist leer</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-orange-600" />
          <span className="font-medium">Warenkorb</span>
        </div>
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
          {itemsCount} {itemsCount === 1 ? 'Artikel' : 'Artikel'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Artikel:</span>
          <span>{itemsCount}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Gesamt:</span>
          <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalPrice)}</span>
        </div>
      </div>
      
      <Link href="/cart">
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
          Warenkorb anzeigen
        </Button>
      </Link>
    </div>
  )
}

export default CartSummary