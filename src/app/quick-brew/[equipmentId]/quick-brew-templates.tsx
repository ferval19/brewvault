"use client"

import { useState } from "react"
import { Zap, Check, Coffee, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import { createBrew, type FavoriteBrew, type BeanOption } from "@/app/(dashboard)/brews/actions"

interface QuickBrewTemplatesProps {
  favorites: FavoriteBrew[]
  beans: BeanOption[]
  equipmentId: string
}

type CardState = "idle" | "loading" | "success" | "error"

export function QuickBrewTemplates({ favorites, beans, equipmentId }: QuickBrewTemplatesProps) {
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({})
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})

  const availableFavorites = favorites.filter(
    (f) => f.bean_id && beans.some((b) => b.id === f.bean_id)
  )

  if (availableFavorites.length === 0) return null

  function setCardState(id: string, state: CardState) {
    setCardStates((prev) => ({ ...prev, [id]: state }))
  }

  async function handleTap(favorite: FavoriteBrew) {
    if (!favorite.bean_id) return
    if (cardStates[favorite.id] === "loading" || cardStates[favorite.id] === "success") return

    setCardState(favorite.id, "loading")
    setCardErrors((prev) => ({ ...prev, [favorite.id]: "" }))

    const result = await createBrew({
      bean_id: favorite.bean_id,
      brew_method: favorite.brew_method,
      dose_grams: favorite.dose_grams || 15,
      water_grams: favorite.water_grams || 250,
      water_temperature: favorite.water_temperature || null,
      grind_size: favorite.grind_size || null,
      total_time_seconds: favorite.total_time_seconds || null,
      bloom_time_seconds: favorite.bloom_time_seconds || null,
      bloom_water_grams: favorite.bloom_water_grams || null,
      filter_type: favorite.filter_type || null,
      equipment_id: equipmentId,
      grinder_id: favorite.grinder_id || null,
    })

    if (!result.success) {
      setCardState(favorite.id, "error")
      setCardErrors((prev) => ({ ...prev, [favorite.id]: result.error }))
      setTimeout(() => setCardState(favorite.id, "idle"), 3000)
      return
    }

    setCardState(favorite.id, "success")
    setTimeout(() => setCardState(favorite.id, "idle"), 2500)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        Recetas rápidas
      </p>

      <div className="space-y-2">
        {availableFavorites.map((favorite) => {
          const state = cardStates[favorite.id] || "idle"
          const methodConfig = getBrewMethodConfig(favorite.brew_method)
          const MethodIcon = methodConfig.icon
          const beanName = favorite.beans?.name

          return (
            <button
              key={favorite.id}
              type="button"
              onClick={() => handleTap(favorite)}
              disabled={state === "loading"}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left active:scale-[0.98]",
                state === "idle" && "bg-neutral-800 border-neutral-700 hover:bg-neutral-750 hover:border-neutral-600",
                state === "loading" && "bg-neutral-800 border-neutral-700 opacity-70 cursor-wait",
                state === "success" && "bg-emerald-950 border-emerald-700",
                state === "error" && "bg-red-950 border-red-800"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                state === "success" ? "bg-emerald-900" : state === "error" ? "bg-red-900" : "bg-neutral-700"
              )}>
                {state === "loading" && (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                )}
                {state === "success" && <Check className="h-5 w-5 text-emerald-400" />}
                {state === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                {state === "idle" && <MethodIcon className={`h-5 w-5 ${methodConfig.color}`} />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {state === "success" ? (
                  <p className="text-sm font-semibold text-emerald-400">¡Brew registrada!</p>
                ) : state === "error" ? (
                  <p className="text-sm font-semibold text-red-400">
                    {cardErrors[favorite.id] || "Error al registrar"}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-white truncate">{favorite.name}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {beanName && <span>{beanName} · </span>}
                      {favorite.dose_grams}g → {favorite.water_grams}g
                      {favorite.water_temperature && ` · ${favorite.water_temperature}°C`}
                    </p>
                  </>
                )}
              </div>

              {/* Arrow */}
              {state === "idle" && (
                <ChevronRight className="h-4 w-4 text-neutral-500 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
