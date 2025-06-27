import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Spenderella - Personal Expense Tracker",
  description: "Expense tracking dashboard",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plaid SDK script */}
        <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
