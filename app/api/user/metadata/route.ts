import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await req.json()
    const { defaultBillingAddress, defaultShippingAddress } = body

    // Validate that at least one address is provided
    if (!defaultBillingAddress && !defaultShippingAddress) {
      return NextResponse.json(
        { error: 'At least one address must be provided' },
        { status: 400 }
      )
    }

    // Get Clerk client and update user metadata
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        defaultBillingAddress: defaultBillingAddress || undefined,
        defaultShippingAddress: defaultShippingAddress || undefined,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Addresses saved successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user metadata:', error)
    return NextResponse.json(
      { error: 'Failed to save addresses' },
      { status: 500 }
    )
  }
}
