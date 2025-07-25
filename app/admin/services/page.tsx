import TheServicesUi from '@/app/admin/services/TheServicesUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'خدمات',
}
export default function TheServicesPage() {
  return <TheServicesUi />
}
