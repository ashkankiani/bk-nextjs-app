import TheCatalogsUi from '@/app/admin/catalogs/TheCatalogsUi'
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'سطوح دسترسی',
}

export default function TheCatalogsPage() {
  return <TheCatalogsUi />
}
