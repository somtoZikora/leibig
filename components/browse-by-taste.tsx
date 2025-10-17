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
  <div className="bg-white rounded-2xl p-6 flex flex-col justify-between animate-pulse min-h-[200px] relative overflow-hidden">
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded w-28"></div>
    </div>
    <div className="w-32 h-40 bg-gray-200 rounded self-end -mr-4 -mb-4 transform rotate-12"></div>
  </div>
)

return (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto bg-gray-100 rounded-t-[40px] rounded-b-[40px] px-8 py-12">
      {/* Desktop title */}
      <h2 className="text-[40px] md:text-5xl font-black text-center mb-12 text-black hidden md:block tracking-tight">
        NACH GESCHMACK BROWSEN
      </h2>

      {/* Mobile title */}
      <h2 className="text-2xl font-black text-center mb-8 text-black md:hidden tracking-tight">
        NACH GESCHMACK STÖBERN
      </h2>

      {isLoading ? (
        <>
          {/* Desktop loading - Asymmetric layout */}
          <div className="hidden md:block">
            <div className="flex gap-6 mb-6">
              <div className="w-[35%]">
                <CategorySkeleton />
              </div>
              <div className="w-[65%]">
                <CategorySkeleton />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-[65%]">
                <CategorySkeleton />
              </div>
              <div className="w-[35%]">
                <CategorySkeleton />
              </div>
            </div>
          </div>

          {/* Mobile loading */}
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 flex items-center justify-between animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-16 h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Desktop asymmetric layout */}
          <div className="hidden md:block">
            {/* First row: 35% - 65% */}
            <div className="flex gap-6 mb-6">
              <div className="w-[35%]">
                <Link
                  key={categories[0]?._id}
                  href={`/shop?category=${categories[0]?.slug.current}`}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group min-h-[200px] relative overflow-hidden block"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black group-hover:text-[#CC641A] transition-colors">
                      {categories[0]?.title}
                    </h3>
                  </div>
                  <div className="relative w-32 h-40 self-end -mr-4 -mb-4 transform rotate-12">
                    {categories[0]?.image ? (
                      <Image
                        src={
                          urlFor(categories[0].image)?.width(180).height(260).url() ||
                          "/placeholder.svg"
                        }
                        alt={`${categories[0].title} wine category`}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                        <span className="text-3xl font-bold text-orange-600">
                          {categories[0]?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="w-[65%]">
                <Link
                  key={categories[1]?._id}
                  href={`/shop?category=${categories[1]?.slug.current}`}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group min-h-[200px] relative overflow-hidden block"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black group-hover:text-[#CC641A] transition-colors">
                      {categories[1]?.title}
                    </h3>
                  </div>
                  <div className="relative w-32 h-40 self-end -mr-4 -mb-4 transform rotate-12">
                    {categories[1]?.image ? (
                      <Image
                        src={
                          urlFor(categories[1].image)?.width(180).height(260).url() ||
                          "/placeholder.svg"
                        }
                        alt={`${categories[1].title} wine category`}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                        <span className="text-3xl font-bold text-orange-600">
                          {categories[1]?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Second row: 65% - 35% */}
            <div className="flex gap-6">
              <div className="w-[65%]">
                <Link
                  key={categories[2]?._id}
                  href={`/shop?category=${categories[2]?.slug.current}`}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group min-h-[200px] relative overflow-hidden block"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black group-hover:text-[#CC641A] transition-colors">
                      {categories[2]?.title}
                    </h3>
                  </div>
                  <div className="relative w-32 h-40 self-end -mr-4 -mb-4 transform rotate-12">
                    {categories[2]?.image ? (
                      <Image
                        src={
                          urlFor(categories[2].image)?.width(180).height(260).url() ||
                          "/placeholder.svg"
                        }
                        alt={`${categories[2].title} wine category`}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                        <span className="text-3xl font-bold text-orange-600">
                          {categories[2]?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="w-[35%]">
                <Link
                  key={categories[3]?._id}
                  href={`/shop?category=${categories[3]?.slug.current}`}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group min-h-[200px] relative overflow-hidden block"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black group-hover:text-[#CC641A] transition-colors">
                      {categories[3]?.title}
                    </h3>
                  </div>
                  <div className="relative w-32 h-40 self-end -mr-4 -mb-4 transform rotate-12">
                    {categories[3]?.image ? (
                      <Image
                        src={
                          urlFor(categories[3].image)?.width(180).height(260).url() ||
                          "/placeholder.svg"
                        }
                        alt={`${categories[3].title} wine category`}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                        <span className="text-3xl font-bold text-orange-600">
                          {categories[3]?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile stack layout */}
          <div className="md:hidden space-y-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug.current}`}
                className="bg-white rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black group-hover:text-orange-600 transition-colors">
                    {category.title}
                  </h3>
                </div>
                <div className="relative w-16 h-24 ml-4 flex-shrink-0">
                  {category.image ? (
                    <Image
                      src={
                        urlFor(category.image)?.width(64).height(96).url() ||
                        "/placeholder.svg"
                      }
                      alt={`${category.title} wine category`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      sizes="64px"
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
