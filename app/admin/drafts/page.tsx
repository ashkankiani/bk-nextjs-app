import TheDraftsUi from '@/app/admin/drafts/TheDraftsUi'
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'در حال رزرو',
}
export default function TheDraftsPage() {
  return <TheDraftsUi />
}
