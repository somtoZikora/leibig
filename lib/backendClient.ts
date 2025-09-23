"use client"

import { writeClient } from './sanity'
import { SanityDocument } from '@sanity/client'

// Use the existing write client from sanity.ts
const backendClient = writeClient

// Types for product operations
export interface ProductInput {
  _type: 'product'
  title: string
  slug: {
    _type: 'slug'
    current: string
  }
  description?: string
  price: number
  oldPrice?: number
  discount?: number
  rating?: number
  sizes?: string[]
  status?: 'TOP-VERKÄUFER' | 'STARTERSETS'
  variant?: 'Im Angebot' | 'Neuheiten' | 'Weine'
  category?: {
    _type: 'reference'
    _ref: string
  }
  tags?: string[]
  stock: number
  image?: any
  gallery?: any[]
}

export interface CategoryInput {
  _type: 'category'
  title: string
  slug: {
    _type: 'slug'
    current: string
  }
  description?: string
}

export interface OrderInput {
  _type: 'order'
  orderNumber: string
  user: string
  items: Array<{
    product: {
      _type: 'reference'
      _ref: string
    }
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: string
}

// Product operations
export const productOperations = {
  // Create a new product
  async create(product: ProductInput): Promise<SanityDocument> {
    try {
      const result = await backendClient.create(product)
      console.log('Product created successfully:', result._id)
      return result
    } catch (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  },

  // Update an existing product
  async update(productId: string, updates: Partial<ProductInput>): Promise<SanityDocument> {
    try {
      const result = await backendClient
        .patch(productId)
        .set(updates)
        .commit()
      console.log('Product updated successfully:', result._id)
      return result
    } catch (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }
  },

  // Delete a product
  async delete(productId: string): Promise<void> {
    try {
      await backendClient.delete(productId)
      console.log('Product deleted successfully:', productId)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  },

  // Update product stock
  async updateStock(productId: string, newStock: number): Promise<SanityDocument> {
    try {
      const result = await backendClient
        .patch(productId)
        .set({ stock: newStock })
        .commit()
      console.log('Product stock updated:', result._id, 'New stock:', newStock)
      return result
    } catch (error) {
      console.error('Error updating product stock:', error)
      throw new Error('Failed to update product stock')
    }
  },

  // Bulk update multiple products
  async bulkUpdate(updates: Array<{ id: string; data: Partial<ProductInput> }>): Promise<any> {
    try {
      const transaction = backendClient.transaction()
      
      updates.forEach(({ id, data }) => {
        transaction.patch(id, patch => patch.set(data))
      })
      
      const result = await transaction.commit()
      console.log('Bulk update completed for', updates.length, 'products')
      return result
    } catch (error) {
      console.error('Error in bulk update:', error)
      throw new Error('Failed to bulk update products')
    }
  }
}

// Category operations
export const categoryOperations = {
  // Create a new category
  async create(category: CategoryInput): Promise<SanityDocument> {
    try {
      const result = await backendClient.create(category)
      console.log('Category created successfully:', result._id)
      return result
    } catch (error) {
      console.error('Error creating category:', error)
      throw new Error('Failed to create category')
    }
  },

  // Update an existing category
  async update(categoryId: string, updates: Partial<CategoryInput>): Promise<SanityDocument> {
    try {
      const result = await backendClient
        .patch(categoryId)
        .set(updates)
        .commit()
      console.log('Category updated successfully:', result._id)
      return result
    } catch (error) {
      console.error('Error updating category:', error)
      throw new Error('Failed to update category')
    }
  },

  // Delete a category
  async delete(categoryId: string): Promise<void> {
    try {
      await backendClient.delete(categoryId)
      console.log('Category deleted successfully:', categoryId)
    } catch (error) {
      console.error('Error deleting category:', error)
      throw new Error('Failed to delete category')
    }
  }
}

// Order operations
export const orderOperations = {
  // Create a new order
  async create(order: OrderInput): Promise<SanityDocument> {
    try {
      const result = await backendClient.create(order)
      console.log('Order created successfully:', result._id)
      return result
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Failed to create order')
    }
  },

  // Update order status
  async updateStatus(orderId: string, status: OrderInput['status']): Promise<SanityDocument> {
    try {
      const result = await backendClient
        .patch(orderId)
        .set({ status, updatedAt: new Date().toISOString() })
        .commit()
      console.log('Order status updated:', result._id, 'New status:', status)
      return result
    } catch (error) {
      console.error('Error updating order status:', error)
      throw new Error('Failed to update order status')
    }
  }
}

// Synchronization utilities
export const syncOperations = {
  // Listen to real-time changes from Sanity
  async listenToChanges(callback: (update: any) => void) {
    try {
      const subscription = backendClient
        .listen('*[_type in ["product", "category", "order"]]')
        .subscribe({
          next: (update) => {
            console.log('Real-time update received:', update)
            callback(update)
          },
          error: (error) => {
            console.error('Error in real-time listener:', error)
          }
        })
      
      return subscription
    } catch (error) {
      console.error('Error setting up real-time listener:', error)
      throw new Error('Failed to setup real-time synchronization')
    }
  },

  // Force sync all data
  async forceSync(): Promise<void> {
    try {
      // This could trigger a re-fetch of all data in your components
      console.log('Force sync initiated')
      // You can emit custom events here to trigger re-fetching in components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sanity-force-sync'))
      }
    } catch (error) {
      console.error('Error in force sync:', error)
      throw new Error('Failed to force sync')
    }
  },

  // Check sync status
  async checkSyncStatus(): Promise<{ isConnected: boolean; lastSync: string }> {
    try {
      // Simple ping to check if Sanity is accessible
      await backendClient.fetch('count(*[_type == "product"])')
      return {
        isConnected: true,
        lastSync: new Date().toISOString()
      }
    } catch (error) {
      console.error('Sync status check failed:', error)
      return {
        isConnected: false,
        lastSync: 'Never'
      }
    }
  }
}

// Utility functions for common operations
export const utilities = {
  // Generate unique slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  },

  // Generate unique order number
  generateOrderNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `ORD-${timestamp}-${random}`
  },

  // Validate product data before creation/update
  validateProduct(product: Partial<ProductInput>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!product.title?.trim()) {
      errors.push('Title is required')
    }
    
    if (!product.price || product.price <= 0) {
      errors.push('Valid price is required')
    }
    
    if (!product.stock || product.stock < 0) {
      errors.push('Valid stock quantity is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default backendClient