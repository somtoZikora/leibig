"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import AddToCartButton from "./AddToCartButton"
import WishlistButton from "./WishlistButton"
import Link from "next/link"
import { useCartActions, useProductQuantity, useIsProductInCart } from "@/lib/store"
import { toast } from 'sonner'

interface WineProductCardProps {
  product: WineProduct
  className?: string
  id: string,
  isLoading: boolean
}


export function WineProductCard({ product, className, id, }: WineProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const { addItem } = useCartActions()
  const currentQuantity = useProductQuantity(product._id)
  const isInCart = useIsProductInCart(product._id)

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Dieses Produkt ist nicht verfügbar")
      return
    }

    if (currentQuantity + quantity > product.stock) {
      toast.error("Nicht genügend Produkte auf Lager")
      return
    }

    setIsLoading(true)
    
    try {
      // Add each quantity individually
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
      
      // Reset quantity and success state
      setQuantity(1)
      setTimeout(() => setJustAdded(false), 2000)
      
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Fehler beim Hinzufügen zum Warenkorb")
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Star rating component matching the design
  const StarIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-grow-0 flex-shrink-0"
      preserveAspectRatio="none"
    >
      <path
        d="M9.74494 0.745544L12.3641 6.38545L18.5374 7.13364L13.9829 11.3675L15.179 17.4698L9.74494 14.4465L4.3109 17.4698L5.50697 11.3675L0.952479 7.13364L7.12573 6.38545L9.74494 0.745544Z"
        fill={filled ? "#FFC633" : "#E5E7EB"}
      />
    </svg>
  )

  // Half star component
  const HalfStarIcon = () => (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-grow-0 flex-shrink-0"
      preserveAspectRatio="none"
    >
      <path
        d="M4.06594 17.4697L9.49998 14.4465V0.745499L6.88077 6.38541L0.70752 7.13359L5.26201 11.3674L4.06594 17.4697Z"
        fill="#FFC633"
      />
    </svg>
  )

  // Dynamic star rendering function to match product page
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) {
        return <StarIcon key={i} filled={true} />
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        return <HalfStarIcon key={i} />
      } else {
        return <StarIcon key={i} filled={false} />
      }
    })
  }

  // Shopping cart icon
  const ShoppingCartIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-grow-0 flex-shrink-0 w-3 h-3 relative"
      preserveAspectRatio="none"
    >
      <g clipPath="url(#clip0_500_458)">
        <path
          d="M5 10.6155C5 10.7638 4.95601 10.9088 4.8736 11.0322C4.79119 11.1555 4.67406 11.2516 4.53701 11.3084C4.39997 11.3652 4.24917 11.38 4.10368 11.3511C3.9582 11.3221 3.82456 11.2507 3.71967 11.1458C3.61478 11.0409 3.54335 10.9073 3.51441 10.7618C3.48547 10.6163 3.50032 10.4655 3.55709 10.3285C3.61386 10.1914 3.70999 10.0743 3.83332 9.99188C3.95666 9.90946 4.10166 9.86548 4.25 9.86548C4.44891 9.86548 4.63968 9.9445 4.78033 10.0851C4.92098 10.2258 5 10.4166 5 10.6155ZM9.125 9.86548C8.97666 9.86548 8.83166 9.90946 8.70832 9.99188C8.58498 10.0743 8.48886 10.1914 8.43209 10.3285C8.37532 10.4655 8.36047 10.6163 8.38941 10.7618C8.41835 10.9073 8.48978 11.0409 8.59467 11.1458C8.69956 11.2507 8.8332 11.3221 8.97868 11.3511C9.12417 11.38 9.27497 11.3652 9.41201 11.3084C9.54906 11.2516 9.66619 11.1555 9.7486 11.0322C9.83101 10.9088 9.875 10.7638 9.875 10.6155C9.875 10.4166 9.79598 10.2258 9.65533 10.0851C9.51468 9.9445 9.32391 9.86548 9.125 9.86548ZM11.3586 3.97563L10.0212 8.32142C9.9512 8.55179 9.80877 8.75345 9.61507 8.89649C9.42137 9.03952 9.18672 9.11632 8.94594 9.11548H4.44078C4.19655 9.11456 3.95919 9.03455 3.76424 8.88743C3.56929 8.74031 3.42724 8.534 3.35938 8.29938L1.66344 2.36548H0.875C0.775544 2.36548 0.680161 2.32597 0.609835 2.25564C0.539509 2.18532 0.5 2.08993 0.5 1.99048C0.5 1.89102 0.539509 1.79564 0.609835 1.72531C0.680161 1.65499 0.775544 1.61548 0.875 1.61548H1.66344C1.82629 1.61602 1.98458 1.66929 2.11463 1.76731C2.24467 1.86533 2.33947 2.00283 2.38484 2.15923L2.765 3.49048H11C11.0587 3.49046 11.1166 3.50421 11.169 3.53063C11.2214 3.55704 11.2668 3.59539 11.3017 3.64258C11.3366 3.68977 11.3599 3.74449 11.3698 3.80234C11.3797 3.86018 11.3758 3.91954 11.3586 3.97563ZM10.4923 4.24048H2.97922L4.08031 8.0936C4.10271 8.17192 4.15001 8.24082 4.21504 8.28987C4.28008 8.33892 4.35932 8.36546 4.44078 8.36548H8.94594C9.02618 8.36551 9.10431 8.3398 9.16886 8.29213C9.23341 8.24445 9.28096 8.17734 9.30453 8.10064L10.4923 4.24048Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_500_458">
          <rect width="12" height="12" fill="white" transform="translate(0.5 0.490479)" />
        </clipPath>
      </defs>
    </svg>
  )

  // Dropdown arrow icon
  const DropdownArrowIcon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-grow-0 flex-shrink-0 w-[14.4px] h-[14.4px] absolute left-[15.8px] top-[8.8px]"
      preserveAspectRatio="none"
    >
      <path
        d="M3.8999 5.69067L7.4999 9.29067L11.0999 5.69067"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className={cn("flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[240px] relative gap-2", className)}>
      {/* Image Container */}
      <div className="self-stretch flex-grow-0 flex-shrink-0 h-[240px] md:h-[240px] relative overflow-hidden rounded-[20px] bg-gray-100 flex items-center justify-center">
        {/* Wishlist Button - positioned in top right corner */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton
            productId={product._id}
            title={product.title}
            image={product.image}
            price={product.price}
          />
        </div>

        {product.image ? (
          <Link href={`/product/${product?.slug?.current}`} className="block w-1/2 h-1/2 p-4">
            <Image
              src={urlFor(product.image)?.width(300).height(400).url() || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </Link>
        ) : (
          <div className="w-1/2 h-1/2 p-4 bg-gray-200 flex items-center justify-center">
            <div className="w-12 h-24 bg-gray-300 rounded-full" />
          </div>
        )}
      </div>

      {/* Product Title */}
      <Link href={`/product/${product?.slug?.current}`}>
        <p className="self-stretch flex-grow-0 flex-shrink-0 w-[240px] text-[16px] font-normal text-left text-black hover:text-gray-700 transition-colors leading-tight break-words">
          {product.title}
        </p>
      </Link>

      {/* Rating */}
      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[13px]">
        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-[5px]">
          {renderStars(product.rating)}
        </div>
      
      </div>

      {/* Price and Add to Cart Row */}
      <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-full relative gap-2.5">
        {/* Price */}
        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2.5">
          <p className="flex-grow-0 flex-shrink-0 font-black text-left text-black">${product.price}</p>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>
          )}
        </div>

        {/* Quantity Selector / Add to Cart Button */}
        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[62px]">
          <div ref={dropdownRef} className="flex-grow-0 flex-shrink-0 w-[33px] h-7 rounded-tl-md rounded-bl-md bg-[#d9d9d9] relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full h-full flex items-center justify-between px-2 text-xs font-black text-black hover:bg-gray-400 transition-colors rounded-tl-md rounded-bl-md"
            >
              <span>{quantity}</span>
              <DropdownArrowIcon />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md shadow-lg z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setQuantity(num)
                      setShowDropdown(false)
                    }}
                    className={`w-full px-2 py-1 text-xs font-black text-left hover:bg-gray-100 transition-colors ${
                      quantity === num ? 'bg-gray-200' : ''
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 p-2 rounded-tr-md rounded-br-md bg-[#cc641a] hover:bg-[#b55a17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : justAdded ? (
              <Check className="w-3 h-3 text-white" />
            ) : (
              <ShoppingCartIcon />
            )}
          </button>
        </div>
      </div>

      {/* Stock Status */}
      {product.stock < 10 && product.stock > 0 && (
        <p className="text-xs text-orange-600 mt-2">
          Nur noch {product.stock} auf Lager
        </p>
      )}
      {product.stock === 0 && (
        <p className="text-xs text-red-600 font-medium mt-2">
          Ausverkauft
        </p>
      )}
    </div>
  )
}