import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface WishlistButtonProps {
  productId: string
  title: string
  image?: unknown
  price: number
}

export default function WishlistButton({ productId, title, image, price }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { wishlist, addToWishlist, removeFromWishlist } = useCartStore()

  useEffect(() => {
    setIsInWishlist(wishlist.some(item => item.id === productId))
  }, [productId, wishlist])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      removeFromWishlist(productId)
      toast.success('Aus der Wunschliste entfernt', {
        description: `${title} wurde aus Ihrer Wunschliste entfernt`,
      })
    } else {
      addToWishlist({
        id: productId,
        title,
        image,
        price,
        quantity: 1,
        addedAt: new Date()
      })
      toast.success('Zur Wunschliste hinzugefügt', {
        description: `${title} wurde zu Ihrer Wunschliste hinzugefügt`,
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-2 relative"
      onClick={toggleWishlist}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
      {isInWishlist && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          •
        </span>
      )}
    </Button>
  )
}