import { Geist, Geist_Mono } from "next/font/google"
import "../../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Real Estate Admin Portal",
  description: "Admin dashboard for real estate management",
}

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
        <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
