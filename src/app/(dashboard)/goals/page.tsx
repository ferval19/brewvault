import { Target } from "lucide-react"
import { getGoalsWithProgress } from "./actions"
import { GoalsWidget } from "@/components/goals/goals-widget"

export const metadata = { title: "Objetivos" }

export default async function GoalsPage() {
  const result = await getGoalsWithProgress()
  const goals = result.success ? result.data : []

  const achieved = goals.filter((g) => g.achieved).length
  const total = goals.length

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Objetivos</h1>
          <p className="text-sm text-muted-foreground">
            Metas mensuales · se reinician el 1 de cada mes
          </p>
        </div>
        {total > 0 && (
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">{achieved}/{total}</p>
            <p className="text-xs text-muted-foreground">conseguidos</p>
          </div>
        )}
      </div>

      <GoalsWidget goals={goals} />
    </div>
  )
}
