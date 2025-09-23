"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Minus, Plus, ChevronRight, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct, type SanityImage } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import ProductReviews from "./product-reviews"
import RelatedProdcut from "./RelatedProdcut"
import { useCartActions, useProductQuantity, useIsProductInCart } from "@/lib/store"
import { toast } from "sonner"


interface SingleProductPageProps {
  product: WineProduct
}

export default function SingleProductPage({ product }: SingleProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Standard")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Cart store hooks
  const { addItem } = useCartActions()
  const currentQuantity = useProductQuantity(product._id)
  const isInCart = useIsProductInCart(product._id)

  const images = product.gallery || [product.image]
  const discountPercentage = product.discount || 40

  // Handle add to cart
  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Dieses Produkt ist nicht verfügbar")
      return
    }

    if (currentQuantity + quantity > product.stock) {
      toast.error(`Nur noch ${product.stock - currentQuantity} Stück verfügbar`)
      return
    }

    setIsLoading(true)
    
    try {
      // Add each quantity individually to handle size selection properly
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
        }, selectedSize)
      }
      
      // Show success feedback
      setJustAdded(true)
      toast.success(`${quantity}x ${product.title} ${selectedSize ? `(${selectedSize})` : ''} wurde zum Warenkorb hinzugefügt`)
      
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

  const getButtonText = () => {
    if (product.stock === 0) return "Ausverkauft"
    if (isLoading) return "Wird hinzugefügt..."
    if (justAdded) return "Hinzugefügt!"
    if (quantity > 1) return `${quantity}x In den Warenkorb`
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn("h-4 w-4", i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 px-4 py-3 md:px-8">
        <nav className="flex items-center space-x-2 text-sm text-blue-600">
          <span className="hover:underline cursor-pointer">Startseite</span>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:underline cursor-pointer">Weine</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-600">Jahrgang 2000</span>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 py-8 gap-8">
        {/* Left side - Thumbnails */}
        <div className="flex flex-col space-y-4 w-24">
          {images.map((img: SanityImage, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                selectedImage === index ? "border-gray-400" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <Image
                src={urlFor(img).width(100).height(100).url() || "/placeholder.svg"}
                alt={`${product.title} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Center - Main Image */}
        <div className="flex-1 max-w-md">
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={urlFor(images[selectedImage]).width(500).height(500).url() || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className="flex-1 max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600">{product.rating}/5</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{product.price} $</span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{product.oldPrice} $</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6">
              {product.description || "Dieser Wein ist perfekt für jeden Anlass lorem ipsum"}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Größe wählen</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock - currentQuantity))}
                  className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity + currentQuantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={isLoading || product.stock === 0 || currentQuantity >= product.stock}
                className={cn(
                  "flex-1 py-3 text-base font-medium rounded-full p-4 transition-all duration-200",
                  justAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2">
                  {getButtonIcon()}
                  <span>{getButtonText()}</span>
                </div>
              </Button>
            </div>
            
            {/* Stock and cart info */}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Verfügbar:</span>
                <span className={cn(
                  "font-medium",
                  product.stock <= 5 ? "text-red-600" : "text-green-600"
                )}>
                  {product.stock > 0 ? `${product.stock} Stück` : "Ausverkauft"}
                </span>
              </div>
              {currentQuantity > 0 && (
                <div className="flex items-center justify-between">
                  <span>Im Warenkorb:</span>
                  <span className="font-medium text-orange-600">{currentQuantity} Stück</span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center justify-between">
                  <span>Ausgewählte Größe:</span>
                  <span className="font-medium">{selectedSize}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="px-4 py-6 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={urlFor(images[selectedImage]).width(400).height(400).url() || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((img: SanityImage, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === index ? "border-gray-400" : "border-gray-200",
                )}
              >
                <Image
                  src={urlFor(img).width(80).height(80).url() || "/placeholder.svg"}
                  alt={`${product.title} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600">{product.rating}/5</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-gray-900">{product.price} $</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{product.oldPrice} $</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description ||
                "Wein Wein kommt dieser Wein kommt dieser Wein kommt dieser Wein kommt dieser Wein kommt dieser Wein kommt"}
            </p>

            {/* Mobile Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Größe wählen</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 min-w-[4rem] text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock - currentQuantity))}
                  className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity + currentQuantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={isLoading || product.stock === 0 || currentQuantity >= product.stock}
                className={cn(
                  "flex-1 py-4 text-base font-medium transition-all duration-200",
                  justAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2">
                  {getButtonIcon()}
                  <span>{getButtonText()}</span>
                </div>
              </Button>
            </div>
            
            {/* Mobile stock and cart info */}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Verfügbar:</span>
                <span className={cn(
                  "font-medium",
                  product.stock <= 5 ? "text-red-600" : "text-green-600"
                )}>
                  {product.stock > 0 ? `${product.stock} Stück` : "Ausverkauft"}
                </span>
              </div>
              {currentQuantity > 0 && (
                <div className="flex items-center justify-between">
                  <span>Im Warenkorb:</span>
                  <span className="font-medium text-orange-600">{currentQuantity} Stück</span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center justify-between">
                  <span>Ausgewählte Größe:</span>
                  <span className="font-medium">{selectedSize}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       <ProductReviews productId={product._id} product={product} />

        <div className="text-center mb-8">
          <h2 className="text-[25px] md:text-[48px] font-bold tracking-tight text-black mb-2">Das könnte Ihnen auch gefallen</h2>
        </div>
        <RelatedProdcut product={product} />
    </div>
    
  )
}
