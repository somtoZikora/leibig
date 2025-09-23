"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, ComponentType } from 'react'
import NoAccessToCart from './NoAccessToCart'

interface WithAuthOptions {
  redirectUrl?: string
  loadingComponent?: ComponentType
  unauthorizedComponent?: ComponentType<{ redirectUrl: string }>
}

/**
 * Higher-order component that protects pages requiring authentication
 * 
 * @param WrappedComponent - The component to protect
 * @param options - Configuration options
 * @returns Protected component
 */
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectUrl = '/',
    loadingComponent: LoadingComponent,
    unauthorizedComponent: UnauthorizedComponent = NoAccessToCart
  } = options

  const AuthenticatedComponent = (props: P) => {
    const { isSignedIn, isLoaded } = useUser()
    const router = useRouter()

    // Show loading state while Clerk is loading
    if (!isLoaded) {
      if (LoadingComponent) {
        return <LoadingComponent />
      }
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      )
    }

    // Show unauthorized component if user is not signed in
    if (!isSignedIn) {
      return <UnauthorizedComponent redirectUrl={redirectUrl} />
    }

    // User is authenticated, render the wrapped component
    return <WrappedComponent {...props} />
  }

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

  return AuthenticatedComponent
}

export default withAuth

// Convenience HOCs for common use cases
export const withCartAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    redirectUrl: '/cart',
    unauthorizedComponent: NoAccessToCart 
  })

export const withOrdersAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    redirectUrl: '/orders',
    unauthorizedComponent: NoAccessToCart 
  })

export const withProfileAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    redirectUrl: '/profile',
    unauthorizedComponent: NoAccessToCart 
  })