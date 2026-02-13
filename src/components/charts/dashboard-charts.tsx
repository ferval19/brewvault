"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, TrendingUp, Star, Package } from "lucide-react"
import { brewMethods } from "@/lib/validations/brews"

const COLORS = ["#f59e0b", "#fb923c", "#fbbf24", "#d97706", "#b45309", "#92400e"]

// Hook to ensure charts only render after mount (avoids SSR dimension issues)
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
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

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Actividad diaria</CardTitle>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <TrendingUp className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={150}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(value) => [`${value} brews`, "Preparaciones"]}
                />
                <Bar
                  dataKey="count"
                  fill="#d97706"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            {hasData ? "Cargando..." : "Sin datos de preparaciones"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RatingDistributionChart({ data }: { data: { rating: number; count: number }[] }) {
  const hasData = data.some(d => d.count > 0)
  const totalRatings = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Distribucion de ratings</CardTitle>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Star className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-3">
            {data.map((item) => {
              const percentage = totalRatings > 0 ? (item.count / totalRatings) * 100 : 0
              return (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-amber-500">
                    {"★".repeat(item.rating)}
                  </div>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-muted-foreground text-right">
                    {item.count}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Sin ratings registrados
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

  return (
    <Card className="rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Consumo de cafe</CardTitle>
          <p className="text-2xl font-bold mt-1">{totalGrams}g</p>
          <p className="text-xs text-muted-foreground">ultimas 8 semanas</p>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Package className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={100}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(value) => [`${value}g`, "Cafe usado"]}
                />
                <Area
                  type="monotone"
                  dataKey="grams"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGrams)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            {hasData ? "Cargando..." : "Sin datos de consumo"}
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
        <CardTitle className="text-sm font-medium">Rating por metodo</CardTitle>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Coffee className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && isMounted ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={150}>
              <BarChart
                data={dataWithLabels}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis
                  type="category"
                  dataKey="methodLabel"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(value, _name, props) => [
                    `${value}/5 (${(props.payload as { count: number }).count} brews)`,
                    "Rating promedio",
                  ]}
                />
                <Bar
                  dataKey="avgRating"
                  fill="#fb923c"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            {hasData ? "Cargando..." : "Sin datos de ratings por metodo"}
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
