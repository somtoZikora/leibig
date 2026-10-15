/**
 * Address helpers shared by order creation and the Winestro export.
 * Pure functions only, so they can run on the client, the server and in tests.
 */

/** Turns missing values and the literal strings "undefined"/"null" into ''. */
export function cleanAddressValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  const lower = text.toLowerCase()
  return lower === 'undefined' || lower === 'null' ? '' : text
}

// "<street><separator><number>", where number is e.g. 5, 12a, 12 b, 3-5, 3/5, 10a-10c.
// The separator is whitespace, a comma, or nothing directly after a dot ("Albertstr.5").
const STREET_WITH_NUMBER =
  /^(.*?\S)\s*(?:,\s*|\s+|(?<=\.))(\d+(?:\s?[a-zA-Z])?(?:\s*[-/]\s*\d+(?:\s?[a-zA-Z])?)?)$/
const HAS_LETTER = /\p{L}/u

/**
 * Returns street and house number as separate fields.
 *
 * If a house number is given it is kept as is. Otherwise, when the street ends
 * with a house-number token ("Albertstr. 5", "Hauptstraße 12a", "Am Hang 3-5")
 * that token is split off. Anything else keeps the street untouched and returns
 * an empty house number, never "undefined".
 */
export function splitStreetAndHouseNumber(
  street: unknown,
  houseNumber?: unknown
): { street: string; houseNumber: string } {
  const cleanStreet = cleanAddressValue(street)
  const cleanNumber = cleanAddressValue(houseNumber)

  if (cleanNumber) return { street: cleanStreet, houseNumber: cleanNumber }

  const match = cleanStreet.match(STREET_WITH_NUMBER)
  if (match) {
    const streetPart = match[1].replace(/[\s,]+$/, '')
    if (HAS_LETTER.test(streetPart)) {
      return { street: streetPart, houseNumber: match[2].replace(/\s+/g, '') }
    }
  }

  return { street: cleanStreet, houseNumber: '' }
}

/** Applies splitStreetAndHouseNumber to an address object, keeping all other fields. */
export function withSplitHouseNumber<T extends { street?: unknown; houseNumber?: unknown }>(
  address: T
): T & { street: string; houseNumber: string } {
  return { ...address, ...splitStreetAndHouseNumber(address.street, address.houseNumber) }
}

/** Salutation options stored on orders (Sanity value). */
export const SALUTATIONS = ['herr', 'frau', 'divers', 'keine_angabe'] as const
export type Salutation = (typeof SALUTATIONS)[number]

export const SALUTATION_LABELS: Record<Salutation, string> = {
  herr: 'Herr',
  frau: 'Frau',
  divers: 'Divers',
  keine_angabe: 'Keine Angabe',
}

export function isSalutation(value: unknown): value is Salutation {
  return typeof value === 'string' && (SALUTATIONS as readonly string[]).includes(value)
}

/**
 * Winestro newOrder `anrede` / `l_anrede` code. The API docs list the field as a String
 * without codes, so the codes are inferred from existing Winestro data: 0 = "Herrn"
 * (confirmed: every order sent with anrede=0 shows "Herrn"), 1 = "Frau" (inferred from
 * the old mapping and the Frau customers in Winestro). Divers, keine Angabe and unknown
 * (e.g. PayPal Express) send an empty value. How Winestro handles an empty value is
 * unverified; it may fall back to 0/"Herrn".
 */
export function toWinestroAnrede(value: unknown): string {
  if (value === 'herr') return '0'
  if (value === 'frau') return '1'
  return ''
}
