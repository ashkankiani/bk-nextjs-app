import TheDiscountsUi from '@/app/admin/discounts/TheDiscountsUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'کد تخفیف',
}

export default function TheDiscountsPage() {
  return <TheDiscountsUi />
}
