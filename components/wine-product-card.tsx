"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import AddToCartButton from "./AddToCartButton"
import WishlistButton from "./WishlistButton"
import Link from "next/link"

interface WineProductCardProps {
  product: WineProduct
  className?: string
  id: string,
  isLoading: boolean
}


export function WineProductCard({ product, className, id, }: WineProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
  }

  return (
    <div className={cn("flex flex-col rounded-lg p-4  transition-all duration-300 group", className)}>
      <div className="relative aspect-[3/4] mb-3 bg-[#F0EEED] rounded-lg overflow-hidden">
        {/* Wishlist Button - positioned in top right corner */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton
            productId={product._id}
            title={product.title}
            image={product.image}
            price={product.price}
          />
        </div>

        {/* Status Badge */}
        {product.status && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              {product.status}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 mt-8 z-10">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          </div>
        )}

        {product.image ? (
          <Link href={`/product/${product?.slug?.current}`}>
            <>
              <Image
                src={urlFor(product.image).width(300).height(400).url() || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </>
          </Link>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="w-16 h-32 bg-gray-300 rounded-full" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Link href={`/product/${product?.slug?.current}`}>
          <h3 className="font-medium text-black text-sm leading-tight hover:text-gray-700 transition-colors">{product.title}</h3>
        </Link>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(product.rating) ? "fill-[#FFC633] text-orange-500" : "text-gray-300",
              )}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">{product.rating}/5</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-black">${product.price}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 text-sm hover:bg-gray-50"
            >
              -
            </button>
            <span className="px-2 py-1 text-sm font-medium min-w-[1.5rem] text-center border-x border-gray-300">
              {quantity}
            </span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 text-sm hover:bg-gray-50">
              +
            </button>
          </div>

          <AddToCartButton 
            product={{
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
            }} 
            showQuantity={true}
          />
        </div>

        {/* Stock Status */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600">
            Nur noch {product.stock} auf Lager
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600 font-medium">
            Ausverkauft
          </p>
        )}
      </div>
    </div>
  )
}