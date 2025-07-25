import TheIdUserUi from '@/app/admin/users/[id]/TheIdUserUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'ویرایش کاربر',
}
export default function TheIdUserPage() {
  return <TheIdUserUi />
}
