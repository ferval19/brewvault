"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, TrendingUp, Star, Package } from "lucide-react"
import { brewMethods } from "@/lib/validations/brews"

const METHOD_COLORS = [
  "#f59e0b",
  "#fb923c",
  "#10b981",
  "#6366f1",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
]

const TOOLTIP_STYLE = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--color-foreground)",
}

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  return isMounted
}

interface ChartProps {
  brewsPerDay: { day: string; count: number }[]
  ratingDistribution: { rating: number; count: number }[]
  coffeeConsumption: { week: string; grams: number }[]
  ratingByMethod: { method: string; avgRating: number; count: number }[]
}

export function BrewsPerDayChart({ data }: { data: { day: string; count: number }[] }) {
  const isMounted = useIsMounted()
  const hasData = data.some(d => d.count > 0)
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Actividad semanal</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 días</p>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  opacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  domain={[0, maxCount + 1]}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v) => [`${v}`, "Preparaciones"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#gradActivity)"
                  dot={{ fill: "#f59e0b", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#d97706" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="h-8 w-8 opacity-20" />
            <span>Sin preparaciones esta semana</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RatingDistributionChart({ data }: { data: { rating: number; count: number }[] }) {
  const hasData = data.some(d => d.count > 0)
  const totalRatings = data.reduce((sum, d) => sum + d.count, 0)
  const sorted = [...data].sort((a, b) => b.rating - a.rating)

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Distribución de ratings</CardTitle>
          {hasData && (
            <p className="text-xs text-muted-foreground mt-0.5">{totalRatings} valorados</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Star className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-2.5 pt-1">
            {sorted.map((item) => {
              const percentage = totalRatings > 0 ? (item.count / totalRatings) * 100 : 0
              // Color: 5★ amber, 4★ amber-light, 3★ orange, 2★ red-orange, 1★ red
              const colors = ["", "#ef4444", "#f97316", "#f59e0b", "#fbbf24", "#4ade80"]
              const color = colors[item.rating] || "#f59e0b"
              return (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="w-10 text-xs font-semibold shrink-0" style={{ color }}>
                    {"★".repeat(item.rating)}
                  </div>
                  <div className="flex-1 h-5 bg-white/30 dark:bg-white/[0.07] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 w-14 text-right shrink-0">
                    <span className="text-xs font-medium ml-auto">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      {percentage > 0 ? `${Math.round(percentage)}%` : ""}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <Star className="h-8 w-8 opacity-20" />
            <span>Sin ratings registrados</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CoffeeConsumptionChart({ data }: { data: { week: string; grams: number }[] }) {
  const isMounted = useIsMounted()
  const hasData = data.some(d => d.grams > 0)
  const totalGrams = data.reduce((sum, d) => sum + d.grams, 0)
  const display = totalGrams >= 1000
    ? `${(totalGrams / 1000).toFixed(1)}kg`
    : `${totalGrams}g`

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Consumo de café</CardTitle>
          {hasData && (
            <>
              <p className="text-2xl font-bold mt-1">{display}</p>
              <p className="text-xs text-muted-foreground">últimos 7 días</p>
            </>
          )}
        </div>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Package className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradGrams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v) => [`${v}g`, "Café usado"]}
                />
                <Area
                  type="monotone"
                  dataKey="grams"
                  stroke="#fb923c"
                  strokeWidth={2.5}
                  fill="url(#gradGrams)"
                  dot={{ fill: "#fb923c", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#ea580c" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-28 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <Package className="h-8 w-8 opacity-20" />
            <span>Sin datos de consumo</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RatingByMethodChart({ data }: { data: { method: string; avgRating: number; count: number }[] }) {
  const isMounted = useIsMounted()
  const hasData = data.length > 0

  const dataWithLabels = data.map((item) => ({
    ...item,
    methodLabel: brewMethods.find((m) => m.value === item.method)?.label || item.method,
  }))

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Rating por método</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Media de valoraciones</p>
        </div>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Coffee className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataWithLabels}
                layout="vertical"
                margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="methodLabel"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={78}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v, _n, props) => [
                    `${v}/5 · ${(props.payload as { count: number }).count} brews`,
                    "Rating",
                  ]}
                />
                <Bar dataKey="avgRating" radius={[0, 6, 6, 0]}>
                  {dataWithLabels.map((_, i) => (
                    <Cell
                      key={i}
                      fill={METHOD_COLORS[i % METHOD_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
            <Coffee className="h-8 w-8 opacity-20" />
            <span>Sin datos de rating por método</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardCharts({ charts }: { charts: ChartProps }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <BrewsPerDayChart data={charts.brewsPerDay} />
      <RatingDistributionChart data={charts.ratingDistribution} />
      <CoffeeConsumptionChart data={charts.coffeeConsumption} />
      <RatingByMethodChart data={charts.ratingByMethod} />
    </div>
  )
}
