"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart, ShoppingCart, ListOrdered, CircleUserRound, Menu, X } from "lucide-react"
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
import SearchDialog from './SearchDialog'
import MobileSearchDialog from './MobileSearchDialog'

// Add type definition for user prop
interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  imageUrl: string
  isSignedIn: boolean
}

export default function Header({ user }: { user: User | null }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItemsCount } = useCartData()
  const wishlistCount = useWishlistCount()
  
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
    <header className="bg-white border-b">
      {/* Top Bar - VIP Program - Desktop only */}
      <div className="hidden md:block">
        <TopNav/>
      </div>
      
      {/* Main Header */}
      <div className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Logo and Search - Logo left, search next to it on desktop */}
            <div className="flex items-center flex-1 min-w-0">
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
              
              {/* Desktop Search - visible on desktop, hidden on mobile */}
              <div className="hidden md:flex ml-6 flex-1 max-w-md">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Finde den Duft, den du liebst..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={() => setIsSearchOpen(true)}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Desktop Icons - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
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
              
              <ClerkLoaded>
                <SignedIn>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm" className="p-2 relative">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="p-2 relative">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
              
              <ClerkLoaded>
                <SignedIn>
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="p-2 relative">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItemsCount()}
                      </span>
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="p-2 relative">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItemsCount()}
                      </span>
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
            </div>

            {/* Mobile Icons - visible on mobile only */}
            <div className="md:hidden flex items-center space-x-2">
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
              
              <ClerkLoaded>
                <SignedIn>
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="p-1 relative">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                        {getTotalItemsCount()}
                      </span>
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="p-1 relative">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                        {getTotalItemsCount()}
                      </span>
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
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
                    <Link href="/vip/benefits" className="w-full">VIP Benefits</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/vip/membership" className="w-full">Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/vip/exclusive" className="w-full">Exclusive Offers</Link>
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
              <Link href="/shop?category=neu" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Neu
              </Link>
              <Link href="/shop" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Alle Produkte
              </Link>
              <Link href="/shop?category=duftkarten" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Duftkarten
              </Link>
              <Link href="/shop?category=duftabsehen" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Duftabsehen
              </Link>
              <Link href="/shop?category=autodufte" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Autodüfte
              </Link>
              <Link href="/shop?category=bestsellers" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Bestseller
              </Link>
              <Link href="/shop?category=adventskalender" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Adventskalender 2025
              </Link>
              <Link href="/shop?category=sommerfavoriten" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                Unsere Sommerfavoriten
              </Link>
              <Link href="/shop?category=club" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2">
                CLUB MOE
              </Link>
              <Link href="/shop?category=outlet" className="block py-2 text-sm hover:bg-gray-100 rounded-md px-2 text-red-600 font-medium">
                Outlet %
              </Link>
            </div>
          </div>
        </div>
      )}
      
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
      <div className="border-t hidden md:block">
        <div className="container mx-auto px-4">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="flex-wrap justify-start gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=neu" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Neu
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Alle Produkte
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=duftkarten" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Duftkarten
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/shop?category=duftabsehen"
                  className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Duftabsehen
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=autodufte" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Autodüfte
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=bestsellers" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Bestseller
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=adventskalender" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Adventskalender 2025
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=sommerfavoriten" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Unsere Sommerfavoriten
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink href="/shop?category=club" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  CLUB MOE
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/shop?category=outlet"
                  className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md text-red-600 font-medium"
                >
                  Outlet %
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}