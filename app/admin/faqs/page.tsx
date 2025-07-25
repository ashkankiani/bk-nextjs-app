import TheFaqsUi from '@/app/admin/faqs/TheFaqsUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سوالات متداول',
}
export default function TheFaqsPage() {
  return <TheFaqsUi />
}
