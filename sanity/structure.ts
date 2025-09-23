import type {StructureResolver} from 'sanity/structure'
import { DocumentTextIcon } from '@sanity/icons';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Admin Panel wineshop Backend')
    .items([
      
      S.documentTypeListItem('category').title('Categories'),
     

     
      
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['category', 'autho'].includes(item.getId()!),
      ),
    ])
