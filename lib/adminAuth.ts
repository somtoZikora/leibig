import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/clerk'

/**
 * Check if a user has admin role
 * @param userId - The Clerk user ID
 * @returns true if user is admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.publicMetadata?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Server-side function to require admin authentication
 * Redirects to home page if user is not authenticated or not an admin
 * @returns userId if user is admin
 */
export async function requireAdmin(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const isAdmin = await isUserAdmin(userId)

  if (!isAdmin) {
    redirect('/')
  }

  return userId
}

/**
 * Check if the current authenticated user is an admin
 * @returns object with userId and isAdmin status
 */
export async function checkAdminStatus(): Promise<{ userId: string | null; isAdmin: boolean }> {
  const { userId } = await auth()

  if (!userId) {
    return { userId: null, isAdmin: false }
  }

  const isAdmin = await isUserAdmin(userId)

  return { userId, isAdmin }
}

/**
 * Get the role of the current authenticated user
 * @returns The user's role or null if not authenticated
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return (user.publicMetadata?.role as UserRole) || 'customer'
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}
