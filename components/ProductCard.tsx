"use client"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct } from "@/lib/sanity"
import { useCartActions } from "@/lib/store"
import WishlistButton from "./WishlistButton"
import { motion } from 'framer-motion'
import { productCardHover, imageHover, buttonAnimationProps, transitions } from '@/lib/animations'

interface ProductCardProps {
  product: WineProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartActions()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <motion.div 
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
      variants={productCardHover}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug.current}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.image && (
            <motion.div
              variants={imageHover}
              initial="initial"
              whileHover="hover"
            >
              <Image
                src={urlFor(product.image)?.width(400).height(400).url() || '/placeholder.svg'}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>
        
        {/* Status Badge */}
        {product.status && (
          <motion.div 
            className="absolute top-2 left-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, ...transitions.spring }}
          >
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              {product.status}
            </span>
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.div 
          className="absolute top-2 right-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, ...transitions.spring }}
        >
          <WishlistButton
            productId={product._id}
            title={product.title}
            image={product.image}
            price={product.price}
          />
        </motion.div>

        {/* Discount Badge */}
        {product.discount && (
          <motion.div 
            className="absolute top-2 left-2 mt-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, ...transitions.spring }}
          >
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          </motion.div>
        )}
      </Link>

      {/* Product Info */}
      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...transitions.smooth }}
      >
        <Link href={`/products/${product.slug.current}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-gray-700">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              €{product.price.toFixed(2)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                €{product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.div {...buttonAnimationProps}>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Ausverkauft" : "In den Warenkorb"}
          </Button>
        </motion.div>

        {/* Stock Status */}
        {product.stock < 10 && product.stock > 0 && (
          <motion.p 
            className="text-sm text-orange-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, ...transitions.smooth }}
          >
            Nur noch {product.stock} auf Lager
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}