import { ErrorBoundary } from "~/components/ErrorBoundary"
import { LayoutProps } from "./$types"


import "./tailwind.css"

export default function Layout({ children }: LayoutProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
