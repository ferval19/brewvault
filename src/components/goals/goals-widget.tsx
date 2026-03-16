"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Target, Plus, Trash2, Check, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { createGoal, deleteGoal } from "@/app/(dashboard)/goals/actions"
import { GOAL_META, type GoalWithProgress, type GoalType } from "@/app/(dashboard)/goals/types"

interface GoalsWidgetProps {
  goals: GoalWithProgress[]
  compact?: boolean
}

const GOAL_TYPES = Object.entries(GOAL_META) as [GoalType, typeof GOAL_META[GoalType]][]

const monthName = new Date().toLocaleDateString("es-ES", { month: "long" })

export function GoalsWidget({ goals, compact = false }: GoalsWidgetProps) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [newType, setNewType] = useState<GoalType>("brews_count")
  const [newTarget, setNewTarget] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAdd() {
    const val = parseFloat(newTarget)
    if (!val || val <= 0) return
    setIsLoading(true)
    await createGoal(newType, val)
    setIsLoading(false)
    setShowAdd(false)
    setNewTarget("")
    router.refresh()
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteGoal(id)
    setDeletingId(null)
    router.refresh()
  }

  const achieved = goals.filter((g) => g.achieved).length
  const monthCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1)

  return (
    <>
      <div className="rounded-3xl glass-panel overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">
              Objetivos de {monthCapitalized}
            </h3>
            {goals.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {achieved}/{goals.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {goals.length === 0 ? (
            <div className="text-center py-6">
              <Trophy className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sin objetivos este mes</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Añadir objetivo
              </Button>
            </div>
          ) : (
            <div className={cn("space-y-4", compact && "space-y-3")}>
              {goals.map((goal) => {
                const meta = GOAL_META[goal.type]
                const isAchieved = goal.achieved
                return (
                  <div key={goal.id} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {isAchieved && (
                          <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        )}
                        <span className={cn(
                          "text-sm font-medium truncate",
                          isAchieved && "text-green-600 dark:text-green-400"
                        )}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {goal.type === "avg_rating"
                            ? `${goal.current}${meta.unit} / ${goal.target_value}${meta.unit}`
                            : `${goal.current} / ${goal.target_value} ${meta.unit}`}
                        </span>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          disabled={deletingId === goal.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isAchieved
                            ? "bg-green-500"
                            : goal.percentage >= 70
                            ? "bg-amber-500"
                            : "bg-primary/60"
                        )}
                        style={{ width: `${Math.max(goal.percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nuevo objetivo mensual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={newType} onValueChange={(v) => setNewType(v as GoalType)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TYPES.map(([type, meta]) => (
                    <SelectItem key={type} value={type}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {GOAL_META[newType].description}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Objetivo ({GOAL_META[newType].unit})
              </label>
              <Input
                type="number"
                min="0"
                step={newType === "avg_rating" ? "0.1" : "1"}
                max={newType === "avg_rating" ? "5" : undefined}
                placeholder={newType === "avg_rating" ? "ej: 4.0" : "ej: 20"}
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={isLoading || !newTarget}>
              {isLoading ? "Guardando..." : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
