import { notFound } from "next/navigation"
import { client, wineQueries, type WineProduct } from "@/lib/sanity"
import SingleProductPage from "@/components/single-product-page"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<WineProduct | null> {
  try {
    const product = await client.fetch(wineQueries.singleProduct, { slug })
    return product
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

  return {
    title: product.title,
    description: product.description || `${product.title} - Premium wine selection`,
  }
}
