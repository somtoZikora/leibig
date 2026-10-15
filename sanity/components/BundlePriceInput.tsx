'use client'

import { Card, Flex, Stack, Text } from '@sanity/ui'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { type NumberInputProps, useClient, useFormValue } from 'sanity'
import { splitBundlePrice, toCents } from '../../lib/winestro-bundle-pricing'
import { type BundleItemValue, formatEuro } from '../lib/bundlePricing'

type ProductPrice = { _id: string; title?: string; price?: number; winestroId?: string }

/**
 * Default number input for the bundle price plus a read-only summary:
 * Einzelpreis (sum of catalog prices), Ersparnis and the exact Winestro
 * positions as computed by splitBundlePrice (same code as the order sync).
 */
export function BundlePriceInput(props: NumberInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const items = useFormValue(['bundleItems']) as BundleItemValue[] | undefined
  const bundlePrice = props.value

  const ids = useMemo(
    () =>
      Array.from(
        new Set((items ?? []).map(i => i.product?._ref).filter((id): id is string => !!id))
      ).sort(),
    [items]
  )
  const idsKey = ids.join(',')

  const [products, setProducts] = useState<Record<string, ProductPrice>>({})
  const [error, setError] = useState<string | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!ids.length) {
      setProducts({})
      setLoadedKey(idsKey)
      return
    }
    let cancelled = false
    client
      .fetch<ProductPrice[]>(`*[_id in $ids]{_id, title, price, winestroId}`, { ids })
      .then(rows => {
        if (cancelled) return
        setProducts(Object.fromEntries(rows.map(r => [r._id, r])))
        setError(null)
        setLoadedKey(idsKey)
      })
      .catch(err => {
        if (!cancelled) setError(String(err?.message ?? err))
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, idsKey])

  const loaded = loadedKey === idsKey

  const lines = (items ?? []).map(item => {
    const product = item.product?._ref ? products[item.product._ref] : undefined
    const winestroId = product?.winestroId?.trim()
    return {
      key: item._key,
      title: product?.title?.trim() || 'Unbekannter Wein',
      // Placeholder when the wine is not linked to Winestro (yet)
      winestroId: winestroId || product?._id || item.product?._ref || `?${item._key ?? ''}`,
      hasWinestroId: !!winestroId,
      unitPrice: typeof product?.price === 'number' ? product.price : undefined,
      quantity: item.quantity ?? 0,
      bundlePrice: item.bundlePrice,
    }
  })

  const missingPrice = lines.some(l => l.unitPrice === undefined)
  const missingWinestroId = lines.filter(l => !l.hasWinestroId)

  let summary: ReactNode = null
  if (error) {
    summary = <Text size={1}>Produktpreise konnten nicht geladen werden: {error}</Text>
  } else if (!lines.length) {
    summary = <Text size={1} muted>Noch keine Weine im Paket.</Text>
  } else if (!loaded) {
    summary = <Text size={1} muted>Produktpreise werden geladen …</Text>
  } else if (typeof bundlePrice === 'number') {
    const catalogCents = missingPrice
      ? null
      : lines.reduce((s, l) => s + toCents(l.unitPrice as number) * l.quantity, 0)
    const savingCents = catalogCents === null ? null : catalogCents - toCents(bundlePrice)

    // Exactly the function the Winestro sync uses, for one bundle.
    const split = splitBundlePrice(
      bundlePrice,
      lines.map(l => ({
        winestroId: l.winestroId,
        quantity: l.quantity,
        productPrice: l.unitPrice ?? null,
        bundlePrice: l.bundlePrice ?? null,
      })),
      1
    )
    const allExplicit = lines.every(l => typeof l.bundlePrice === 'number')
    const titleById = new Map<string, string>()
    for (const l of lines) if (!titleById.has(l.winestroId)) titleById.set(l.winestroId, l.title)

    summary = (
      <Stack space={3}>
        {catalogCents !== null && savingCents !== null ? (
          <Text size={1}>
            Einzelpreis: <strong>{formatEuro(catalogCents / 100)}</strong> · Ersparnis:{' '}
            <strong>{formatEuro(savingCents / 100)}</strong>
            {catalogCents > 0 &&
              ` (${((savingCents / catalogCents) * 100).toFixed(1).replace('.', ',')} %)`}
          </Text>
        ) : (
          <Text size={1} muted>
            Nicht alle Weine haben einen Einzelpreis – Einzelpreis/Ersparnis nicht berechenbar.
          </Text>
        )}
        {split.ok ? (
          <>
            <Text size={1} weight="semibold">
              {split.source === 'bundlePrice'
                ? 'An Winestro übertragen (eigene Paketpreise):'
                : allExplicit
                  ? 'An Winestro übertragen (automatische Aufteilung – eigene Paketpreise ergeben nicht den Paketpreis und werden ignoriert):'
                  : 'An Winestro übertragen (automatische Aufteilung nach Einzelpreisen):'}
            </Text>
            <Stack space={2}>
              {split.positions.map((pos, i) => (
                <Flex key={`${pos.winestroId}-${i}`} justify="space-between" gap={2}>
                  <Text size={1} muted>
                    {pos.quantity} × {titleById.get(pos.winestroId) ?? pos.winestroId} (
                    {lines.find(l => l.winestroId === pos.winestroId)?.hasWinestroId
                      ? `Winestro ${pos.winestroId}`
                      : 'ohne Winestro-ID'}
                    ) à {formatEuro(pos.unitPriceCents / 100)}
                  </Text>
                  <Text size={1}>{formatEuro((pos.unitPriceCents * pos.quantity) / 100)}</Text>
                </Flex>
              ))}
              <Flex justify="space-between" gap={2}>
                <Text size={1} weight="semibold">
                  Summe
                </Text>
                <Text size={1} weight="semibold">
                  {formatEuro(
                    split.positions.reduce((s, p) => s + p.unitPriceCents * p.quantity, 0) / 100
                  )}
                </Text>
              </Flex>
            </Stack>
          </>
        ) : (
          <Text size={1}>Aufteilung nicht möglich: {split.reason}</Text>
        )}
        {missingWinestroId.length > 0 && (
          <Text size={1} muted>
            Ohne Winestro-ID (Platzhalter verwendet): {missingWinestroId.map(l => l.title).join(', ')}.
          </Text>
        )}
      </Stack>
    )
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {summary && (
        <Card padding={3} radius={2} tone="transparent" border>
          {summary}
        </Card>
      )}
    </Stack>
  )
}
