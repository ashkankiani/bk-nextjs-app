import Link from "next/link";

export default function TheFooter() {
    return (
        <footer>
            <div className="flex-center-center divide-x divide-x-reverse divide-black dark:divide-darkNavy3 mt-8 mb-2 text-sm font-semibold">
                <Link href="/faqs" className="px-2">سوالات متداول</Link>
                <Link href="/contact" className="px-2">تماس با ما</Link>
            </div>
            <p className="text-center text-xs">تمام حقوق مادی و معنوی محفوظ است.</p>
        </footer>
    )
}
