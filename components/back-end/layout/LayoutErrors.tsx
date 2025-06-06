import {ReactNode} from "react";

export default function LayoutErrors({children}: {children: ReactNode}) {
  return (
    <div className="min-h-screen bg-page-errors bg-cover flex-center-center">
      {children}
    </div>
  )
}
