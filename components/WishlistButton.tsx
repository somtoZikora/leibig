"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartActions, useIsProductInWishlist, type WishlistItem } from "@/lib/store"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { type SanityImage } from "@/lib/sanity"

interface WishlistButtonProps {
  product: {
    _id: string
    title: string
    slug: { current: string }
    image?: SanityImage
    price: number
    oldPrice?: number
    discount?: number
    rating: number
    status?: "TOP-VERKÄUFER" | "STARTERSETS"
    variant?: "Im Angebot" | "Neuheiten" | "Weine"
    stock: number
    sizes?: string[]
  }
  className?: string
  showDot?: boolean
}

export default function WishlistButton({ product, className = "", showDot = false }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist } = useCartActions()
  const isInWishlist = useIsProductInWishlist(product._id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist) {
      removeFromWishlist(product._id)
      toast.success(`${product.title} aus der Wunschliste entfernt`)
    } else {
      addToWishlist(product)
      toast.success(`${product.title} zur Wunschliste hinzugefügt`)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleWishlist}
        className={`relative ${className}`}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isInWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
        {showDot && isInWishlist && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
        )}
      </Button>
    </motion.div>
  )
}
