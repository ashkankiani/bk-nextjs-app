import { ReactNode } from 'react'
import LayoutPanel from '@/components/back-end/layout/LayoutPanel'

export default function RootLayoutTheme1({ children }: { children: ReactNode }) {
  return <LayoutPanel>{children}</LayoutPanel>
}
