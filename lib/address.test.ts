// Run with: npx tsx --test lib/address.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  cleanAddressValue,
  splitStreetAndHouseNumber,
  withSplitHouseNumber,
  toWinestroAnrede,
  isGermany,
  deliveryCountryOf,
  deliversToGermany,
} from './address'

const split = (street: unknown, houseNumber?: unknown) =>
  splitStreetAndHouseNumber(street, houseNumber)

test('keeps an existing house number', () => {
  assert.deepEqual(split('Albertstr.', '5'), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split(' Hauptstraße ', ' 12a '), { street: 'Hauptstraße', houseNumber: '12a' })
})

test('splits a trailing house number off the street', () => {
  assert.deepEqual(split('albertstr. 5'), { street: 'albertstr.', houseNumber: '5' })
  assert.deepEqual(split('Albertstr. 5', undefined), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split('Hauptstraße 12a'), { street: 'Hauptstraße', houseNumber: '12a' })
  assert.deepEqual(split('Hauptstraße 12 a'), { street: 'Hauptstraße', houseNumber: '12a' })
  assert.deepEqual(split('Am Hang 3-5'), { street: 'Am Hang', houseNumber: '3-5' })
  assert.deepEqual(split('Am Hang 3 - 5'), { street: 'Am Hang', houseNumber: '3-5' })
  assert.deepEqual(split('Ringstraße 10/2'), { street: 'Ringstraße', houseNumber: '10/2' })
  assert.deepEqual(split('Albertstr.5'), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split('Am Weinberg, 7b'), { street: 'Am Weinberg', houseNumber: '7b' })
  assert.deepEqual(split('Karl-Marx-Str.  104'), { street: 'Karl-Marx-Str.', houseNumber: '104' })
  assert.deepEqual(split(' Lange Gasse 9 '), { street: 'Lange Gasse', houseNumber: '9' })
})

test('treats the literal strings "undefined" and "null" as missing', () => {
  assert.deepEqual(split('Albertstr. 5', 'undefined'), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split('Albertstr. 5', 'null'), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split('Albertstr. 5', '   '), { street: 'Albertstr.', houseNumber: '5' })
  assert.deepEqual(split(undefined, undefined), { street: '', houseNumber: '' })
  assert.deepEqual(split(null, null), { street: '', houseNumber: '' })
})

test('leaves streets without a trailing number untouched', () => {
  assert.deepEqual(split('Am Marktplatz'), { street: 'Am Marktplatz', houseNumber: '' })
  assert.deepEqual(split('5 Rue de la Paix'), { street: '5 Rue de la Paix', houseNumber: '' })
  assert.deepEqual(split('Hauptstr. 12 3. OG'), { street: 'Hauptstr. 12 3. OG', houseNumber: '' })
  assert.deepEqual(split('Musterweg12'), { street: 'Musterweg12', houseNumber: '' })
  assert.deepEqual(split('123456789'), { street: '123456789', houseNumber: '' })
  assert.deepEqual(split(''), { street: '', houseNumber: '' })
})

test('withSplitHouseNumber keeps the other address fields', () => {
  const address = { firstName: 'A', street: 'Albertstr. 5', city: 'X', postalCode: '1' }
  assert.deepEqual(withSplitHouseNumber(address), {
    firstName: 'A', street: 'Albertstr.', houseNumber: '5', city: 'X', postalCode: '1',
  })
})

test('cleanAddressValue', () => {
  assert.equal(cleanAddressValue(undefined), '')
  assert.equal(cleanAddressValue('UNDEFINED'), '')
  assert.equal(cleanAddressValue(12), '12')
})

test('toWinestroAnrede', () => {
  assert.equal(toWinestroAnrede('herr'), '0')
  assert.equal(toWinestroAnrede('frau'), '1')
  assert.equal(toWinestroAnrede('divers'), '')
  assert.equal(toWinestroAnrede('keine_angabe'), '')
  assert.equal(toWinestroAnrede(undefined), '')
})

test('isGermany', () => {
  assert.equal(isGermany('DE'), true)
  assert.equal(isGermany('de'), true)
  assert.equal(isGermany(' Deutschland '), true)
  assert.equal(isGermany('Germany'), true)
  assert.equal(isGermany('AT'), false)
  assert.equal(isGermany('Österreich'), false)
  assert.equal(isGermany(''), false)
  assert.equal(isGermany(undefined), false)
})

test('deliversToGermany uses the shipping address, else the billing address', () => {
  assert.equal(deliversToGermany({ shippingAddress: { country: 'DE' }, billingAddress: { country: 'AT' } }), true)
  assert.equal(deliversToGermany({ shippingAddress: { country: 'AT' }, billingAddress: { country: 'DE' } }), false)
  assert.equal(deliversToGermany({ billingAddress: { country: 'Deutschland' } }), true)
  assert.equal(deliversToGermany({ billingAddress: { country: 'Frankreich' } }), false)
  assert.equal(deliversToGermany({}), false)
  assert.equal(deliveryCountryOf({ shippingAddress: { country: 'CH' } }), 'CH')
})
