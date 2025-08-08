import { Metadata } from 'next'
import TheReservationsUserUi from "@/app/admin/users/reservations/[userId]/TheReservationsUserUi";
export const metadata: Metadata = {
  title: 'رزروهای کاربر',
}
export default function TheReservationsUserPage() {
  return <TheReservationsUserUi />
}
