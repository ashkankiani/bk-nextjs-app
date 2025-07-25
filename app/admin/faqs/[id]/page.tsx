import TheIdFaqUi from '@/app/admin/faqs/[id]/TheIdFaqUi'
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'ویرایش سوال متداول',
}
export default function TheIdFaqPage() {
  return <TheIdFaqUi />
}
