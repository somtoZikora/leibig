"use client"

import { useEffect, useState, useCallback } from 'react'
// import { syncOperations } from './backendClient'

export interface SyncResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export interface SyncOptions {
  products?: boolean
  categories?: boolean
  limit?: number
}

export function useSanitySync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  const syncToSanity = useCallback(async (data: Record<string, unknown>, options: SyncOptions = {}) => {
    setIsSyncing(true)
    try {
      // Mock implementation - replace with actual sync logic
      const result = { success: true, data }
      setSyncResult(result)
    } catch (error) {
      setSyncResult({ success: false, error: String(error) })
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const syncProducts = useCallback(async (products: unknown[]) => {
    setIsSyncing(true)
    try {
      // Mock implementation - replace with actual sync logic
      const result = { success: true, data: { count: products.length } }
      setSyncResult(result)
    } catch (error) {
      setSyncResult({ success: false, error: String(error) })
    } finally {
      setIsSyncing(false)
    }
  }, [])

  return {
    isSyncing,
    syncResult,
    syncToSanity,
    syncProducts,
  }
}

// Hook for listening to specific data changes
export const useSanityDataListener = (dataType: 'product' | 'category' | 'order', callback: (data: unknown) => void) => {
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const update = event.detail
      
      // Check if the update is for the data type we're interested in
      if (update.documentId && update.result?._type === dataType) {
        callback(update)
      }
    }

    window.addEventListener('sanity-data-updated', handleDataUpdate as EventListener)
    
    return () => {
      window.removeEventListener('sanity-data-updated', handleDataUpdate as EventListener)
    }
  }, [dataType, callback])
}