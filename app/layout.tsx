import '@/styles/globals.css'
import AppProviderComponent from '@/components/AppProviderComponent'
import { ReactNode } from 'react'

export const metadata = {
  title: 'My App',
  description: 'Awesome app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppProviderComponent>{children}</AppProviderComponent>
      </body>
    </html>
  )
}
