import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
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
  title: "Superfier: mastra.ai",
  description: "Demo application showcasing Mastra.ai capabilities",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦸</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="relative min-h-screen bg-gradient-to-b from-background to-background via-accent/10">
          <div className="absolute inset-0 w-full h-full z-0  bg-grid-pattern" />
          <main className="relative">
            <Providers>
                {children}
            </Providers>
          </main>
        </div>
      </body>
    </html>
  )
}
