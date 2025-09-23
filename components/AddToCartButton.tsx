"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCartActions, useProductQuantity, type Product } from "@/lib/store"
import { toast } from "sonner"

interface Props {
  product: Product
  size?: string
  variant?: "default" | "secondary" | "outline"
  showQuantity?: boolean
  className?: string
}

const AddToCartButton: React.FC<Props> = ({ 
  product, 
  size, 
  variant = "default", 
  showQuantity = false,
  className = ""
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [justAdded, setJustAdded] = React.useState(false)
  const { addItem } = useCartActions()
  const currentQuantity = useProductQuantity(product._id)

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Dieses Produkt ist nicht verfügbar")
      return
    }

    if (currentQuantity >= product.stock) {
      toast.error("Maximale Anzahl bereits im Warenkorb")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      addItem(product, size)
      
      // Show success feedback
      setJustAdded(true)
      toast.success(`${product.title} wurde zum Warenkorb hinzugefügt`)
      
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
    if (showQuantity && currentQuantity > 0) return `In den Warenkorb (${currentQuantity})`
    return "In den Warenkorb"
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    }
    if (justAdded) {
      return <Check className="w-3 h-3" />
    }
    return <ShoppingCart className="w-3 h-3" />
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      variant={variant}
      className={`
        ${variant === "default" ? "bg-[#CC641A] hover:bg-orange-600 text-white" : ""}
        ${justAdded ? "bg-green-600 hover:bg-green-700" : ""}
        ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : ""}
        px-3 py-1 h-8 rounded transition-all duration-200
        ${className}
      `}
      size="sm"
    >
      <div className="flex items-center gap-1.5">
        {getButtonIcon()}
        <span className="text-xs font-medium">{getButtonText()}</span>
      </div>
    </Button>
  )
}

export default AddToCartButton
