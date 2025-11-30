"use client"

import Image from "next/image"
import Link from "next/link"
import { type Category, urlFor } from "@/lib/sanity"

const fallbackCategories: Category[] = [
  { _id: "fallback-1", title: "Mineralisch & Tiefgründig", slug: { current: "mineralisch-tiefgruendig" }, description: "Mineralisch & Tiefgründig", image: undefined, localImage: "/Bilder - Icons rund/Mineralisch und tiefgründig.png" },
  { _id: "fallback-2", title: "Frisch & Lebendig", slug: { current: "frisch-lebendig" }, description: "Frisch & Lebendig", image: undefined, localImage: "/Bilder - Icons rund/frisch & lebendig.png" },
  { _id: "fallback-3", title: "Aromatisch & Charmant", slug: { current: "aromatisch-charmant" }, description: "Aromatisch & Charmant", image: undefined, localImage: "/Bilder - Icons rund/Aromatisch & Charmant.png" },
  { _id: "fallback-4", title: "Vollmundig & Komplex", slug: { current: "vollmundig-komplex" }, description: "Vollmundig & Komplex", image: undefined, localImage: "/Bilder - Icons rund/Vollmundig & Komplex.png" },
]

export default function BrowseByTaste() {
  const categories = fallbackCategories
  const isLoading = false

  // Using hardcoded taste categories instead of fetching from Sanity
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const categoriesData = await client.fetch(wineQueries.categories)
  //       setCategories(categoriesData.length > 0 ? categoriesData : fallbackCategories)
  //     } catch (error) {
  //       console.error("Error fetching categories:", error)
  //       setCategories(fallbackCategories)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchCategories()
  // }, [])

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
      <div className="max-w-6xl mx-auto bg-[rgba(139,115,85,0.1)] rounded-t-[20px] rounded-b-[20px] px-8 py-12">
        {/* Desktop title */}
        <h2 className="text-[32px] md:text-4xl font-bold text-center mb-12 text-black hidden md:block tracking-tight leading-tight">
          Nach Geschmack shoppen
        </h2>

        {/* Mobile title */}
        <h2 className="text-xl font-bold text-center mb-8 text-black md:hidden tracking-tight leading-tight">
          Nach Geschmack shoppen
        </h2>

        {isLoading ? (
          <>
            {/* Desktop loading - Asymmetric layout */}
            <div className="hidden md:block">
              <div className="flex gap-5 mb-5">
                <div className="w-[25%]">
                  <CategorySkeleton />
                </div>
                <div className="w-[25%]">
                  <CategorySkeleton />
                </div>
                <div className="w-[25%]">
                  <CategorySkeleton />
                </div>
                <div className="w-[25%]">
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
              {/* First row: 33% - 67% */}
                <div className="flex gap-5 mb-5">
                  <div className="w-[25%]">
                    <Link
                      key={categories[0]?._id}
                      href={`/shop?tasteCollection=${encodeURIComponent(categories[0]?.title)}`}
                      className="bg-white rounded-2xl p-6 flex flex-col justify-between cursor-pointer h-[200px] relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">
                          {categories[0]?.title}
                        </h3>
                      </div>
                      <div className="relative w-32 h-32 self-end -mr-4 -mb-4 rounded-md overflow-hidden">
                      {categories[0]?.localImage || categories[0]?.image ? (
                          <Image
                            src={
                            categories[0]?.localImage ||
                              urlFor(categories[0].image)?.width(180).height(260).url() ||
                              "/placeholder.svg"
                            }
                            alt={`${categories[0].title} wine category`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-orange-600">
                              {categories[0]?.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="w-[25%]">
                    <Link
                      key={categories[1]?._id}
                      href={`/shop?tasteCollection=${encodeURIComponent(categories[1]?.title)}`}
                      className="bg-white rounded-2xl p-6 flex flex-col justify-between cursor-pointer h-[200px] relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">
                          {categories[1]?.title}
                        </h3>
                      </div>
                      <div className="relative w-32 h-32 self-end -mr-4 -mb-4 rounded-md overflow-hidden">
                      {categories[1]?.localImage || categories[1]?.image ? (
                          <Image
                            src={
                            categories[1]?.localImage ||
                              urlFor(categories[1].image)?.width(180).height(260).url() ||
                              "/placeholder.svg"
                            }
                            alt={`${categories[1].title} wine category`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-orange-600">
                              {categories[1]?.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="w-[25%]">
                    <Link
                      key={categories[2]?._id}
                      href={`/shop?tasteCollection=${encodeURIComponent(categories[2]?.title)}`}
                      className="bg-white rounded-2xl p-6 flex flex-col justify-between cursor-pointer h-[200px] relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">
                          {categories[2]?.title}
                        </h3>
                      </div>
                      <div className="relative w-32 h-32 self-end -mr-4 -mb-4 rounded-md overflow-hidden">
                        {categories[2]?.localImage || categories[2]?.image ? (
                          <Image
                            src={
                              categories[2]?.localImage ||
                              urlFor(categories[2].image)?.width(180).height(260).url() ||
                              "/placeholder.svg"
                            }
                            alt={`${categories[2].title} wine category`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-orange-600">
                              {categories[2]?.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="w-[25%]">
                    <Link
                      key={categories[3]?._id}
                      href={`/shop?tasteCollection=${encodeURIComponent(categories[3]?.title)}`}
                      className="bg-white rounded-2xl p-6 flex flex-col justify-between cursor-pointer h-[200px] relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">
                          {categories[3]?.title}
                        </h3>
                      </div>
                      <div className="relative w-32 h-32 self-end -mr-4 -mb-4 rounded-md overflow-hidden">
                        {categories[3]?.localImage || categories[3]?.image ? (
                          <Image
                            src={
                              categories[3]?.localImage ||
                              urlFor(categories[3].image)?.width(180).height(260).url() ||
                              "/placeholder.svg"
                            }
                            alt={`${categories[3].title} wine category`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
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
                  href={`/shop?tasteCollection=${encodeURIComponent(category.title)}`}
                  className="bg-white rounded-lg p-6 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">
                      {category.title}
                    </h3>
                  </div>
                  <div className="relative w-16 h-24 ml-4 flex-shrink-0">
                    {category.localImage || category.image ? (
                      <Image
                        src={
                          category.localImage ||
                          urlFor(category.image)?.width(64).height(96).url() ||
                          "/placeholder.svg"
                        }
                        alt={`${category.title} wine category`}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
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
