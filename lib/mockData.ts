// import { WineProduct } from './sanity'

// // Mock data for testing - toggle between mock and real data
// // Set to true to always use mock data, or use environment variable
// export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
//   (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false')

// export const mockProducts: WineProduct[] = [
//   {
//     _id: 'mock-1',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Château Margaux 2018',
//     slug: { current: 'chateau-margaux-2018' },
//     image: SanityImage,
//     gallery: [],
//     description: 'A prestigious Bordeaux wine with exceptional depth and complexity. This vintage showcases the perfect balance of power and elegance.',
//     price: 899.99,
//     oldPrice: 1099.99,
//     discount: 18,
//     rating: 4.8,
//     sizes: ['small', 'medium', 'large'],
//     status: 'TOP-VERKÄUFER',
//     variant: 'Weine',
//     category: {
//       _type: 'reference',
//       _ref: 'category-red-wine'
//     },
//     tags: ['premium', 'bordeaux', 'red-wine'],
//     stock: 12
//   },
//   {
//     _id: 'mock-2',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Dom Pérignon Vintage 2015',
//     slug: { _type: 'slug', current: 'dom-perignon-vintage-2015' },
//     image: null,
//     gallery: [],
//     description: 'Luxury champagne with fine bubbles and complex aromas. Perfect for special celebrations.',
//     price: 249.99,
//     oldPrice: null,
//     discount: null,
//     rating: 4.9,
//     sizes: ['medium', 'large'],
//     status: 'STARTERSETS',
//     variant: 'Neuheiten',
//     category: {
//       _type: 'reference',
//       _ref: 'category-champagne'
//     },
//     tags: ['champagne', 'luxury', 'vintage'],
//     stock: 8
//   },
//   {
//     _id: 'mock-3',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Barolo Brunate 2019',
//     slug: { _type: 'slug', current: 'barolo-brunate-2019' },
//     image: null,
//     gallery: [],
//     description: 'Italian masterpiece from Piedmont. Rich, full-bodied with notes of cherry and truffle.',
//     price: 89.99,
//     oldPrice: 119.99,
//     discount: 25,
//     rating: 4.6,
//     sizes: ['small', 'medium'],
//     status: 'TOP-VERKÄUFER',
//     variant: 'Im Angebot',
//     category: {
//       _type: 'reference',
//       _ref: 'category-red-wine'
//     },
//     tags: ['italian', 'barolo', 'red-wine', 'discount'],
//     stock: 15
//   },
//   {
//     _id: 'mock-4',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Riesling Spätlese 2020',
//     slug: { _type: 'slug', current: 'riesling-spatlese-2020' },
//     image: null,
//     gallery: [],
//     description: 'German white wine with perfect balance of sweetness and acidity. Excellent with spicy food.',
//     price: 34.99,
//     oldPrice: null,
//     discount: null,
//     rating: 4.4,
//     sizes: ['small', 'medium', 'large'],
//     status: 'STARTERSETS',
//     variant: 'Weine',
//     category: {
//       _type: 'reference',
//       _ref: 'category-white-wine'
//     },
//     tags: ['german', 'riesling', 'white-wine', 'sweet'],
//     stock: 20
//   },
//   {
//     _id: 'mock-5',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Napa Valley Cabernet 2021',
//     slug: { _type: 'slug', current: 'napa-valley-cabernet-2021' },
//     image: null,
//     gallery: [],
//     description: 'California classic with bold fruit flavors and smooth tannins. Perfect for steak dinners.',
//     price: 65.99,
//     oldPrice: 79.99,
//     discount: 17,
//     rating: 4.5,
//     sizes: ['medium', 'large'],
//     status: 'TOP-VERKÄUFER',
//     variant: 'Weine',
//     category: {
//       _type: 'reference',
//       _ref: 'category-red-wine'
//     },
//     tags: ['california', 'cabernet', 'red-wine', 'bold'],
//     stock: 18
//   },
//   {
//     _id: 'mock-6',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Prosecco Superiore DOCG',
//     slug: { _type: 'slug', current: 'prosecco-superiore-docg' },
//     image: null,
//     gallery: [],
//     description: 'Italian sparkling wine with fresh, fruity character. Ideal for aperitifs and celebrations.',
//     price: 24.99,
//     oldPrice: null,
//     discount: null,
//     rating: 4.3,
//     sizes: ['small', 'medium'],
//     status: 'STARTERSETS',
//     variant: 'Neuheiten',
//     category: {
//       _type: 'reference',
//       _ref: 'category-champagne'
//     },
//     tags: ['italian', 'prosecco', 'sparkling', 'fresh'],
//     stock: 25
//   },
//   {
//     _id: 'mock-7',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Burgundy Pinot Noir 2020',
//     slug: { _type: 'slug', current: 'burgundy-pinot-noir-2020' },
//     image: null,
//     gallery: [],
//     description: 'Elegant French wine with delicate aromas and silky texture. A true expression of terroir.',
//     price: 125.99,
//     oldPrice: 149.99,
//     discount: 16,
//     rating: 4.7,
//     sizes: ['small', 'medium', 'large'],
//     status: 'TOP-VERKÄUFER',
//     variant: 'Im Angebot',
//     category: {
//       _type: 'reference',
//       _ref: 'category-red-wine'
//     },
//     tags: ['french', 'burgundy', 'pinot-noir', 'elegant'],
//     stock: 10
//   },
//   {
//     _id: 'mock-8',
//     _type: 'product',
//     _createdAt: '2024-01-01T00:00:00Z',
//     _updatedAt: '2024-01-01T00:00:00Z',
//     title: 'Sauvignon Blanc Reserve 2022',
//     slug: { _type: 'slug', current: 'sauvignon-blanc-reserve-2022' },
//     image: null,
//     gallery: [],
//     description: 'Crisp white wine with vibrant citrus notes and mineral finish. Perfect summer wine.',
//     price: 28.99,
//     oldPrice: null,
//     discount: null,
//     rating: 4.2,
//     sizes: ['small', 'medium', 'large'],
//     status: 'STARTERSETS',
//     variant: 'Weine',
//     category: {
//       _type: 'reference',
//       _ref: 'category-white-wine'
//     },
//     tags: ['sauvignon-blanc', 'white-wine', 'crisp', 'citrus'],
//     stock: 22
//   }
// ]

