import TheProvidersInServiceUi from '@/app/admin/services/providers/[id]/TheProvidersInServiceUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ارائه دهندگان خدمت',
}
export default function TheProvidersInServicePage() {
  return <TheProvidersInServiceUi />
}
