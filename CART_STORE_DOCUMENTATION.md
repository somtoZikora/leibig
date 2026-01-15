# 🛒 Wineshop Cart Store Documentation

This documentation explains how to use the Zustand-based cart store in your Wineshop application.

## 📦 Installation

The required dependencies have been installed:
- `zustand` - State management
- `sonner` - Toast notifications

## 🏗️ Store Structure

The cart store (`lib/store.ts`) provides:

### Types
- `CartItem` - Individual cart item with quantity and metadata
- `Product` - Product interface for adding items to cart

### State
- `items: CartItem[]` - Array of cart items

### Actions
- `addItem(product, size?)` - Add product to cart
- `removeItem(productId)` - Remove one quantity of item
- `deleteCartProduct(productId)` - Remove product completely
- `resetCart()` - Clear entire cart
- `updateItemQuantity(productId, quantity)` - Set specific quantity

### Getters
- `getTotalPrice()` - Total cart value
- `getSubtotalPrice()` - Subtotal (same as total in current implementation)
- `getItemCount(productId)` - Get quantity of specific product
- `getGroupedItems()` - Get items grouped by product ID
- `getTotalItemsCount()` - Total number of items
- `getCartItemById(productId)` - Get specific cart item
- `getTaxAmount(taxRate?)` - Calculate tax (default 19%)
- `getShippingCost(threshold?, cost?)` - Calculate shipping cost
- `isInCart(productId)` - Check if product is in cart

## 🔧 Usage Examples

### 1. Basic Usage in Components

```tsx
import { useCartStore, useCartActions, useCartData } from '@/lib/store'

// Full store access
function MyComponent() {
  const { items, addItem, getTotalPrice } = useCartStore()
  // Use store...
}

// Actions only (for adding/removing items)
function ProductCard() {
  const { addItem, removeItem } = useCartActions()
  
  const handleAddToCart = () => {
    addItem(product, selectedSize)
  }
}

// Data only (for displaying cart info)
function CartSummary() {
  const { items, getTotalPrice, getTotalItemsCount } = useCartData()
  // Display cart info...
}
```

### 2. Optimized Selector Hooks

```tsx
// These hooks only re-render when specific data changes
import { 
  useCartItemsCount, 
  useCartTotal, 
  useCartItems,
  useIsProductInCart,
  useProductQuantity 
} from '@/lib/store'

function Header() {
  const itemsCount = useCartItemsCount() // Only re-renders when count changes
  const total = useCartTotal() // Only re-renders when total changes
}

function ProductButton({ productId }) {
  const isInCart = useIsProductInCart(productId)
  const quantity = useProductQuantity(productId)
}
```

### 3. Adding Products to Cart

```tsx
import { useCartActions } from '@/lib/store'

function AddToCartButton({ product, selectedSize }) {
  const { addItem } = useCartActions()
  
  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      title: product.title,
      slug: product.slug,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      status: product.status,
      stock: product.stock,
      sizes: product.sizes
    }, selectedSize)
  }

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  )
}
```

### 4. Cart Display Component

```tsx
import { useCartData, useCartActions } from '@/lib/store'

function CartPage() {
  const { 
    items, 
    getTotalPrice, 
    getTotalItemsCount,
    getTaxAmount,
    getShippingCost 
  } = useCartData()
  
  const { 
    updateItemQuantity, 
    deleteCartProduct, 
    resetCart 
  } = useCartActions()

  const subtotal = getTotalPrice()
  const tax = getTaxAmount(0.19) // 19% VAT
  const shipping = getShippingCost(70, 7.90) // Free over €70
  const total = subtotal + tax + shipping

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: €{item.price}</p>
          <button 
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
          <button 
            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          <button 
            onClick={() => deleteCartProduct(item.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <div>
        <p>Subtotal: €{subtotal}</p>
        <p>Tax: €{tax}</p>
        <p>Shipping: €{shipping}</p>
        <p>Total: €{total}</p>
      </div>
    </div>
  )
}
```

## 🔄 Persistence

The cart store automatically persists to localStorage with the key `'wineshop-cart-storage'`. This means:
- Cart items survive browser refreshes
- Cart persists between sessions
- Only the `items` array is persisted (functions are rebuilt on load)

## 🎯 Key Features

### 1. **Size Support**
Products can have different sizes, and each size is treated as a separate cart item:
```tsx
addItem(product, 'Large') // Adds with size 'Large'
addItem(product, 'Small') // Adds as separate item with size 'Small'
```

### 2. **Stock Management**
The store respects product stock limits:
```tsx
updateItemQuantity(productId, quantity) // Won't exceed item.stock
```

### 3. **Automatic Grouping**
`getGroupedItems()` combines same products with different sizes for display purposes.

### 4. **Smart Calculations**
- Tax calculation with configurable rate
- Shipping cost with free shipping threshold
- Discount price handling (uses discounted price if available)

## 🚀 Integration Points

### 1. **Header Component**
Shows cart count with animated badge:
```tsx
const cartItemsCount = useCartItemsCount()
// Display count in header
```

### 2. **Product Cards**
Enhanced AddToCartButton with:
- Loading states
- Success feedback
- Stock validation
- Quantity display

### 3. **Cart Page**
Full cart management with:
- Item quantity controls
- Price calculations
- Tax and shipping
- Remove items
- Clear cart

### 4. **Toast Notifications**
Integrated with Sonner for user feedback:
- Item added to cart
- Item removed from cart
- Error messages

## 📱 Mobile Responsive

All cart components are fully responsive and work seamlessly on mobile devices.

## 🎨 Styling

Components follow the app's design system:
- Orange theme colors (`bg-orange-600`)
- Consistent spacing and typography
- Smooth animations and transitions
- Accessible design patterns

## 🔍 Debugging

To debug the cart store, you can access it from browser console:
```javascript
// View current store state
window.__ZUSTAND_STORE__ = useCartStore.getState()
console.log(window.__ZUSTAND_STORE__)
```

## 🚀 Next Steps

1. **Checkout Integration**: Connect cart to payment processing
2. **User Accounts**: Sync cart with user profiles
3. **Analytics**: Track cart events for business insights
4. **Recommendations**: Suggest related products based on cart items

The cart store is designed to be extensible and maintainable, following Zustand best practices and TypeScript for type safety.