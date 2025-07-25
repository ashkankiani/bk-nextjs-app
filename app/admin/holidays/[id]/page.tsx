import TheIdHolidayUi from '@/app/admin/holidays/[id]/TheIdHolidayUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ویرایش تعطیلی',
}
export default function TheIdHolidayPage() {
  return <TheIdHolidayUi />
}
