// Run with: npx tsx --test lib/order-items.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { weakProductRef, withWeakProductRefs } from './order-items'

test('weakProductRef', () => {
  assert.deepEqual(weakProductRef('abc'), { _type: 'reference', _ref: 'abc', _weak: true })
})

test('withWeakProductRefs marks every item reference weak and keeps the rest', () => {
  const order = {
    _type: 'order',
    items: [
      { _key: 'a', product: { _type: 'reference', _ref: 'p1' }, productSnapshot: { title: 'Wein' }, quantity: 2 },
      { _key: 'b', product: { _type: 'reference', _ref: 'b1', _weak: true }, quantity: 1 },
    ],
  }
  assert.deepEqual(withWeakProductRefs(order), {
    _type: 'order',
    items: [
      { _key: 'a', product: { _type: 'reference', _ref: 'p1', _weak: true }, productSnapshot: { title: 'Wein' }, quantity: 2 },
      { _key: 'b', product: { _type: 'reference', _ref: 'b1', _weak: true }, quantity: 1 },
    ],
  })
})

test('withWeakProductRefs leaves orders without items or refs alone', () => {
  const noItems = { _type: 'order' }
  assert.deepEqual(withWeakProductRefs(noItems), { _type: 'order' })
  assert.deepEqual(withWeakProductRefs({ items: [{ quantity: 1 }] }), { items: [{ quantity: 1 }] })
})
