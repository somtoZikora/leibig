"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Minus, Plus, ChevronRight, ShoppingCart, Check, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct, type ExpandedBundleProduct, type SanityImage, isBundle, getProductStock } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import ProductReviews from "./product-reviews"
import RelatedProdcut from "./RelatedProdcut"
import { useCartActions, useProductQuantity, useIsProductInCart } from "@/lib/store"
import { toast } from "sonner"
import { PortableText } from "@portabletext/react"
import ReactPixel from 'react-facebook-pixel'
import { gtagViewItem, gtagAddToCart } from '@/lib/google-analytics'


interface SingleProductPageProps {
  product: WineProduct | ExpandedBundleProduct
}

export default function SingleProductPage({ product }: SingleProductPageProps) {
  const isBundleProduct = isBundle(product)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(!isBundleProduct && product.sizes?.[0] ? product.sizes[0] : "Standard")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Cart store hooks
  const { addItem } = useCartActions()
  const currentQuantity = useProductQuantity(product._id)
  const isInCart = useIsProductInCart(product._id)

  // Track ViewContent event when product page loads
  useEffect(() => {
    // Meta Pixel
    ReactPixel.track('ViewContent', {
      content_ids: [product._id],
      content_name: product.title,
      content_type: 'product',
      value: product.price,
      currency: 'EUR',
    })

    // Google Analytics
    gtagViewItem({
      currency: 'EUR',
      value: product.price,
      items: [{
        item_id: product._id,
        item_name: product.title,
        price: product.price,
      }],
    })
  }, [product._id, product.title, product.price])

  // Calculate stock based on product type
  const productStock = isBundleProduct ? getProductStock(product) : product.stock

  // Format price with German locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  // Local gallery images to use for regular products
  const localGalleryImages = [
    '/product-details/Wein_generell.jpg',
    '/product-details/Weingläser Still.jpeg',
    '/product-details/Bottles all.jpeg'
  ]

  // For bundles: use actual gallery images from Sanity
  // For products: use hardcoded local images
  const images = isBundleProduct && product.gallery && product.gallery.length > 0
    ? [product.image, ...product.gallery]
    : product.gallery && product.gallery.length > 0
    ? [product.image, ...localGalleryImages]
    : [product.image]

  // Type guard to check if image is local string path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLocalImage = (img: any): img is string => typeof img === 'string'

  const discountPercentage = product.discount || 40

  // Handle add to cart
  const handleAddToCart = async () => {
    if (productStock === 0) {
      toast.error("Dieses Produkt ist nicht verfügbar")
      return
    }

    if (currentQuantity + quantity > productStock) {
      toast.error(`Nur noch ${productStock - currentQuantity} Stück verfügbar`)
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
          stock: productStock,
          sizes: isBundleProduct ? undefined : product.sizes
        }, isBundleProduct ? undefined : selectedSize)
      }

      // Track AddToCart event - Meta Pixel
      ReactPixel.track('AddToCart', {
        content_ids: [product._id],
        content_name: product.title,
        content_type: 'product',
        value: product.price * quantity,
        currency: 'EUR',
      })

      // Track AddToCart event - Google Analytics
      gtagAddToCart({
        currency: 'EUR',
        value: product.price * quantity,
        items: [{
          item_id: product._id,
          item_name: product.title,
          price: product.price,
          quantity: quantity,
        }],
      })

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
    if (productStock === 0) return "Ausverkauft"
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
    const stars = []

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        // Full star
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        )
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        // Half star
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 text-gray-300"
          />
        )
      }
    }

    return stars
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[rgba(139,115,85,0.2)] px-4 py-3 md:px-8">
        <nav className="flex items-center space-x-2 text-sm text-blue-600">
          <Link href="/" className="hover:underline cursor-pointer">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category ? (
            <Link
              href={`/shop?category=${product.category.slug.current}`}
              className="hover:underline cursor-pointer"
            >
              {product.category.title}
            </Link>
          ) : (
            <span className="hover:underline cursor-pointer">Weine</span>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-600">{product.title}</span>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 py-8 gap-8">
        {/* Left side - Thumbnails */}
        <div className="flex flex-col space-y-4 w-24">
          {images.map((img, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                selectedImage === index ? "border-[rgba(139,115,85,0.4)]" : "border-[rgba(139,115,85,0.2)] hover:border-[rgba(139,115,85,0.3)]",
              )}
            >
              <Image
                src={isLocalImage(img) ? img : (urlFor(img)?.width(100).height(100).url() || "/placeholder.svg")}
                alt={`${product.title} view ${index + 1}`}
                fill
                quality={100}
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Center - Main Image */}
        <div className="flex-1 max-w-md">
          <div className="relative aspect-square bg-[rgba(139,115,85,0.05)] rounded-lg overflow-hidden">
            <Image
              src={isLocalImage(images[selectedImage]) ? images[selectedImage] : (urlFor(images[selectedImage])?.width(500).height(500).url() || "/placeholder.svg")}
              alt={product.title}
              fill
              quality={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className="flex-1 max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {product.subtitle && product.subtitle.length > 0 && (
              <div className="text-gray-600 mb-4">
                <PortableText
                  value={product.subtitle}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-1 text-base">{children}</p>,
                      h1: ({ children }) => <p className="text-xl font-semibold mb-1">{children}</p>,
                      h2: ({ children }) => <p className="text-lg font-semibold mb-1">{children}</p>,
                      h3: ({ children }) => <p className="text-base font-medium mb-1">{children}</p>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic my-1">{children}</blockquote>,
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc ml-5 mb-1">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal ml-5 mb-1">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li className="mb-0.5">{children}</li>,
                      number: ({ children }) => <li className="mb-0.5">{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      underline: ({ children }) => <span className="underline">{children}</span>,
                      link: ({ value, children }) => {
                        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                        return (
                          <a
                            href={value?.href}
                            target={target}
                            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                            className="text-blue-600 hover:underline"
                          >
                            {children}
                          </a>
                        )
                      },
                    },
                  }}
                />
              </div>
            )}

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600">{product.rating}/5</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {(typeof product.oldPrice === 'number'
                && product.oldPrice > 0
                && product.oldPrice > product.price) && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

          </div>

          {/* Bundle Contents - Desktop */}
          {isBundleProduct && product.bundleItems && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Enthaltene Weine
              </h3>
              <div className="space-y-2">
                {product.bundleItems.map((item) => (
                  <div key={item._key} className="flex items-center justify-between p-2 bg-[rgba(139,115,85,0.05)] rounded-lg">
                    <span className="text-sm text-gray-700">{item.product.title}</span>
                    <span className="text-sm font-medium text-gray-900">{item.quantity}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {!isBundleProduct && product.sizes && (
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
                        : "bg-white text-gray-700 border-[rgba(139,115,85,0.3)] hover:border-[rgba(139,115,85,0.4)]",
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
              <div className="flex items-center border border-[rgba(139,115,85,0.3)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[rgba(139,115,85,0.05)] transition-colors disabled:opacity-50 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, productStock - currentQuantity))}
                  className="p-2 hover:bg-[rgba(139,115,85,0.05)] transition-colors disabled:opacity-50 rounded-r-lg"
                  disabled={quantity + currentQuantity >= productStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || productStock === 0 || currentQuantity >= productStock}
                className={cn(
                  "flex-1 py-3 text-base font-medium rounded-full p-4 transition-all duration-200",
                  justAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : productStock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-[rgba(139,115,85,0.8)]"
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
              {currentQuantity > 0 && (
                <div className="flex items-center justify-between">
                  <span>Im Warenkorb:</span>
                  <span className="font-medium text-orange-600">{currentQuantity} Stück</span>
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
          <div className="relative aspect-square bg-[rgba(139,115,85,0.05)] rounded-lg overflow-hidden">
            <Image
              src={isLocalImage(images[selectedImage]) ? images[selectedImage] : (urlFor(images[selectedImage])?.width(400).height(400).url() || "/placeholder.svg")}
              alt={product.title}
              fill
              quality={100}
              className="object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((img, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === index ? "border-[rgba(139,115,85,0.4)]" : "border-[rgba(139,115,85,0.2)]",
                )}
              >
                <Image
                  src={isLocalImage(img) ? img : (urlFor(img)?.width(80).height(80).url() || "/placeholder.svg")}
                  alt={`${product.title} view ${index + 1}`}
                  fill
                  quality={100}
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

            {product.subtitle && product.subtitle.length > 0 && (
              <div className="text-gray-600">
                <PortableText
                  value={product.subtitle}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-1 text-sm">{children}</p>,
                      h1: ({ children }) => <p className="text-lg font-semibold mb-1">{children}</p>,
                      h2: ({ children }) => <p className="text-base font-semibold mb-1">{children}</p>,
                      h3: ({ children }) => <p className="text-sm font-medium mb-1">{children}</p>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic my-1">{children}</blockquote>,
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc ml-5 mb-1 text-sm">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal ml-5 mb-1 text-sm">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li className="mb-0.5">{children}</li>,
                      number: ({ children }) => <li className="mb-0.5">{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      underline: ({ children }) => <span className="underline">{children}</span>,
                      link: ({ value, children }) => {
                        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                        return (
                          <a
                            href={value?.href}
                            target={target}
                            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                            className="text-blue-600 hover:underline"
                          >
                            {children}
                          </a>
                        )
                      },
                    },
                  }}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600">{product.rating}/5</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {(typeof product.oldPrice === 'number'
                && product.oldPrice > 0
                && product.oldPrice > product.price) && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Bundle Contents - Mobile */}
            {isBundleProduct && product.bundleItems && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Enthaltene Weine
                </h3>
                <div className="space-y-2">
                  {product.bundleItems.map((item) => (
                    <div key={item._key} className="flex items-center justify-between p-2 bg-[rgba(139,115,85,0.05)] rounded-lg">
                      <span className="text-sm text-gray-700">{item.product.title}</span>
                      <span className="text-sm font-medium text-gray-900">{item.quantity}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Size Selection */}
            {!isBundleProduct && product.sizes && product.sizes.length > 0 && (
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
                          : "bg-white text-gray-700 border-[rgba(139,115,85,0.3)] hover:border-[rgba(139,115,85,0.4)]",
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
              <div className="flex items-center border border-[rgba(139,115,85,0.3)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[rgba(139,115,85,0.05)] transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 min-w-[4rem] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, productStock - currentQuantity))}
                  className="p-3 hover:bg-[rgba(139,115,85,0.05)] transition-colors disabled:opacity-50"
                  disabled={quantity + currentQuantity >= productStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || productStock === 0 || currentQuantity >= productStock}
                className={cn(
                  "flex-1 py-4 text-base font-medium transition-all duration-200",
                  justAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : productStock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-[rgba(139,115,85,0.8)]"
                )}
              >
                <div className="flex items-center gap-2">
                  {getButtonIcon()}
                  <span>{getButtonText()}</span>
                </div>
              </Button>
            </div>

            {/* Mobile cart info - only show cart quantity */}
            {currentQuantity > 0 && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Im Warenkorb:</span>
                  <span className="font-medium text-orange-600">{currentQuantity} Stück</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
       <ProductReviews productId={product._id} product={product} />

        <div className="text-center mb-8">
          <h2 className="text-[25px] md:text-[48px] font-bold tracking-tight text-black mb-2">Das könnte Ihnen auch gefallen</h2>
        </div>
        <div className="mb-16 md:mb-20">
          <RelatedProdcut product={product} />
        </div>
    </div>
    
  )
}
