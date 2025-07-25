import TheAddProviderUi from '@/app/admin/providers/add/TheAddProviderUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'افزودن ارائه دهنده',
}
export default function TheAddProviderPage() {
  return <TheAddProviderUi />
}
