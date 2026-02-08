import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNavWithAlerts, SidebarWithAlerts } from "@/components/layout/nav-with-alerts"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:w-64">
        <SidebarWithAlerts />
      </div>

      {/* Main content */}
      <main className="pt-16 pb-24 px-4 md:pt-8 md:pb-8 md:pl-72 md:pr-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNavWithAlerts />
    </div>
  )
}
