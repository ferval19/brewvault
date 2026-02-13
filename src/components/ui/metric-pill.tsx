import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricPillProps {
  icon?: LucideIcon
  value: string | number
  label?: string
  variant?: "default" | "muted" | "highlight" | "success" | "warning"
  size?: "sm" | "md"
  className?: string
}

const variantStyles = {
  default: "bg-white/35 dark:bg-white/[0.06] text-foreground border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
  muted: "bg-muted/30 text-muted-foreground",
  highlight: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-coffee-500/10 text-coffee-600 dark:text-coffee-400",
}

const sizeStyles = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-2.5 py-1.5 text-sm gap-1.5",
}

export function MetricPill({
  icon: Icon,
  value,
  label,
  variant = "default",
  size = "md",
  className,
}: MetricPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
      <span className="font-semibold">{value}</span>
      {label && (
        <span className={cn("opacity-70", size === "sm" ? "text-[10px]" : "text-xs")}>
          {label}
        </span>
      )}
    </div>
  )
}

interface MetricRowProps {
  children: React.ReactNode
  className?: string
}

export function MetricRow({ children, className }: MetricRowProps) {
  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      {children}
    </div>
  )
}
