import TheFinancialsUi from '@/app/admin/financials/TheFinancialsUi'
import {Metadata} from "next";


export const metadata: Metadata = {
  title: 'امور مالی',
}
export default function TheFinancialsPage() {
  return <TheFinancialsUi />
}
