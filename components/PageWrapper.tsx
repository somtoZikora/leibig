'use client'

import { usePathname } from 'next/navigation'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Determine padding based on route
  const isHomePage = pathname === '/'
  const isAboutPage = pathname === '/ueber-uns'

  const paddingClass = isHomePage
    ? 'pt-16 md:pt-32 lg:pt-40'
    : isAboutPage
    ? 'pt-24 md:pt-32 lg:pt-40'
    : '' // No padding for all other pages

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${paddingClass}`}>
      {children}
    </div>
  )
}
