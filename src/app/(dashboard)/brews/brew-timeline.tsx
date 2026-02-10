"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react"
import { useState, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import type { Brew } from "./actions"

interface BrewTimelineProps {
  brews: Brew[]
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
}

function getDayName(date: Date): string {
  return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
}

export function BrewTimeline({ brews }: BrewTimelineProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    // Start with the most recent brew's month or current month
    if (brews.length > 0) {
      return new Date(brews[0].brewed_at)
    }
    return new Date()
  })

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Group brews by day for the current month
  const brewsByDay = useMemo(() => {
    const map = new Map<number, Brew[]>()

    brews.forEach((brew) => {
      const date = new Date(brew.brewed_at)
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const day = date.getDate()
        if (!map.has(day)) {
          map.set(day, [])
        }
        map.get(day)!.push(brew)
      }
    })

    return map
  }, [brews, currentMonth, currentYear])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  // Generate days array (reverse order for timeline)
  const days = Array.from({ length: daysInMonth }, (_, i) => daysInMonth - i)
    .filter((day) => {
      // Only show days up to today if current month
      if (isCurrentMonth) {
        return day <= today.getDate()
      }
      return true
    })

  function prevMonth() {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  function nextMonth() {
    const next = new Date(currentYear, currentMonth + 1, 1)
    if (next <= new Date()) {
      setCurrentDate(next)
    }
  }

  const canGoNext = new Date(currentYear, currentMonth + 1, 1) <= new Date()

  // Calculate stats for the month
  const monthBrews = brews.filter((brew) => {
    const date = new Date(brew.brewed_at)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
  const daysWithBrews = brewsByDay.size
  const avgBrewsPerDay = daysWithBrews > 0 ? (monthBrews.length / daysWithBrews).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold capitalize">
            {formatMonthYear(currentDate)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {monthBrews.length} brews en {daysWithBrews} dias · {avgBrewsPerDay} por dia
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} disabled={!canGoNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-border" />

        {days.map((day) => {
          const dayDate = new Date(currentYear, currentMonth, day)
          const dayBrews = brewsByDay.get(day) || []
          const hasBrews = dayBrews.length > 0
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div key={day} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Date Column */}
              <div className="w-10 shrink-0 text-right">
                <span className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>
                  {day}
                </span>
                <p className="text-xs text-muted-foreground uppercase">
                  {getDayName(dayDate)}
                </p>
              </div>

              {/* Timeline Dot */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    hasBrews
                      ? "bg-primary border-primary"
                      : "bg-background border-muted-foreground/30"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 -mt-1">
                {hasBrews ? (
                  <div className="space-y-2">
                    {dayBrews.map((brew) => (
                      <TimelineBrewCard key={brew.id} brew={brew} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-1">
                    Sin preparaciones
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineBrewCard({ brew }: { brew: Brew }) {
  const methodConfig = getBrewMethodConfig(brew.brew_method)
  const MethodIcon = methodConfig.icon
  const ratio = brew.ratio?.toFixed(1) || (brew.water_grams / brew.dose_grams).toFixed(1)

  return (
    <Link href={`/brews/${brew.id}`}>
      <div className="group p-3 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all">
        <div className="flex items-start gap-3">
          {/* Method Badge */}
          <div className={`p-2 rounded-lg ${methodConfig.bgColor} shrink-0`}>
            <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${methodConfig.bgColor} ${methodConfig.color}`}>
                {methodConfig.label}
              </span>
              {brew.rating && (
                <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  {brew.rating}
                </span>
              )}
            </div>

            <h4 className="font-medium mt-1 truncate group-hover:text-primary transition-colors">
              {brew.beans?.name || "Cafe desconocido"}
            </h4>

            <p className="text-sm text-muted-foreground">
              {brew.dose_grams}g · 1:{ratio} · {brew.water_temperature || "?"}°C
            </p>

            {/* Notes preview */}
            {brew.notes && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic flex items-start gap-1">
                <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                {brew.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
