/* eslint-disable */
"use client"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart, ShoppingCart, ShoppingBag, CircleUserRound, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TopNav from "./TopNav"
import { ClerkLoaded, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import { useCartData, useWishlistCount } from '@/lib/store'
import { useNavigation } from '@/lib/useNavigation'
import SearchDialog from './SearchDialog'
import MobileSearchDialog from './MobileSearchDialog'
import { motion, AnimatePresence } from 'framer-motion'
import { headerVariants, mobileMenuVariants, buttonAnimationProps, transitions } from '@/lib/animations'

// Add type definition for user prop
interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  imageUrl: string
  isSignedIn: boolean
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItemsCount } = useCartData()
  const wishlistCount = useWishlistCount()
  const { categories, isLoading: navigationLoading } = useNavigation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Function to check if a category is active
  const isCategoryActive = (category: string) => {
    if (pathname === '/shop') {
      const categoryParam = searchParams.get('category')
      const statusParam = searchParams.get('status')
      
      // Check for special cases
      if (category === 'all-products' && !categoryParam && !statusParam) {
        return true
      }
      if (category === 'topseller' && statusParam === 'TOP-VERKÄUFER') {
        return true
      }
      // Check regular categories
      if (category && categoryParam === category) {
        return true
      }
    }
    return false
  }
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with CMD+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.header 
      className="bg-white border-b top-0 z-50 w-full left-0 right-0"
      style={{ 
        width: '100%'
      }}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      transition={transitions.smooth}
    >
      {/* Top Bar - VIP Program - Desktop only */}
      <motion.div 
        className="hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...transitions.smooth }}
      >
        <TopNav/>
      </motion.div>
      
      {/* Main Header */}
      <motion.div 
        className="py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...transitions.smooth }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.div {...buttonAnimationProps}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={transitions.quick}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={transitions.quick}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            {/* Logo and Search - Logo left, search next to it on desktop */}
            <motion.div 
              className="flex items-center flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ...transitions.smooth }}
            >
              <motion.div {...buttonAnimationProps}>
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/Kirsten-Liebieg_Logo.png"
                    alt="Kirsten Liebieg Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto md:h-10"
                    priority
                  />
                </Link>
              </motion.div>
              
              {/* Desktop Search - visible on desktop, hidden on mobile */}
              <div className="hidden md:flex ml-6 flex-1 max-w-md">
                <div className="relative w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 z-10" />
                    <Input
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={() => setIsSearchOpen(true)}
                      className="pl-10 pr-4 bg-gray-100 border-0 rounded-full text-gray-600 placeholder:text-gray-600 focus:bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Desktop Icons - hidden on mobile */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, ...transitions.smooth }}
            >
              <ClerkLoaded>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                      <CircleUserRound className="h-5 w-5" />
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
              
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItemsCount()}
                  </span>
                </Button>
              </Link>
                </motion.div>

            {/* Mobile Icons - visible on mobile only */}
            <motion.div 
              className="md:hidden flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, ...transitions.smooth }}
            >
              {/* Mobile Search Icon */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <ClerkLoaded>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="p-1">
                      <CircleUserRound className="h-4 w-4" />
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
              
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="p-1 relative">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center text-[10px]">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="p-1 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {getTotalItemsCount()}
                  </span>
                </Button>
              </Link>
                </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-200"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.smooth}
          >
          <div className="container mx-auto px-4 py-4">
            {/* VIP Program for Mobile */}
            <div className="mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    VIP PROGRAMM
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link href="/vip/benefits" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>VIP Benefits</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/vip/membership" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/vip/exclusive" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Exclusive Offers</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Search */}
            <div className="mb-4">
              <MobileSearchDialog />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navigationLoading ? (
                // Loading skeleton for mobile
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="py-2 px-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <Link 
                    key={category._id}
                    href={category.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-sm hover:bg-[rgba(139,115,85,0.1)] rounded-md px-2 ${
                      category.title === 'Outlet %' ? 'text-red-600 font-medium' : ''
                    }`}
                  >
                  {category.title}
                  </Link>
                ))
              )}
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Search - visible on mobile only (when menu is closed) */}
      {/* <div className="md:hidden px-4 pb-4">
        {!isMobileMenuOpen && <MobileSearchDialog />}
      </div> */}
      
      {/* Hidden SearchDialog component for keyboard shortcuts */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => {
          setIsSearchOpen(false)
          setSearchQuery("")
        }} 
      />

      {/* Desktop Navigation Menu */}
      <motion.div 
        className="border-t hidden md:block bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ...transitions.smooth }}
      >
        <div className="container mx-auto px-4">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="flex-wrap justify-center gap-1">
              {navigationLoading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <NavigationMenuItem key={index}>
                    <div className="px-4 py-2 text-sm">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </NavigationMenuItem>
                ))
              ) : (
                categories.map((category) => (
                  <NavigationMenuItem key={category._id}>
                    <NavigationMenuLink
                      href={category.href}
                      className={`px-4 py-2 text-sm rounded-md hover:bg-transparent focus:bg-transparent ${
                        isCategoryActive(category.slug) ? 'font-bold' : ''
                      } ${
                        category.title === 'Outlet %' ? 'text-red-600 font-medium' : ''
                      }`}
                    >
                  {category.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </motion.div>
    </motion.header>
  )
}