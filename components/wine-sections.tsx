"use client"

import { useEffect, useState } from "react"
import { WineProductCard } from "./wine-product-card"
import { WineProductSkeleton } from "./wine-product-skeleton"
import {client , wineQueries, type WineProduct } from "@/lib/sanity"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import ProductStarterSets from "./ProductStarterSets"

export function WineSections() {
  const [starterSets, setStarterSets] = useState<WineProduct[]>([])
  const [topSellers, setTopSellers] = useState<WineProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [starters, bestsellers] = await Promise.all([
          client.fetch(wineQueries.starterSets),
          client.fetch(wineQueries.topSellers, { limit: 4, offset: 0 }),
        ])

        setStarterSets(starters || [])
        setTopSellers(bestsellers || [])
      } catch (error) {
        console.error("Error fetching wine products:", error)
        setStarterSets([])
        setTopSellers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

const handleLoadMore = async () => {
  setLoadingMore(true)
  try {
    const newPage = page + 1
    const limit = 4 // show 4 at a time
    const offset = (newPage - 1) * limit

    const moreProducts = await client.fetch(wineQueries.topSellers, {
      offset,
      limit, // ✅ now we are passing limit
    })

    if (moreProducts.length === 0) {
      setLoadingMore(false)
      return
    }

    setTopSellers((prev) => [...prev, ...moreProducts])
    setPage(newPage)
  } catch (error) {
    console.error("Error loading more products:", error)
  } finally {
    setLoadingMore(false)
  }
}

  return (
    <div className="space-y-16">
    

      <section className="bg-muted/30 -mx-4 px-4 py-12 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-[25px] md:text-[48px] font-bold tracking-tight text-black mb-2">TOP-VERKÄUFER</h2>
        </div>

        <div className="md:hidden max-w-sm mx-auto">
          {isLoading ? (
            <WineProductSkeleton />
          ) : topSellers.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              loop={true}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-orange-500",
                bulletActiveClass: "swiper-pagination-bullet-active !bg-orange-600",
              }}
              className="wine-swiper"
            >
              {topSellers.map((product) => (
                <SwiperSlide key={product._id}>
                  <WineProductCard product={product} id={product._id} isLoading={isLoading} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No top sellers available at the moment.</p>
            </div>
          )}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-4 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <WineProductSkeleton key={i} />)
          ) : topSellers.length > 0 ? (
            topSellers.map((product) => (
              <WineProductCard
                key={product._id}
                product={product}
                id={product._id}
                isLoading={isLoading}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No top sellers available at the moment.</p>
            </div>
          )}
        </div>

        {topSellers.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-black border border-gray-300 rounded-full py-2 px-6 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Laden...
                </div>
              ) : (
                "Alle anzeigen"
              )}
            </button>
          </div>
        )}
      </section>
        <section>
       
     
        
      </section>
    </div>
  )
}
