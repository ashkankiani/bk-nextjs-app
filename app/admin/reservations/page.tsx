import TheReservationsUi from '@/app/admin/reservations/TheReservationsUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'رزروها',
}
export default function TheReservationsPage() {
  return <TheReservationsUi />
}
