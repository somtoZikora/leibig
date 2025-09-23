#!/usr/bin/env node

/**
 * Sanity Data Import Script
 * Run this script to import the exported data to your new Sanity project
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Destination Sanity client (new account)
const destinationClient = createClient({
  projectId: '2hqr3d91',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skbnX9WHmYtYpc2uLtyf7hmz5hHhWM23zhGRGKameGtko06kJzy39tGyWAjx1DQL3FerZ7Rju4If0yP0zaQvet7JRejn3rAp4EXEnTUrowVw1Ur7bzuA6qNeyFAAZUyYoYLqiJpIwGinPpP0atkoPy2DKIQptNPILdfpaB8u4VIcbYLfIvBn'
})

const cleanDocument = (doc) => {
  const cleaned = { ...doc }
  delete cleaned._id
  delete cleaned._createdAt
  delete cleaned._updatedAt
  delete cleaned._rev
  return cleaned
}

const importData = async () => {
  console.log('🚀 Starting data import to project: 2hqr3d91')
  
  try {
    // Import categories first
    const categoriesPath = path.join(process.cwd(), 'sanity-exports', 'categories.json')
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
      
      for (const category of categories) {
        try {
          const cleaned = cleanDocument(category)
          await destinationClient.create(cleaned)
          console.log(`✅ Imported category: ${category.title}`)
        } catch (error) {
          console.error(`❌ Failed to import category ${category.title}:`, error.message)
        }
      }
    }
    
    // Import products
    const productsPath = path.join(process.cwd(), 'sanity-exports', 'products.json')
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      
      for (const product of products) {
        try {
          const cleaned = cleanDocument(product)
          await destinationClient.create(cleaned)
          console.log(`✅ Imported product: ${product.title}`)
        } catch (error) {
          console.error(`❌ Failed to import product ${product.title}:`, error.message)
        }
      }
    }
    
    // Import orders
    const ordersPath = path.join(process.cwd(), 'sanity-exports', 'orders.json')
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))
      
      for (const order of orders) {
        try {
          const cleaned = cleanDocument(order)
          await destinationClient.create(cleaned)
          console.log(`✅ Imported order: ${order.orderNumber}`)
        } catch (error) {
          console.error(`❌ Failed to import order ${order.orderNumber}:`, error.message)
        }
      }
    }
    
    console.log('🎉 Import completed!')
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

importData().catch(console.error)
