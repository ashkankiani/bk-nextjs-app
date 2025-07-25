import TheAddReservationsUi from '@/app/admin/reservations/add/TheAddReservationsUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'افزودن رزرو',
}
export default function TheAddReservationsPage() {
  return <TheAddReservationsUi />
}
