"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { client } from "@/lib/sanity"

export interface NavigationItem {
  title: string
  href: string
  isVariant?: boolean
  variant?: string
}

// Hook to get navigation items (can be used by other components)
export const useNavigationItems = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        // Check if we have products for each variant
        const variantsQuery = `{
          "imAngebot": count(*[_type == "product" && variant == "Im Angebot"]),
          "neuheiten": count(*[_type == "product" && variant == "Neuheiten"]),
          "weine": count(*[_type == "product" && variant == "Weine"])
        }`
        
        const variantCounts = await client.fetch(variantsQuery)
        
        // Build navigation items based on available products
        const items: NavigationItem[] = [
          { title: "Shop", href: "/shop" }
        ]
        
        if (variantCounts.imAngebot > 0) {
          items.push({
            title: "Im Angebot",
            href: "/shop?variant=Im%20Angebot",
            isVariant: true,
            variant: "Im Angebot"
          })
        }
        
        if (variantCounts.neuheiten > 0) {
          items.push({
            title: "Neuheiten",
            href: "/shop?variant=Neuheiten",
            isVariant: true,
            variant: "Neuheiten"
          })
        }
        
        if (variantCounts.weine > 0) {
          items.push({
            title: "Weine",
            href: "/shop?variant=Weine",
            isVariant: true,
            variant: "Weine"
          })
        }
        
        setNavigationItems(items)
      } catch (error) {
        console.error('Error fetching navigation data:', error)
        // Fallback to static navigation
        setNavigationItems([
          { title: "Shop", href: "/shop" },
          { title: "Im Angebot", href: "/shop?variant=Im%20Angebot", isVariant: true, variant: "Im Angebot" },
          { title: "Neuheiten", href: "/shop?variant=Neuheiten", isVariant: true, variant: "Neuheiten" },
          { title: "Weine", href: "/shop?variant=Weine", isVariant: true, variant: "Weine" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNavigationData()
  }, [])

  return { navigationItems, isLoading }
}

const HeaderMenu = () => {
  const { navigationItems, isLoading } = useNavigationItems()
  if (isLoading) {
    return (
      <nav className="hidden md:flex items-center space-x-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-14"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-10"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="text-sm font-medium text-black hover:text-gray-600 transition-colors flex items-center"
        >
          {item.title}
          {item.title === "Shop" && <ChevronDown className="ml-1 h-4 w-4" />}
        </Link>
      ))}
    </nav>
  )
}
export default HeaderMenu