import { type SchemaTypeDefinition } from 'sanity'
import { authorType } from './authorType'
import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import { postType } from './postType'
import { productType } from './productType'
import { syncLogType } from './syncLogType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    authorType,
    blockContentType,
    categoryType,
    orderType,
    postType,
    productType,
    syncLogType,
  ],
}
