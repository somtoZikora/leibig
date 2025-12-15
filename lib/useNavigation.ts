"use client"

import { useState, useEffect } from 'react'
import { client } from './sanity'
import { type Category } from './sanity'

export interface NavigationItem {
  _id: string
  title: string
  slug: string
  href: string
  description?: string
  image?: unknown
  productCount?: number
  isActive?: boolean
}

export const useNavigation = () => {
  const [categories, setCategories] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNavigationData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all categories from Sanity
        const categoriesQuery = `*[_type == "category"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          image
        }`

        const categoriesData = await client.fetch(categoriesQuery)

        // Process categories without product counts
        const processedCategories = categoriesData.map((category: Category) => ({
          _id: category._id,
          title: category.title,
          slug: category.slug?.current || '',
          href: `/shop?category=${category.slug?.current || ''}`,
          description: category.description,
          image: category.image
        }))

        // Add special navigation items
        const specialItems: NavigationItem[] = [
          {
            _id: 'all-products',
            title: 'Alle Produkte',
            slug: 'all-products',
            href: '/shop'
          },
          {
            _id: 'topseller',
            title: 'Topseller',
            slug: 'topseller',
            href: '/shop?status=TOP-VERKÄUFER'
          }
        ]

        // Combine all navigation items
        const allNavigationItems = [
          ...specialItems,
          ...processedCategories
        ]

        setCategories(allNavigationItems)
      } catch (err) {
        console.error('Error fetching navigation data:', err)
        setError('Failed to load navigation data')
        
        // Fallback to static navigation
        setCategories([
          {
            _id: 'all-products',
            title: 'Alle Produkte',
            slug: 'all-products',
            href: '/shop'
          },
          {
            _id: 'topseller',
            title: 'Topseller',
            slug: 'topseller',
            href: '/shop?status=TOP-VERKÄUFER'
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchNavigationData()
  }, [])

  return {
    categories,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      // Re-trigger the effect by updating a dependency
      fetchNavigationData()
    }
  }
}
