"use client"

import { useEffect, useState } from "react"
import { WineProductCard } from "./wine-product-card"
import { WineProductSkeleton } from "./wine-product-skeleton"
import { DataService, type WineProduct } from "@/lib/dataService"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const ProductStarterSets = () => {
  const [starterSets, setStarterSets] = useState<WineProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const fetchStarterSets = async () => {
      try {
        const starters = await DataService.getStarterSets()
        setStarterSets(starters || [])
      } catch (error) {
        console.error("Error fetching starter sets:", error)
        setStarterSets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchStarterSets()
  }, [])

  return (
    <div className="space-y-16">
      <section className="bg-muted/30 -mx-4 px-4 py-12 rounded-2xl">
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
            Von Null auf Mosel.
          </h2>
          <p className="text-gray-700 text-base md:text-lg lg:text-xl">
            Ob Riesling, Sekt oder Lagenwein – unsere Starter-Bundles bringen dir den Charakter der Mosel direkt nach Hause.
          </p>
        </div>

        <div className="md:hidden w-full pl-4 pr-0">
          {isLoading ? (
            <WineProductSkeleton />
          ) : starterSets.length > 0 ? (
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
              {starterSets.map((product) => (
                <SwiperSlide key={product._id}>
                  <WineProductCard product={product} id={product._id} isLoading={isLoading} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No starter sets available at the moment.</p>
            </div>
          )}
        </div>

        <div className="hidden md:grid grid-cols-5 gap-12 max-w-8xl mx-auto">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <WineProductSkeleton key={i} />)
          ) : starterSets.length > 0 ? (
            starterSets.map((product, index) => (
              <div className={`col-span-1 flex items-center justify-center ${index === 0 ? 'col-start-2' : ''}`} key={product._id}>
                <WineProductCard
                  key={product._id}
                  product={product}
                  id={product._id}
                  isLoading={isLoading}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No starter sets available at the moment.</p>
            </div>
          )}
        </div>


      </section>
    </div>
  )
}

export default ProductStarterSets
