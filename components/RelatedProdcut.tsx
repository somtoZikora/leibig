"use client"

import React, { useEffect, useState } from 'react'
import { WineProductCard } from './wine-product-card'
import { WineProductSkeleton } from './wine-product-skeleton'
import { client, wineQueries, type WineProduct, type ExpandedBundleProduct } from '@/lib/sanity'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface RelatedProductProps {
  product: WineProduct | ExpandedBundleProduct
}

const RelatedProdcut = ({ product }: RelatedProductProps) => {
  const [relatedProducts, setRelatedProducts] = useState<(WineProduct | ExpandedBundleProduct)[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Determine target category based on current product's category
        const currentCategorySlug = product.category?.slug?.current
        const isGeschenkundGenusspakete = currentCategorySlug === 'geschenk-und-genusspakete'
        const targetCategorySlug = isGeschenkundGenusspakete ? 'entdeckerpakete' : 'geschenk-und-genusspakete'

        // Fetch ALL products and bundles from the target category
        const categoryQuery = `*[_type in ["product", "bundle"] &&
          _id != $currentId &&
          category->slug.current == $targetCategorySlug
        ] | order(_createdAt desc) {
          _id,
          _type,
          title,
          slug,
          image,
          gallery,
          description,
          price,
          oldPrice,
          discount,
          rating,
          status,
          variant,
          category->{
            _id,
            title,
            slug
          },
          tags,
          _type == "product" => {
            sizes,
            stock
          },
          _type == "bundle" => {
            bundleItems[] {
              _key,
              quantity,
              product-> {
                _id,
                title,
                stock
              }
            }
          }
        }`

        const categoryResults = await client.fetch(categoryQuery, {
          currentId: product._id,
          targetCategorySlug
        })

        // Use results from target category if any found
        if (categoryResults && categoryResults.length > 0) {
          setRelatedProducts(categoryResults)
        } else {
          // Fallback: Use old logic only if no products found in target category
          const fallbackQuery = `*[_type in ["product", "bundle"] && _id != $currentId && (
            category._ref == $categoryId ||
            count(tags[@ in $productTags]) > 0
          )] | order(_createdAt desc) [0...4] {
            _id,
            _type,
            title,
            slug,
            image,
            gallery,
            description,
            price,
            oldPrice,
            discount,
            rating,
            status,
            variant,
            category->{
              _id,
              title,
              slug
            },
            tags,
            _type == "product" => {
              sizes,
              stock
            },
            _type == "bundle" => {
              bundleItems[] {
                _key,
                quantity,
                product-> {
                  _id,
                  title,
                  stock
                }
              }
            }
          }`

          const fallbackResults = await client.fetch(fallbackQuery, {
            currentId: product._id,
            categoryId: product.category?._id || null,
            productTags: product.tags || []
          })

          setRelatedProducts(fallbackResults || [])
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
        // Fallback to top sellers if related products fail
        try {
          const fallback = await client.fetch(wineQueries.topSellers, { limit: 4, offset: 0 })
          setRelatedProducts(fallback || [])
        } catch (fallbackError) {
          console.error('Error fetching fallback products:', fallbackError)
          setRelatedProducts([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (product._id) {
      fetchRelatedProducts()
    }
  }, [product._id, product.category, product.tags])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Mobile skeleton */}
        <div className="md:hidden max-w-sm mx-auto">
          <WineProductSkeleton />
        </div>
        
        {/* Desktop skeleton */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <WineProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Keine ähnlichen Produkte gefunden.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Mobile Layout with Swiper */}
      <div className="md:hidden max-w-sm mx-auto">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          loop={relatedProducts.length > 1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-orange-500",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-orange-600",
          }}
          className="wine-swiper"
        >
          {relatedProducts.map((relatedProduct) => (
            <SwiperSlide key={relatedProduct._id}>
              <WineProductCard
                product={relatedProduct}
                id={relatedProduct._id}
                isLoading={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {relatedProducts.map((relatedProduct) => (
          <WineProductCard
            key={relatedProduct._id}
            product={relatedProduct}
            id={relatedProduct._id}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedProdcut