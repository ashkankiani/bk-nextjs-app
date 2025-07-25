import TheAddCatalogUi from '@/app/admin/catalogs/add/TheAddCatalogUi'
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'افزودن سطح دسترسی',
}

export default function TheAddCatalogPage() {
  return <TheAddCatalogUi />
}
