import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNavWithAlerts, SidebarWithAlerts } from "@/components/layout/nav-with-alerts"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
import { PageTransition } from "@/components/layout/page-transition"
import { AnimatedBackground } from "@/components/layout/animated-background"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-neutral-100/80 dark:bg-neutral-950 mesh-gradient">
        {/* Animated floating blobs */}
        <AnimatedBackground />

        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block md:fixed md:inset-y-4 md:left-4 md:w-64 md:z-40">
          <SidebarWithAlerts />
        </div>

        {/* Main content with page transition */}
        <main className="pt-16 pb-28 px-4 md:pt-8 md:pb-8 md:pl-76 md:pr-8">
          <div className="max-w-6xl mx-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNavWithAlerts />

        {/* Onboarding Tour */}
        <OnboardingTour />
      </div>
    </OnboardingProvider>
  )
}
