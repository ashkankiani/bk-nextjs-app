import TheUsersUi from '@/app/admin/users/TheUsersUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'کاربران',
}
export default function TheUsersPage() {
  return <TheUsersUi />
}
