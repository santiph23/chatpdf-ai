
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font'
// UI
import { Toaster } from "@/components/ui/toaster"

// CSS
import '@/app/globals.css'

// Auth
import { UserProvider } from '@auth0/nextjs-auth0/client';

//Trpc
import Providers from '@/components/providers'

export const metadata: Metadata = {
    title: 'Cloudbase AI',
    description: 'Cloudbase AI',
}

// UI

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <UserProvider>
            <html lang="en">
                <Providers>
                    <body className={GeistSans.className}>
                        {children}
                        <Toaster />
                    </body>
                </Providers>
            </html>
        </UserProvider>
    )
}
