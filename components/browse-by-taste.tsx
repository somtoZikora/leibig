"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { client, wineQueries, type Category, urlFor } from "@/lib/sanity"

const fallbackCategories: Category[] = [
  { _id: "fallback-1", title: "Lässig", slug: { current: "laessig" }, description: "Entspannte Weine für den Alltag", image: undefined },
  { _id: "fallback-2", title: "Formal", slug: { current: "formal" }, description: "Elegante Weine für besondere Anlässe", image: undefined },
  { _id: "fallback-3", title: "Party", slug: { current: "party" }, description: "Festliche Weine zum Feiern", image: undefined },
  { _id: "fallback-4", title: "Hochzeit", slug: { current: "hochzeit" }, description: "Edle Weine für den schönsten Tag", image: undefined },
]

export default function BrowseByTaste() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await client.fetch(wineQueries.categories)
        setCategories(categoriesData.length > 0 ? categoriesData : fallbackCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories(fallbackCategories)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

 const CategorySkeleton = () => (
  <div className="bg-white rounded-l p-8 flex items-center justify-between animate-pulse min-h-[220px]">
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded w-28 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-36"></div>
    </div>
    <div className="w-28 h-44 bg-gray-200 rounded"></div>
  </div>
)

return (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto bg-gray-100 rounded-t-[40px] rounded-b-[40px] px-8 py-12">
      {/* Desktop title */}
      <h2 className="text-[40px] md:text-4xl font-bold text-center mb-12 text-black hidden md:block">
        NACH GESCHMACK BROWSEN
      </h2>

      {/* Mobile title */}
      <h2 className="text-2xl font-bold text-center mb-8 text-black md:hidden">
        NACH GESCHMACK STÖBERN
      </h2>

      {isLoading ? (
        <>
          {/* Desktop loading */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>

          {/* Mobile loading */}
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 flex items-center justify-between animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="w-16 h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Desktop grid layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug.current}`}
                className="bg-white rounded-2xl p-8 flex items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group min-h-[220px]"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black group-hover:text-[#CC641A] transition-colors">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="relative w-28 h-44 ml-6 flex-shrink-0">
                  {category.image ? (
                    <Image
                      src={
                        urlFor(category.image)?.width(180).height(260).url() ||
                        "/placeholder.svg"
                      }
                      alt={`${category.title} wine category`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                      <span className="text-3xl font-bold text-orange-600">
                        {category.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile stack layout (unchanged) */}
          <div className="md:hidden space-y-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug.current}`}
                className="bg-white rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black group-hover:text-orange-600 transition-colors">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-xs mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="relative w-16 h-24 ml-4">
                  {category.image ? (
                    <Image
                      src={
                        urlFor(category.image)?.width(64).height(96).url() ||
                        "/placeholder.svg"
                      }
                      alt={`${category.title} wine category`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                      <span className="text-xl font-bold text-orange-600">
                        {category.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
)

}
