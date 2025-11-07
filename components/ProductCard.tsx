"use client"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct } from "@/lib/sanity"
import { useCartActions, useProductQuantity, useIsProductInCart } from "@/lib/store"
import WishlistButton from "./WishlistButton"
import { motion } from 'framer-motion'
import { productCardHover, imageHover, buttonAnimationProps, transitions } from '@/lib/animations'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductCardProps {
  product: WineProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartActions()
  const currentQuantity = useProductQuantity(product._id)
  const isInCart = useIsProductInCart(product._id)

  // Format price with German locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) {
      toast.error("Dieses Produkt ist nicht verfügbar")
      return
    }

    if (currentQuantity + quantity > product.stock) {
      toast.error("Maximale Anzahl bereits im Warenkorb")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate async operation for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Add multiple items based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          _id: product._id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice,
          discount: product.discount,
          rating: product.rating,
          status: product.status,
          variant: product.variant,
          stock: product.stock,
          sizes: product.sizes
        })
      }
      
      // Show success feedback
      setJustAdded(true)
      toast.success(`${quantity}x ${product.title} wurde zum Warenkorb hinzugefügt`)
      
      // Reset success state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000)
      
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Fehler beim Hinzufügen zum Warenkorb")
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = product.stock === 0
  const isMaxQuantity = currentQuantity >= product.stock
  const isDisabled = isLoading || isOutOfStock || isMaxQuantity

  const getButtonText = () => {
    if (isOutOfStock) return "Ausverkauft"
    if (isMaxQuantity) return "Max. erreicht"
    if (justAdded) return "Hinzugefügt!"
    if (isLoading) return "Wird hinzugefügt..."
    return "In den Warenkorb"
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    }
    if (justAdded) {
      return <Check className="h-4 w-4" />
    }
    return <ShoppingCart className="h-4 w-4" />
  }

  return (
    <motion.div 
      className="group relative bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
      variants={productCardHover}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Product Image */}
      <div className="aspect-[3/4] relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
        {product.image ? (
          <Image
            src={urlFor(product.image)?.width(300).height(400).url() || '/placeholder.svg'}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <span className="text-orange-600 font-bold text-2xl">
              {product.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="space-y-3">
        <h3 className="font-bold text-black text-lg text-center">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center justify-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>
        
        {/* Price */}
        <div className="text-center">
          <span className="font-bold text-black text-xl">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Quantity Selector and Add to Cart */}
        <div className="space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleQuantityChange(quantity - 1)
              }}
              className="h-8 w-8 p-0 rounded-full"
              disabled={product.stock === 0 || quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium text-lg">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleQuantityChange(quantity + 1)
              }}
              className="h-8 w-8 p-0 rounded-full"
              disabled={product.stock === 0 || quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className="w-full bg-black text-white hover:bg-[rgba(139,115,85,0.8)] rounded-lg py-2"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            In den Warenkorb
          </Button>
        </div>
      </div>
    </motion.div>
  )
}