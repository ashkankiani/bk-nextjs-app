import TheTimeSheetProviderUi from '@/app/admin/providers/timesheets/[id]/TheTimeSheetProviderUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'تقویم کاری',
}
export default function TheTimeSheetProviderPage() {
  return <TheTimeSheetProviderUi />
}
