"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { SectionProvider } from "@/app/(aboutme)/components/sectioncontext"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme
    >
      <Toaster />
      <TooltipProvider delayDuration={0}>
        <SectionProvider>
          {children}
        </SectionProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
