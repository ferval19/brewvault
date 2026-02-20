"use client"

import { useState, useTransition, useEffect } from "react"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Coffee,
  TrendingUp,
  Star,
  Package,
  BarChart2,
  Globe,
  Flame,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { brewMethods } from "@/lib/validations/brews"
import {
  getAnalyticsData,
  type AnalyticsData,
  type DateRange,
} from "./actions"

// ----- Colores -----
const CHART_COLORS = [
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

// ----- Hook mounted -----
function useIsMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

// ----- Rangos de fecha -----
const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1A" },
  { value: "all", label: "Todo" },
]

// ----- KPI Card -----
function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 glass-panel">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 truncate">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-xl shrink-0", color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

// ----- Empty state -----
function EmptyChart({ height = 180 }: { height?: number }) {
  return (
    <div
      className="flex items-center justify-center text-muted-foreground text-sm"
      style={{ height }}
    >
      Sin datos para este periodo
    </div>
  )
}

// ----- Gráfica 1: Actividad de brews -----
function BrewsOverTimeChart({
  data,
  mounted,
}: {
  data: { date: string; count: number }[]
  mounted: boolean
}) {
  const hasData = data.some((d) => d.count > 0)

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Actividad de brews</CardTitle>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBrews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v) => [`${v}`, "Brews"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#gradBrews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 2: Consumo de café -----
function ConsumptionChart({
  data,
  mounted,
}: {
  data: { date: string; grams: number }[]
  mounted: boolean
}) {
  const hasData = data.some((d) => d.grams > 0)
  const total = data.reduce((s, d) => s + d.grams, 0)

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Consumo de café</CardTitle>
          {hasData && (
            <p className="text-2xl font-bold mt-1">{total}g</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Package className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradGrams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v) => [`${v}g`, "Gramos usados"]}
                />
                <Area
                  type="monotone"
                  dataKey="grams"
                  stroke="#fb923c"
                  strokeWidth={2}
                  fill="url(#gradGrams)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart height={144} />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 3: Tendencia de rating -----
function RatingTrendChart({
  data,
  mounted,
}: {
  data: { date: string; avgRating: number | null }[]
  mounted: boolean
}) {
  const hasData = data.some((d) => d.avgRating !== null)
  const chartData = data.map((d) => ({
    ...d,
    avgRating: d.avgRating ?? undefined,
  }))

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Tendencia de rating</CardTitle>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Star className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v) => [`${v}/5`, "Rating promedio"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ fill: "#fbbf24", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 4: Distribución de métodos (donut) -----
function MethodDistributionChart({
  data,
  mounted,
}: {
  data: { method: string; label: string; count: number }[]
  mounted: boolean
}) {
  const hasData = data.length > 0
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Métodos de preparación</CardTitle>
        <div className="p-2 rounded-xl bg-coffee-500/10">
          <Coffee className="h-4 w-4 text-coffee-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="flex gap-4 items-center">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v, _n, props) => [
                      `${v} (${Math.round(((v as number) / total) * 100)}%)`,
                      props.payload.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {data.slice(0, 6).map((item, i) => (
                <div key={item.method} className="flex items-center gap-2 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="truncate text-muted-foreground flex-1">
                    {item.label}
                  </span>
                  <span className="font-medium shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 5: Rating por método -----
function RatingByMethodChart({
  data,
  mounted,
}: {
  data: { label: string; avgRating: number; count: number }[]
  mounted: boolean
}) {
  const hasData = data.length > 0

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Rating por método</CardTitle>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Star className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  formatter={(v, _n, props) => [
                    `${v}/5 (${props.payload.count} brews)`,
                    "Rating promedio",
                  ]}
                />
                <Bar dataKey="avgRating" fill="#f59e0b" radius={[0, 6, 6, 0]}>
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 6: Top cafés -----
function TopBeansChart({
  data,
  mounted,
}: {
  data: { name: string; avgRating: number; count: number }[]
  mounted: boolean
}) {
  const hasData = data.length > 0

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Top cafés por rating</CardTitle>
        <div className="p-2 rounded-xl bg-green-500/10">
          <Package className="h-4 w-4 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-3">
            {data.map((bean, i) => (
              <div key={bean.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground w-4">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{bean.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {bean.count} {bean.count === 1 ? "brew" : "brews"}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-amber-500 rounded-full text-xs"
                    >
                      ★ {bean.avgRating}
                    </Badge>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(bean.avgRating / 5) * 100}%`,
                      backgroundColor:
                        CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 7: Distribución por tueste -----
function RoastDistributionChart({
  data,
  mounted,
}: {
  data: { roast: string; label: string; count: number }[]
  mounted: boolean
}) {
  const hasData = data.length > 0

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Nivel de tueste</CardTitle>
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [`${v}`, "Brews"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Gráfica 8: Origen del café -----
function OriginDistributionChart({
  data,
  mounted,
}: {
  data: { country: string; count: number }[]
  mounted: boolean
}) {
  const hasData = data.length > 0

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Origen del café</CardTitle>
        <div className="p-2 rounded-xl bg-blue-500/10">
          <Globe className="h-4 w-4 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        {hasData && mounted ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [`${v}`, "Brews"]}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  )
}

// ----- Dashboard principal -----
export function AnalyticsDashboard({
  initialData,
  initialRange,
}: {
  initialData: AnalyticsData
  initialRange: DateRange
}) {
  const mounted = useIsMounted()
  const [data, setData] = useState<AnalyticsData>(initialData)
  const [range, setRange] = useState<DateRange>(initialRange)
  const [method, setMethod] = useState<string>("all")
  const [isPending, startTransition] = useTransition()

  function handleRangeChange(newRange: DateRange) {
    setRange(newRange)
    startTransition(async () => {
      const result = await getAnalyticsData(
        newRange,
        method !== "all" ? method : undefined
      )
      if (result.success) setData(result.data)
    })
  }

  function handleMethodChange(newMethod: string) {
    setMethod(newMethod)
    startTransition(async () => {
      const result = await getAnalyticsData(
        range,
        newMethod !== "all" ? newMethod : undefined
      )
      if (result.success) setData(result.data)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header + filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BarChart2 className="h-7 w-7 text-amber-500" />
            Análisis
          </h1>
          <p className="text-muted-foreground mt-1">
            Estadísticas de tus preparaciones
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Selector de método */}
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-40 rounded-2xl">
              <SelectValue placeholder="Todos los métodos" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Todos los métodos</SelectItem>
              {brewMethods.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selector de rango de fechas */}
          <div className="flex items-center bg-white/40 dark:bg-white/[0.06] rounded-2xl p-1 gap-1">
            {DATE_RANGES.map((dr) => (
              <button
                key={dr.value}
                onClick={() => handleRangeChange(dr.value)}
                disabled={isPending}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  range === dr.value
                    ? "bg-white dark:bg-white/20 text-neutral-900 dark:text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {dr.label}
              </button>
            ))}
          </div>

          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total brews"
          value={data.totalBrews.toString()}
          icon={Coffee}
          color="bg-amber-500/10 text-amber-600"
        />
        <KpiCard
          title="Rating promedio"
          value={data.avgRating ? `${data.avgRating}/5` : "—"}
          subtitle={
            data.avgRating
              ? "★".repeat(Math.round(data.avgRating)) +
                "☆".repeat(5 - Math.round(data.avgRating))
              : undefined
          }
          icon={Star}
          color="bg-amber-500/10 text-amber-500"
        />
        <KpiCard
          title="Café consumido"
          value={
            data.totalGrams >= 1000
              ? `${(data.totalGrams / 1000).toFixed(1)}kg`
              : `${data.totalGrams}g`
          }
          icon={Package}
          color="bg-orange-500/10 text-orange-500"
        />
        <KpiCard
          title="Método favorito"
          value={data.favoriteMethod?.label ?? "—"}
          subtitle={
            data.favoriteMethod
              ? `${data.favoriteMethod.count} veces`
              : undefined
          }
          icon={TrendingUp}
          color="bg-green-500/10 text-green-600"
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BrewsOverTimeChart data={data.brewsOverTime} mounted={mounted} />
        <ConsumptionChart data={data.consumptionOverTime} mounted={mounted} />
        <RatingTrendChart data={data.ratingOverTime} mounted={mounted} />
        <MethodDistributionChart
          data={data.methodDistribution}
          mounted={mounted}
        />
        <RatingByMethodChart data={data.ratingByMethod} mounted={mounted} />
        <TopBeansChart data={data.topBeans} mounted={mounted} />
        <RoastDistributionChart
          data={data.roastDistribution}
          mounted={mounted}
        />
        <OriginDistributionChart
          data={data.originDistribution}
          mounted={mounted}
        />
      </div>
    </div>
  )
}
