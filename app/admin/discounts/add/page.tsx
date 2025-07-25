import TheAddDiscountUi from '@/app/admin/discounts/add/TheAddDiscountUi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'افزودن کد تخفیف',
}
export default function TheAddDiscountPage() {
  return <TheAddDiscountUi />
}
