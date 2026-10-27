#!/usr/bin/env node

/**
 * One-off migration: mark every order item's product reference (items[].product) as weak.
 *
 * Orders used to point at the bought product or bundle with a strong reference. Sanity
 * refuses to unpublish or delete a document that is strongly referenced, so a bundle
 * that was ever ordered could not be taken off the shop. Orders keep what was bought
 * in items[].productSnapshot, so a weak reference loses nothing.
 *
 * Dry run (default, read-only, prints counts only):
 *   node --env-file=.env scripts/weaken-order-item-refs.mjs
 * Write:
 *   node --env-file=.env scripts/weaken-order-item-refs.mjs --write
 * Roll back (make the references strong again; fails for any reference whose target
 * has been deleted since):
 *   node --env-file=.env scripts/weaken-order-item-refs.mjs --rollback [--write]
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_TOKEN
 * (a token with write access for --write).
 */

import { createClient } from '@sanity/client'

const args = new Set(process.argv.slice(2))
const write = args.has('--write')
const rollback = args.has('--rollback')
const BATCH_SIZE = 50

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  console.error('   Run with: node --env-file=.env scripts/weaken-order-item-refs.mjs')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token,
  perspective: 'raw', // include drafts of orders too
})

// Items that still need changing: strong refs when weakening, weak refs when rolling back
const needsChange = rollback
  ? 'defined(product._ref) && product._weak == true'
  : 'defined(product._ref) && !(product._weak == true)'

const run = async () => {
  console.log(`🔗 ${rollback ? 'Rollback' : 'Weaken order item refs'} on ${projectId}/${dataset} (${write ? 'WRITE' : 'dry run'})`)

  const orders = await client.fetch(
    `*[_type == "order" && count(items[${needsChange}]) > 0]{
      _id,
      _rev,
      "items": items[]{ _key, "change": ${needsChange} }
    }`
  )

  const patches = orders.map(order => {
    // Address items by _key where present; older orders were created without item keys
    const paths = order.items
      .map((item, index) => (item.change ? `items[${item._key ? `_key=="${item._key}"` : index}].product._weak` : null))
      .filter(Boolean)
    return { id: order._id, rev: order._rev, paths, keyless: paths.filter(p => !p.includes('_key')).length }
  })

  const refCount = patches.reduce((sum, p) => sum + p.paths.length, 0)
  const keylessCount = patches.reduce((sum, p) => sum + p.keyless, 0)
  const draftCount = patches.filter(p => p.id.startsWith('drafts.')).length
  const totalOrders = await client.fetch('count(*[_type == "order"])')

  console.log(`📦 Orders in dataset:            ${totalOrders}`)
  console.log(`📝 Orders to patch:              ${patches.length} (of which drafts: ${draftCount})`)
  console.log(`🔗 References to ${rollback ? 'make strong' : 'make weak'}:     ${refCount} (addressed by index, no _key: ${keylessCount})`)

  if (!write) {
    console.log('ℹ️  Dry run, nothing written. Add --write to apply.')
    return
  }

  let done = 0
  for (let i = 0; i < patches.length; i += BATCH_SIZE) {
    const transaction = client.transaction()
    for (const { id, rev, paths } of patches.slice(i, i + BATCH_SIZE)) {
      const patch = client.patch(id).ifRevisionId(rev)
      transaction.patch(rollback ? patch.unset(paths) : patch.set(Object.fromEntries(paths.map(p => [p, true]))))
    }
    await transaction.commit({ visibility: 'async' })
    done += Math.min(BATCH_SIZE, patches.length - i)
    console.log(`✅ ${done}/${patches.length} orders patched`)
  }
  console.log('🎉 Done. Run again without --write to confirm 0 orders left to patch.')
}

run().catch(error => {
  console.error('❌ Migration failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
