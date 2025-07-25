import TheHolidaysUi from '@/app/admin/holidays/TheHolidaysUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تعطیلات',
}
export default function TheHolidaysPage() {
  return <TheHolidaysUi />
}
