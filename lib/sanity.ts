// import { createClient } from "@sanity/client"
import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// Read client (with CDN for faster reads)
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
})

// Write client (without CDN for write operations)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false, // Disable CDN for write operations
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Write token
})

// Debug function to test Sanity write permissions
export const testSanityConnection = async () => {
  try {
    console.log('Testing Sanity connection...')
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
    console.log('Token available:', !!process.env.SANITY_API_TOKEN)
    console.log('Token preview:', process.env.SANITY_API_TOKEN?.substring(0, 10) + '...')
    
    // First test: Try to create a simple test document
    const testDoc = {
      _type: 'product', // Use existing schema type
      title: 'TEST-ORDER-' + Date.now(),
      price: 1,
      rating: 5,
      stock: 1,
      status: 'TOP-VERKÄUFER' as const
    }
    
    console.log('📋 Attempting to create test document...')
    const result = await writeClient.create(testDoc)
    console.log('✅ Test document created:', result._id)
    
    // Clean up test document
    await writeClient.delete(result._id)
    console.log('✅ Test document cleaned up')
    
    return { 
      success: true, 
      message: 'Sanity connection working - can create and delete documents',
      tokenWorks: true,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    }
  } catch (error: unknown) {
    console.error('❌ Sanity connection test failed:', error)
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: error instanceof Error && 'statusCode' in error ? (error as { statusCode: number }).statusCode : undefined,
      type: error instanceof Error && 'type' in error ? (error as { type: string }).type : undefined,
      description: error instanceof Error && 'description' in error ? (error as { description: string }).description : undefined
    }
    
    // Check for specific permission errors
    if (error instanceof Error && error.message?.includes('Insufficient permissions')) {
      errorDetails.description = 'API token does not have write permissions. Create a new token with Editor or Admin permissions.'
    } else if (error instanceof Error && error.message?.includes('Invalid token')) {
      errorDetails.description = 'API token is invalid or expired. Create a new token.'
    } else if (error instanceof Error && error.message?.includes('Unauthorized')) {
      errorDetails.description = 'Token authentication failed. Check if token is correct.'
    }
    
    return { 
      success: false, 
      error: errorDetails,
      tokenAvailable: !!process.env.SANITY_API_TOKEN,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    }
  }
}

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage | null | undefined) {
  if (!source) {
    return null
  }
  return builder.image(source).quality(100)
}

// Image type definition
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Portable Text type definition for rich text content
export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    [key: string]: any
  }>
  listItem?: 'bullet' | 'number'
  level?: number
}

// Wine product type definitions
export interface WineProduct {
  _id: string
  title: string
  slug: { current: string }
  image: SanityImage
  gallery?: SanityImage[]
  description?: PortableTextBlock[] // Rich text field
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  sizes?: string[]
  status: "TOP-VERKÄUFER" | "STARTERSETS"
  variant: "Im Angebot" | "Neuheiten" | "Weine"
  category?: {
    _id: string
    title: string
    slug: { current: string }
  }
  tags?: string[]
  stock: number
  jahrgang?: string // Vintage year e.g. "2020", "2021", "2022"
  geschmack?: "Trocken" | "Halbtrocken" | "Feinherb" | "Frucht und Edelsüß" // Taste profile
  rebsorte?: string // Grape variety e.g. "Riesling", "Spätburgunder"
  // Additional fields from Winestro
  artikelnummer?: string // Article number
  qualitaet?: string // Quality level (e.g. Gutswein, Kabinett)
  alkohol?: number // Alcohol percentage
  liter?: number // Bottle size in liters
  zucker?: number // Sugar content
  saeure?: number // Acid content
  brennwert?: number // Energy/calories per 100ml
  kohlenhydrate?: number // Carbohydrates per 100ml
  eiweiss?: number // Protein per 100ml
  fett?: number // Fat per 100ml
  salz?: number // Salt per 100ml
  erzeuger?: string // Producer information
}

// Category type definition
export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  image?: SanityImage
  localImage?: string
}

