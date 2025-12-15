import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { type SanityImage } from '@/lib/sanity'

// Cart item interface extending the product
export interface CartItem {
  id: string
  title: string
  slug: { current: string }
  image?: SanityImage
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  status?: "TOP-VERKÄUFER" | "STARTERSETS"
  variant?: "Im Angebot" | "Neuheiten" | "Weine"
  stock: number
  sizes?: string[]
  quantity: number
  selectedSize?: string
  addedAt: Date
}

// Wishlist item interface
export interface WishlistItem {
  id: string
  title: string
  slug: { current: string }
  image?: SanityImage
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  status?: "TOP-VERKÄUFER" | "STARTERSETS"
  variant?: "Im Angebot" | "Neuheiten" | "Weine"
  stock: number
  sizes?: string[]
  addedAt: Date
}

// Product interface for adding to cart (simplified from WineProduct)
export interface Product {
  _id: string
  title: string
  slug: { current: string }
  image?: SanityImage
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  status?: "TOP-VERKÄUFER" | "STARTERSETS"
  variant?: "Im Angebot" | "Neuheiten" | "Weine"
  stock: number
  sizes?: string[]
}

// Cart store interface
interface CartStore {
  items: CartItem[]
  wishlist: WishlistItem[]

  // Core cart actions
  addItem: (product: Product | CartItem, size?: string) => void
  removeItem: (productId: string) => void
  removeFromCart: (productId: string) => void
  resetCart: () => void

  // Wishlist actions
  addToWishlist: (product: Product | WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  getWishlistCount: () => number
  isInWishlist: (productId: string) => boolean

  // Utility functions
  getTotalPrice: () => number
  getSubtotalPrice: () => number
  getItemCount: (productId: string) => number
  getGroupedItems: () => CartItem[]
  getTotalItemsCount: () => number
  getCartItemById: (productId: string) => CartItem | undefined
  getTaxAmount: (taxRate?: number) => number
  getShippingCost: (freeShippingThreshold?: number, shippingCost?: number) => number
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      // Add item to cart
      addItem: (product: Product | CartItem, size?: string) => {
        const productId = '_id' in product ? product._id : product.id
        const existingItemIndex = get().items.findIndex(
          item => item.id === productId && item.selectedSize === size
        )

        if (existingItemIndex > -1) {
          // Update quantity if item already exists with same size
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }))
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: productId,
            title: product.title,
            slug: product.slug,
            image: product.image,
            price: product.price,
            oldPrice: product.oldPrice,
            discount: product.discount,
            rating: product.rating,
            status: product.status,
            variant: product.variant,
            stock: product.stock,
            sizes: product.sizes,
            quantity: 1,
            selectedSize: size,
            addedAt: new Date()
          }

          set(state => ({
            items: [...state.items, newItem]
          }))
        }
      },

      // Remove one quantity of item from cart
      removeItem: (productId: string) => {
        set(state => ({
          items: state.items.reduce((acc, item) => {
            if (item.id === productId) {
              if (item.quantity > 1) {
                // Decrease quantity
                acc.push({ ...item, quantity: item.quantity - 1 })
              }
              // If quantity is 1, item will be removed (not added to acc)
            } else {
              acc.push(item)
            }
            return acc
          }, [] as CartItem[])
        }))
      },

      // Completely remove product from cart (all quantities)
      removeFromCart: (productId: string) => {
        // Remove implementation without using state parameter
        set((current) => ({
          items: current.items.filter(item => item.id !== productId)
        }))
      },

      // Clear entire cart
      resetCart: () => {
        set({ items: [] })
      },

      // Get total price including discounts
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.oldPrice && item.oldPrice > item.price ? item.price : item.price
          return total + (price * item.quantity)
        }, 0)
      },

      // Get subtotal price (before any additional fees)
      getSubtotalPrice: () => {
        return get().getTotalPrice()
      },

      // Get quantity count for specific product
      getItemCount: (productId: string) => {
        const item = get().items.find(item => item.id === productId)
        return item ? item.quantity : 0
      },

      // Get grouped items (combining same products with different sizes)
      getGroupedItems: () => {
        const items = get().items
        const grouped: { [key: string]: CartItem } = {}

        items.forEach(item => {
          const key = item.id
          if (grouped[key]) {
            grouped[key].quantity += item.quantity
          } else {
            grouped[key] = { ...item }
          }
        })

        return Object.values(grouped)
      },

      // Get total number of items in cart
      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      // Get specific cart item by product ID
      getCartItemById: (productId: string) => {
        return get().items.find(item => item.id === productId)
      },

      // Calculate tax amount (extract VAT from gross price)
      // German law requires prices to include VAT (MwSt.)
      // Formula: Tax = Gross × (rate / (1 + rate))
      // For 19%: Tax = Gross × 0.1596638655
      getTaxAmount: (taxRate: number = 0.19) => {
        const subtotal = get().getSubtotalPrice()
        // Extract tax from gross price instead of adding it
        return subtotal * (taxRate / (1 + taxRate))
      },

      // Calculate shipping cost
      getShippingCost: (freeShippingThreshold: number = 50, shippingCost: number = 5.99) => {
        const subtotal = get().getSubtotalPrice()
        return subtotal >= freeShippingThreshold ? 0 : shippingCost
      },

      // Check if product is in cart
      isInCart: (productId: string) => {
        return get().items.some(item => item.id === productId)
      },

      // Add product to wishlist
      addToWishlist: (product: Product | WishlistItem) => {
        const productId = '_id' in product ? product._id : product.id
        const existingItem = get().wishlist.find(item => item.id === productId)

        if (!existingItem) {
          const newWishlistItem: WishlistItem = {
            id: productId,
            title: product.title,
            slug: product.slug,
            image: product.image,
            price: product.price,
            oldPrice: product.oldPrice,
            discount: product.discount,
            rating: product.rating,
            status: product.status,
            variant: product.variant,
            stock: product.stock,
            sizes: product.sizes,
            addedAt: new Date()
          }

          set(state => ({
            wishlist: [...state.wishlist, newWishlistItem]
          }))
        }
      },

      // Remove product from wishlist
      removeFromWishlist: (productId: string) => {
        set(state => ({
          wishlist: state.wishlist.filter(item => item.id !== productId)
        }))
      },

      // Clear entire wishlist
      clearWishlist: () => {
        set({ wishlist: [] })
      },

      // Get wishlist count
      getWishlistCount: () => {
        return get().wishlist.length
      },

      // Check if product is in wishlist
      isInWishlist: (productId: string) => {
        return get().wishlist.some(item => item.id === productId)
      }
    }),
    {
      name: 'wineshop-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist })
    }
  )
)

