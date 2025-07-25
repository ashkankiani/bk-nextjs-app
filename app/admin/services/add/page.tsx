import TheAddServiceUi from '@/app/admin/services/add/TheAddServiceUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'افزودن خدمت',
}
export default function TheAddServicePage() {
  return <TheAddServiceUi />
}
