import { getUnreadAlertCount } from "@/app/(dashboard)/alerts/actions"
import { createClient } from "@/lib/supabase/server"
import { MobileNavClient } from "./mobile-nav-client"
import { SidebarClient } from "./sidebar-client"

async function getUserData() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userData.user.id)
    .single()

  return {
    email: userData.user.email || "",
    full_name: profile?.full_name || null,
    avatar_url: profile?.avatar_url || userData.user.user_metadata?.avatar_url || null,
  }
}

export async function MobileNavWithAlerts() {
  const [alertResult, user] = await Promise.all([
    getUnreadAlertCount(),
    getUserData(),
  ])
  const alertCount = alertResult.success ? alertResult.data : 0

  return <MobileNavClient alertCount={alertCount} user={user} />
}

export async function SidebarWithAlerts() {
  const [alertResult, user] = await Promise.all([
    getUnreadAlertCount(),
    getUserData(),
  ])
  const alertCount = alertResult.success ? alertResult.data : 0

  return <SidebarClient alertCount={alertCount} user={user} />
}
