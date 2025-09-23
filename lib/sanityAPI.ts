"use client"

// Client-side utilities for interacting with the Sanity backend API
export class SanityBackendAPI {
  private static baseUrl = '/api/sanity'

  // Product operations
  static async createProduct(productData: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        type: 'product',
        data: productData
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create product')
    }

    return response.json()
  }

  static async updateProduct(productId: string, updates: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        type: 'product',
        id: productId,
        data: updates
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update product')
    }

    return response.json()
  }

  static async deleteProduct(productId: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        type: 'product',
        id: productId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete product')
    }

    return response.json()
  }

  static async updateProductStock(productId: string, stock: number) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateStock',
        type: 'product',
        id: productId,
        data: { stock }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update product stock')
    }

    return response.json()
  }

  // Category operations
  static async createCategory(categoryData: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        type: 'category',
        data: categoryData
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create category')
    }

    return response.json()
  }

  static async updateCategory(categoryId: string, updates: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        type: 'category',
        id: categoryId,
        data: updates
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update category')
    }

    return response.json()
  }

  static async deleteCategory(categoryId: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        type: 'category',
        id: categoryId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete category')
    }

    return response.json()
  }

  // Order operations
  static async createOrder(orderData: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        type: 'order',
        data: orderData
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }

    return response.json()
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateStatus',
        type: 'order',
        id: orderId,
        data: { status }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update order status')
    }

    return response.json()
  }

  // Sync operations
  static async getSyncStatus() {
    const response = await fetch(`${this.baseUrl}?action=sync-status`)

    if (!response.ok) {
      throw new Error('Failed to get sync status')
    }

    return response.json()
  }
}

// React hooks for easy component integration
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export const useProductOperations = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createProduct = useCallback(async (productData: any) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.createProduct(productData)
      toast.success('Product created successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProduct = useCallback(async (productId: string, updates: any) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.updateProduct(productId, updates)
      toast.success('Product updated successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProduct = useCallback(async (productId: string) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.deleteProduct(productId)
      toast.success('Product deleted successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateStock = useCallback(async (productId: string, stock: number) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.updateProductStock(productId, stock)
      toast.success('Stock updated successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update stock')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    isLoading
  }
}

export const useCategoryOperations = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createCategory = useCallback(async (categoryData: any) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.createCategory(categoryData)
      toast.success('Category created successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create category')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCategory = useCallback(async (categoryId: string, updates: any) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.updateCategory(categoryId, updates)
      toast.success('Category updated successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update category')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteCategory = useCallback(async (categoryId: string) => {
    setIsLoading(true)
    try {
      const result = await SanityBackendAPI.deleteCategory(categoryId)
      toast.success('Category deleted successfully!')
      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading
  }
}