import TheIdProviderUi from '@/app/admin/providers/[id]/TheIdProviderUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ویرایش ارائه دهنده',
}
export default function TheIdProviderPage() {
  return <TheIdProviderUi />
}