// export const mockCategories = [
//   {
//     _id: 'category-red-wine',
//     _type: 'category',
//     title: 'Red Wine',
//     slug: { _type: 'slug', current: 'red-wine' },
//     description: 'Premium red wines from around the world',
//     image: undefined
//   },
//   {
//     _id: 'category-white-wine',
//     _type: 'category',
//     title: 'White Wine',
//     slug: { _type: 'slug', current: 'white-wine' },
//     description: 'Elegant white wines for every occasion',
//     image: undefined
//   },
//   {
//     _id: 'category-champagne',
//     _type: 'category',
//     title: 'Champagne & Sparkling',
//     slug: { _type: 'slug', current: 'champagne-sparkling' },
//     description: 'Celebration wines and sparkling varieties',
//     image: undefined
//   }
// ]

// // Helper functions to filter mock data
// export const getMockStarterSets = () => mockProducts.filter(p => p.status === 'STARTERSETS')
// export const getMockTopSellers = () => mockProducts.filter(p => p.status === 'TOP-VERKÄUFER')
// export const getMockProductBySlug = (slug: string) => mockProducts.find(p => p.slug.current === slug)
// export const getMockProductsByCategory = (categorySlug: string) => {
//   const category = mockCategories.find(c => c.slug.current === categorySlug)
//   if (!category) return []
//   return mockProducts.filter(p => p.category?._ref === category._id)
// }
// export const getMockProductsByVariant = (variant: string) => mockProducts.filter(p => p.variant === variant)
// export const searchMockProducts = (searchTerm: string) => {
//   return mockProducts.filter(p => 
//     p.title.toLowerCase().includes(searchTerm.toLowerCase())
//   )
// }