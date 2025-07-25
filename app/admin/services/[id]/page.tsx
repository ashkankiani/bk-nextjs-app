import TheIdServiceUi from '@/app/admin/services/[id]/TheIdServiceUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ویرایش خدمت',
}
export default function TheIdServicePage() {
  return <TheIdServiceUi />
}
