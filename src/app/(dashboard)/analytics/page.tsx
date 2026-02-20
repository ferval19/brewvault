import { getAnalyticsData } from "./actions"
import { AnalyticsDashboard } from "./analytics-dashboard"

export const metadata = {
  title: "Análisis",
}

export default async function AnalyticsPage() {
  const result = await getAnalyticsData("30d")

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  return (
    <AnalyticsDashboard initialData={result.data} initialRange="30d" />
  )
}
