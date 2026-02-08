import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { MobileHeader } from "@/components/layout/mobile-header"

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
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="pt-14 pb-20 px-4 md:pt-0 md:pb-0 md:pl-64 md:p-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}
