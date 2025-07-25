import TheProvidersUi from '@/app/admin/providers/TheProvidersUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ارائه دهندگان',
}
export default function TheProvidersPage() {
  return <TheProvidersUi />
}
