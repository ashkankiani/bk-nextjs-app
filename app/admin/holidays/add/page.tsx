import TheAddHolidayUi from '@/app/admin/holidays/add/TheAddHolidayUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'افزودن تعطیلی',
}
export default function TheAddHolidayPage() {
  return <TheAddHolidayUi />
}
