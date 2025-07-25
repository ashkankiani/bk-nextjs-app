import TheAddFaqUi from '@/app/admin/faqs/add/TheAddFaqUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'افزودن سوال متداول',
}
export default function TheAddFaqPage() {
  return <TheAddFaqUi />
}
