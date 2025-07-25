import TheIdCatalogUi from '@/app/admin/catalogs/[id]/TheIdCatalogUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ویرایش سطح دسترسی',
}

export default function TheIdCatalogPage() {
  return <TheIdCatalogUi />
}
