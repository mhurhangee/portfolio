import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next";
import Link from "next/link";

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Mastra.ai Demo",
  description: "Demo application showcasing Mastra.ai capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >

        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold font-mono ml-8">mastra.ai agents demo</span>
              </Link>
            </div>
          </header>
          <main className="flex-1">
            <Providers>{children}</Providers>
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex h-14 items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Built with Next.js and Mastra.ai
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
