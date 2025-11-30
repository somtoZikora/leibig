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

// Custom metadata structure for Clerk users
export interface CustomPublicMetadata {
  defaultBillingAddress?: AddressData
  defaultShippingAddress?: AddressData
}

// Extend the Clerk module declarations
declare global {
  interface UserPublicMetadata extends CustomPublicMetadata {}
}
