"use client"

import { useEffect, useState, useCallback } from 'react'
import { syncOperations } from './backendClient'

// Hook for real-time synchronization
export const useSanitySync = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastSync, setLastSync] = useState<string>('Never')
  const [isLoading, setIsLoading] = useState(false)

  // Check sync status
  const checkStatus = useCallback(async () => {
    try {
      const status = await syncOperations.checkSyncStatus()
      setIsConnected(status.isConnected)
      setLastSync(status.lastSync)
    } catch (error) {
      setIsConnected(false)
      console.error('Failed to check sync status:', error)
    }
  }, [])

  // Force sync
  const forceSync = useCallback(async () => {
    setIsLoading(true)
    try {
      await syncOperations.forceSync()
      await checkStatus()
    } catch (error) {
      console.error('Failed to force sync:', error)
    } finally {
      setIsLoading(false)
    }
  }, [checkStatus])

  // Set up real-time listener
  useEffect(() => {
    let subscription: any = null

    const setupListener = async () => {
      try {
        subscription = await syncOperations.listenToChanges((update) => {
          console.log('Real-time update:', update)
          setLastSync(new Date().toISOString())
          
          // Emit custom event for components to listen to
          window.dispatchEvent(new CustomEvent('sanity-data-updated', {
            detail: update
          }))
        })
      } catch (error) {
        console.error('Failed to setup real-time listener:', error)
      }
    }

    setupListener()
    checkStatus()

    // Cleanup
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [checkStatus])

  // Listen for force sync events
  useEffect(() => {
    const handleForceSync = () => {
      forceSync()
    }

    window.addEventListener('sanity-force-sync', handleForceSync)
    
    return () => {
      window.removeEventListener('sanity-force-sync', handleForceSync)
    }
  }, [forceSync])

  return {
    isConnected,
    lastSync,
    isLoading,
    forceSync,
    checkStatus
  }
}

// Hook for listening to specific data changes
export const useSanityDataListener = (dataType: 'product' | 'category' | 'order', callback: (data: any) => void) => {
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