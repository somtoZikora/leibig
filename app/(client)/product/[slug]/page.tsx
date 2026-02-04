import { notFound } from "next/navigation"
import { client, wineQueries, type WineProduct, type ExpandedBundleProduct } from "@/lib/sanity"
import SingleProductPage from "@/components/single-product-page"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<WineProduct | ExpandedBundleProduct | null> {
  try {
    // Decode the slug to handle URL-encoded characters (like ü, ö, ä)
    const decodedSlug = decodeURIComponent(slug)

    console.log(`[getProduct] Fetching product with slug: ${decodedSlug}`)

    // Try to fetch as a bundle FIRST (bundles are more specific)
    const bundle = await client.fetch(wineQueries.singleBundle, { slug: decodedSlug })
    if (bundle) {
      console.log(`[getProduct] Found bundle: ${bundle.title}`)
      console.log(`[getProduct] Bundle has ${bundle.bundleItems?.length || 0} items`)
      return bundle
    }

    // If not found as bundle, try as a regular product
    console.log(`[getProduct] Not a bundle, trying as regular product...`)
    const product = await client.fetch(wineQueries.singleProduct, { slug: decodedSlug })
    if (product) {
      console.log(`[getProduct] Found regular product: ${product.title}`)
      return product
    }

    console.log(`[getProduct] No product or bundle found with slug: ${decodedSlug}`)
    return null
  } catch (error) {
    console.error(`[getProduct] Error fetching product with slug "${slug}":`, error)
    if (error instanceof Error) {
      console.error(`[getProduct] Error message: ${error.message}`)
      console.error(`[getProduct] Error stack:`, error.stack)
    }
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return <SingleProductPage product={product} />
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  // Use custom metaTitle or fallback to product title
  const title = product.metaTitle || product.title

  // Use custom metaDescription or fallback to extracted description
  let description: string
  try {
    description = product.metaDescription || (
      product.description && Array.isArray(product.description)
        ? product.description
            .filter(block => block._type === 'block' && block.children && Array.isArray(block.children))
            .map(block => block.children
              .filter((child: any) => child && typeof child.text === 'string')
              .map((child: any) => child.text)
              .join(''))
            .join(' ')
            .slice(0, 160)
        : `${product.title} - Premium wine selection`
    )
  } catch (error) {
    console.error('Error generating metadata description:', error)
    description = `${product.title} - Premium wine selection`
  }

  return {
    title,
    description,
  }
}
