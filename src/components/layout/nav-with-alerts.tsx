import { getUnreadAlertCount } from "@/app/(dashboard)/alerts/actions"
import { MobileNavClient } from "./mobile-nav-client"
import { SidebarClient } from "./sidebar-client"

export async function MobileNavWithAlerts() {
  const result = await getUnreadAlertCount()
  const alertCount = result.success ? result.data : 0

  return <MobileNavClient alertCount={alertCount} />
}

export async function SidebarWithAlerts() {
  const result = await getUnreadAlertCount()
  const alertCount = result.success ? result.data : 0

  return <SidebarClient alertCount={alertCount} />
}
