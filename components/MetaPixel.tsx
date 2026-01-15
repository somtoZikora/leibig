'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import ReactPixel from 'react-facebook-pixel'

export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

    if (!pixelId) {
      console.warn('Meta Pixel ID not found in environment variables')
      return
    }

    // Initialize the pixel
    ReactPixel.init(pixelId, undefined, {
      autoConfig: true,
      debug: process.env.NODE_ENV === 'development',
    })

    // Track initial page view
    ReactPixel.pageView()
  }, [])

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      ReactPixel.pageView()
    }
  }, [pathname, searchParams])

  return null
}
