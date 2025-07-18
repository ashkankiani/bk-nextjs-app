import { ReactNode } from 'react'
import Theme1Layout from '@/components/front-end/theme1/layout/Theme1Layout'

export default function RootLayoutTheme1({ children }: { children: ReactNode }) {
  return <Theme1Layout>{children}</Theme1Layout>
}
