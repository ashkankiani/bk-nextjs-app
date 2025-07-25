import TheImportUsersUi from '@/app/admin/users/import-users/TheImportUsersUi'
import {Metadata} from "next";
export const metadata: Metadata = {
  title: 'درون ریزی کاربر',
}
export default function TheImportUsersPage() {
  return <TheImportUsersUi />
}
