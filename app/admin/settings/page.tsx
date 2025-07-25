import TheSettingsUi from '@/app/admin/settings/TheSettingsUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'تنظیمات',
}
export default function TheSettingsPage() {
  return <TheSettingsUi />
}