// Order types
export interface OrderItem {
  product: {
    _ref: string
    _type: 'reference'
  }
  productSnapshot: {
    title: string
    price: number
    image?: SanityImage
  }
  quantity: number
  selectedSize?: string
  unitPrice: number
  totalPrice: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
}

export interface PaymentDetails {
  paypalOrderId?: string
  paypalPaymentId?: string
  paypalPayerId?: string
  transactionFee?: number
}

export interface Order {
  _id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  userId?: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  items: OrderItem[]
  subtotal: number
  tax: number
  taxRate: number
  shipping: number
  total: number
  currency: string
  shippingAddress: ShippingAddress
  billingAddress: BillingAddress
  paymentMethod: 'paypal' | 'credit_card' | 'bank_transfer'
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'partially_refunded'
  paymentId?: string
  paymentDetails?: PaymentDetails
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt?: string
}

// Sanity queries
export const wineQueries = {
  starterSets: `*[_type == "product" && status == "STARTERSETS"] | order(title asc) {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category,
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  topSellers: `*[_type == "product" && status == "TOP-VERKÄUFER"]
| order(title asc) [$offset...($offset + $limit)] {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category,
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  singleProduct: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category->{
      _id,
      title,
      slug
    },
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  categories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    image
  }`,

  productsByCategory: `*[_type == "product" && category._ref == $categoryId] | order(title asc) {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category,
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  productsByCategorySlug: `*[_type == "product" && category->slug.current == $categorySlug] | order(title asc) {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category,
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  productsByVariant: `*[_type == "product" && variant == $variant] | order(title asc) {
    _id,
    title,
    slug,
    image,
    gallery,
    description,
    price,
    oldPrice,
    discount,
    rating,
    sizes,
    status,
    variant,
    category,
    tags,
    stock,
    jahrgang,
    geschmack,
    rebsorte
  }`,

  searchProducts: `*[_type == "product" && title match $searchTerm + "*"] | order(title asc) [0...8] {
    _id,
    title,
    slug,
    image,
    price,
    oldPrice,
    discount,
    rating,
    status,
    variant
  }`,

  // Order queries
  createOrder: `*[_type == "order" && _id == $orderId][0] {
    _id,
    orderNumber,
    customerEmail,
    customerName,
    userId,
    status,
    items[] {
      product-> {
        _id,
        title,
        slug,
        image,
        price
      },
      productSnapshot,
      quantity,
      selectedSize,
      unitPrice,
      totalPrice
    },
    subtotal,
    tax,
    taxRate,
    shipping,
    total,
    currency,
    shippingAddress,
    billingAddress,
    paymentMethod,
    paymentStatus,
    paymentId,
    paymentDetails,
    notes,
    trackingNumber,
    estimatedDelivery,
    actualDelivery,
    createdAt,
    updatedAt
  }`,

  ordersByUser: `*[_type == "order" && userId == $userId] | order(createdAt desc) {
    _id,
    orderNumber,
    status,
    items[] {
      product-> {
        _id,
        title,
        image
      },
      productSnapshot,
      quantity,
      selectedSize,
      unitPrice,
      totalPrice
    },
    subtotal,
    tax,
    shipping,
    total,
    currency,
    paymentMethod,
    paymentStatus,
    createdAt
  }`,

  singleOrder: `*[_type == "order" && _id == $orderId][0] {
    _id,
    orderNumber,
    customerEmail,
    customerName,
    userId,
    status,
    items[] {
      product-> {
        _id,
        title,
        slug,
        image,
        price
      },
      productSnapshot,
      quantity,
      selectedSize,
      unitPrice,
      totalPrice
    },
    subtotal,
    tax,
    taxRate,
    shipping,
    total,
    currency,
    shippingAddress,
    billingAddress,
    paymentMethod,
    paymentStatus,
    paymentId,
    paymentDetails,
    notes,
    trackingNumber,
    estimatedDelivery,
    actualDelivery,
    createdAt,
    updatedAt
  }`,
}
