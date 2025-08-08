import { ReactNode } from 'react'

type TypeHeaderPageProps = {
  title: string
  description: string
  children?: ReactNode
}
export default function HeaderPage({ title, description, children }: TypeHeaderPageProps) {
  return (
    <div className="panel-header-page">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="flex-center-between flex-wrap gap-4 max-sm:w-full">{children}</div>
    </div>
  )
}
