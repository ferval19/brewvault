import { getAnalyticsData } from "./actions"
import { getGoalsWithProgress } from "@/app/(dashboard)/goals/actions"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { GoalsWidget } from "@/components/goals/goals-widget"

export const metadata = {
  title: "Análisis",
}

export default async function AnalyticsPage() {
  const [result, goalsResult] = await Promise.all([
    getAnalyticsData("30d"),
    getGoalsWithProgress(),
  ])

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const goals = goalsResult.success ? goalsResult.data : []

  return (
    <div className="space-y-6">
      <AnalyticsDashboard initialData={result.data} initialRange="30d" />
      <GoalsWidget goals={goals} />
    </div>
  )
}
