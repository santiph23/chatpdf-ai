
import type { Metadata } from 'next'

// Auth
import Navbar from '@/components/landing/navbar'

export const metadata: Metadata = {
  title: 'Cloudbase AI',
  description: 'Your Second Brain in the Cloud',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <main>
      <Navbar />
      {children}
    </main>
  )
}
