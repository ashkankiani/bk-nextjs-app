import {ReactNode} from "react";

export default function LayoutPermissionDenied({children}:{ children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page-access-denied bg-cover flex-center-center">
      {children}
    </div>
  )
}
