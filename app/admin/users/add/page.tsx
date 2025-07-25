import TheAddUserUi from '@/app/admin/users/add/TheAddUserUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'افزودن کاربر',
}
export default function TheAddUserPage() {
  return <TheAddUserUi />
}
