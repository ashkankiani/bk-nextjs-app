import { ReactNode } from 'react'

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <section className="container-fluid my-8">
      <div className="container">
        <div className="prose prose-neutral max-w-full dark:prose-invert prose-a:font-semibold prose-a:text-blue-700 prose-a:no-underline prose-img:rounded-xl dark:prose-a:text-green-500">
          {children}
        </div>
      </div>
    </section>
  )
}
