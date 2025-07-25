import TheIdDiscountUi from '@/app/admin/discounts/[id]/TheIdDiscountUi'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'ویرایش کد تخفیف',
}

export default function TheIdDiscountPage() {
  return <TheIdDiscountUi />
}
