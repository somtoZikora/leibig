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
    // First try to fetch as a regular product
    const product = await client.fetch(wineQueries.singleProduct, { slug })
    if (product) return product

    // If not found, try to fetch as a bundle
    const bundle = await client.fetch(wineQueries.singleBundle, { slug })
    return bundle || null
  } catch (error) {
    console.error("Error fetching product:", error)
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
  const description = product.metaDescription || (
    product.description && Array.isArray(product.description)
      ? product.description
          .filter(block => block._type === 'block' && block.children)
          .map(block => block.children.map(child => child.text).join(''))
          .join(' ')
          .slice(0, 160)
      : `${product.title} - Premium wine selection`
  )

  return {
    title,
    description,
  }
}
