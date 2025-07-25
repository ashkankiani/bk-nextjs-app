import TheDashboardUi from '@/app/admin/dashboard/TheDashboardUi'
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'داشبورد',
}

export default function TheDashboardPage() {
  return <TheDashboardUi />
}
