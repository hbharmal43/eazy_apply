import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen bg-gray-50">{children}</div>
}

