import { cookies } from "next/headers"
import { SidebarProviderWrapper } from "@/components/layout/sidebar-provider-wrapper"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultLeftOpen = cookieStore.get("sidebar_left_state")?.value === "true"
  const defaultRightOpen = cookieStore.get("sidebar_right_state")?.value === "true"

  return (
    <SidebarProviderWrapper 
      defaultLeftOpen={defaultLeftOpen} 
      defaultRightOpen={defaultRightOpen}
    >
      {children}
    </SidebarProviderWrapper>
  )
}