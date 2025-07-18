import Link from 'next/link'

export default function TheFooter() {
  return (
    <footer>
      <div className="flex-center-center mb-2 mt-8 divide-x divide-x-reverse divide-black text-sm font-semibold dark:divide-darkNavy3">
        <Link href="/faqs" className="px-2">
          سوالات متداول
        </Link>
        <Link href="/contact" className="px-2">
          تماس با ما
        </Link>
      </div>
      <p className="text-center text-xs">تمام حقوق مادی و معنوی محفوظ است.</p>
    </footer>
  )
}
