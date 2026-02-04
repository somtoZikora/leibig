'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

    if (!pixelId) {
      console.warn('Meta Pixel ID not found in environment variables')
      return
    }

    // Dynamic import to avoid SSR issues
    import('react-facebook-pixel')
      .then((module) => {
        const ReactPixel = module.default

        // Initialize the pixel
        ReactPixel.init(pixelId, undefined, {
          autoConfig: true,
          debug: process.env.NODE_ENV === 'development',
        })

        // Track initial page view
        ReactPixel.pageView()
        setIsInitialized(true)
      })
      .catch((error) => {
        console.error('Failed to load Meta Pixel:', error)
      })
  }, [])

  useEffect(() => {
    // Only track page views after initialization
    if (!isInitialized || typeof window === 'undefined') return

    // Track page view on route change
    if (pathname) {
      import('react-facebook-pixel')
        .then((module) => {
          const ReactPixel = module.default
          ReactPixel.pageView()
        })
        .catch((error) => {
          console.error('Failed to track page view:', error)
        })
    }
  }, [pathname, searchParams, isInitialized])

  return null
}
