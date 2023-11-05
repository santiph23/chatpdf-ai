

import type { Metadata } from 'next'

// Auth
import Navbar from '@/components/dashboard/navbar'

export const metadata: Metadata = {
    title: 'ChatPDF AI',
    description: 'Chat with your documents',
}

// UI
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <main>
            <div className='h-screen overflow-hidden overscroll-none'>

                <Navbar />

                <div className='w-screen px-16 md:px-32 h-[calc(100vh-56px)] relative flex border border-black border-opacity-5'>

                    <main className="overflow-hidden w-full h-[calc(100vh-56px)]">
                        <ScrollArea className=" h-[calc(100vh-56px)]">
                            <div className="pt-8">
                                {children}
                            </div>
                        </ScrollArea>
                    </main>

                </div>

            </div>
        </main>
    )
}
