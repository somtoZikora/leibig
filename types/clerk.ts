// Extend Clerk's User type to include custom metadata
export interface AddressData {
  company?: string
  firstName: string
  lastName: string
  street: string
  houseNumber: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

// User role types
export type UserRole = 'customer' | 'admin'

// Custom metadata structure for Clerk users
export interface CustomPublicMetadata {
  role?: UserRole
  defaultBillingAddress?: AddressData
  defaultShippingAddress?: AddressData
}

// Extend the Clerk module declarations
declare global {
  interface UserPublicMetadata extends CustomPublicMetadata {}
}
