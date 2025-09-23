"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface WithAuthProps {
  redirectUrl?: string
}

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P & WithAuthProps) {
    const { isSignedIn, isLoaded } = useUser()
    const [isLoading] = useState(false)
    const router = useRouter()

    // Show loading state while Clerk is loading
    if (!isLoaded) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      )
    }

    // Show unauthorized component if user is not signed in
    if (!isSignedIn) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          </div>
        </div>
      )
    }

    // User is authenticated, render the wrapped component
    return <WrappedComponent {...props} />
  }
}
