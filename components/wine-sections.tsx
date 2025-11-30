"use client"

import { useEffect, useState } from "react"
import { WineProductCard } from "./wine-product-card"
import { WineProductSkeleton } from "./wine-product-skeleton"
import { DataService, type WineProduct } from "@/lib/dataService"
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
          DataService.getStarterSets(),
          DataService.getTopSellers(4, 0),
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

    const moreProducts = await DataService.getTopSellers(limit, offset)

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
    <div className="space-y-8">
      <section className="bg-muted/30 -mx-4 px-4 py-6 rounded-2xl">
        <div className="text-center mb-4">
          <h2 className="text-[25px] md:text-[48px] font-bold tracking-tight text-black mb-2">TOP-VERKÄUFER</h2>
        </div>

        <div className="md:hidden w-full pl-4 pr-0">
          {isLoading ? (
            <WineProductSkeleton />
          ) : topSellers.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={8}
              slidesPerView={1.3}
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
              <p className="text-sm text-gray-500 mt-2">Loading state: {isLoading ? 'Loading...' : 'Loaded'}</p>
              <p className="text-sm text-gray-500">Data count: {topSellers.length}</p>
            </div>
          )}
        </div>

      
      </section>
        <section>
       
     
        
      </section>
    </div>
  )
}