// Hook for cart actions (useful for components that only need actions)
export const useCartActions = () => {
  const {
    addItem,
    removeItem,
    removeFromCart,
    resetCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  } = useCartStore()

  return {
    addItem,
    removeItem,
    removeFromCart,
    resetCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  }
}

// Hook for cart data (useful for components that only need data)
export const useCartData = () => {
  const {
    items,
    wishlist,
    getTotalPrice,
    getSubtotalPrice,
    getItemCount,
    getGroupedItems,
    getTotalItemsCount,
    getCartItemById,
    getTaxAmount,
    getShippingCost,
    isInCart,
    getWishlistCount,
    isInWishlist
  } = useCartStore()

  return {
    items,
    wishlist,
    getTotalPrice,
    getSubtotalPrice,
    getItemCount,
    getGroupedItems,
    getTotalItemsCount,
    getCartItemById,
    getTaxAmount,
    getShippingCost,
    isInCart,
    getWishlistCount,
    isInWishlist
  }
}

// Selector hooks for better performance (only re-render when specific data changes)
export const useCartItemsCount = () => useCartStore(state => state.getTotalItemsCount())
export const useCartTotal = () => useCartStore(state => state.getTotalPrice())
export const useCartItems = () => useCartStore(state => state.items)
export const useIsProductInCart = (productId: string) =>
  useCartStore(state => state.isInCart(productId))
export const useProductQuantity = (productId: string) =>
  useCartStore(state => state.getItemCount(productId))

// Wishlist selector hooks
export const useWishlistCount = () => useCartStore(state => state.getWishlistCount())
export const useWishlistItems = () => useCartStore(state => state.wishlist)
export const useIsProductInWishlist = (productId: string) =>
  useCartStore(state => state.isInWishlist(productId))
