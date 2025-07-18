import { ReactNode } from 'react'

export default function LayoutPermissionDenied({ children }: { children: ReactNode }) {
  return (
    <div className="bg-page-access-denied flex-center-center min-h-screen bg-cover">{children}</div>
  )
}
