import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This runs as a cron job to check for overdue maintenance
// Configure in vercel.json:
// { "crons": [{ "path": "/api/cron/maintenance", "schedule": "0 9 * * *" }] }

export const runtime = "edge"

export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const now = new Date()
    const alertsCreated: string[] = []

    // Get all equipment with maintenance intervals
    const { data: equipment, error: eqError } = await supabase
      .from("equipment")
      .select("id, user_id, model, brand, type, maintenance_interval_days, last_maintenance, maintenance_last_notified")
      .not("maintenance_interval_days", "is", null)

    if (eqError) {
      return NextResponse.json({ error: eqError.message }, { status: 500 })
    }

    for (const eq of equipment || []) {
      const lastMaint = eq.last_maintenance ? new Date(eq.last_maintenance) : null
      const lastNotified = eq.maintenance_last_notified ? new Date(eq.maintenance_last_notified) : null

      // Skip if no last_maintenance date (first maintenance not done yet)
      if (!lastMaint) continue

      const daysSinceMaint = Math.floor(
        (now.getTime() - lastMaint.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Check if maintenance is due
      if (daysSinceMaint >= eq.maintenance_interval_days) {
        // Avoid duplicate notifications (only notify once per day)
        if (lastNotified) {
          const daysSinceNotified = Math.floor(
            (now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (daysSinceNotified < 1) continue
        }

        // Check if there's already an active maintenance alert
        const { data: existing } = await supabase
          .from("alerts")
          .select("id")
          .eq("user_id", eq.user_id)
          .eq("entity_type", "equipment")
          .eq("entity_id", eq.id)
          .eq("type", "maintenance")
          .eq("is_dismissed", false)
          .limit(1)

        if (existing && existing.length > 0) continue

        // Create maintenance alert
        const equipmentName = eq.brand ? `${eq.brand} ${eq.model}` : eq.model
        const { error: alertError } = await supabase.from("alerts").insert({
          user_id: eq.user_id,
          type: "maintenance",
          entity_type: "equipment",
          entity_id: eq.id,
          title: `Mantenimiento pendiente: ${equipmentName}`,
          message: `Han pasado ${daysSinceMaint} dias desde el ultimo mantenimiento`,
          priority: daysSinceMaint >= eq.maintenance_interval_days * 2 ? "high" : "normal",
        })

        if (!alertError) {
          alertsCreated.push(eq.id)

          // Update last notified
          await supabase
            .from("equipment")
            .update({ maintenance_last_notified: now.toISOString() })
            .eq("id", eq.id)
        }
      }
    }

    return NextResponse.json({
      success: true,
      alertsCreated: alertsCreated.length,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
