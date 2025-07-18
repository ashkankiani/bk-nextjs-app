import { ReactNode } from 'react'

export default function LayoutErrors({ children }: { children: ReactNode }) {
  return <div className="bg-page-errors flex-center-center min-h-screen bg-cover">{children}</div>
}
