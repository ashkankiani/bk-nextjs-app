import TheConnectionsUi from '@/app/admin/connections/TheConnectionsUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ارتباطات',
}

export default function TheConnectionsPage() {
  return <TheConnectionsUi />
}
