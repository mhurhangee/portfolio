'use client'

import { SidebarProvider } from "@workspace/ui/components/sidebar"

interface SidebarProviderWrapperProps {
  children: React.ReactNode
  defaultLeftOpen: boolean
  defaultRightOpen: boolean
}

export function SidebarProviderWrapper({
  children,
  defaultLeftOpen,
  defaultRightOpen
}: SidebarProviderWrapperProps) {
  return (
    <SidebarProvider 
      defaultLeftOpen={defaultLeftOpen} 
      defaultRightOpen={defaultRightOpen}
      onLeftOpenChange={(open) => {
        document.cookie = `sidebar_left_state=${open}; path=/; max-age=31536000`
      }}
      onRightOpenChange={(open) => {
        document.cookie = `sidebar_right_state=${open}; path=/; max-age=31536000`
      }}
    >
      {children}
    </SidebarProvider>
  )
}
