"use client"

import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DetailPageHeroProps {
  title: string
  subtitle?: string
  backHref: string
  backLabel?: string
  editHref?: string
  gradient: string
  badges?: React.ReactNode
  imageUrl?: string | null
  fallbackIcon?: React.ReactNode
  rating?: number
  children?: React.ReactNode
}

export function DetailPageHero({
  title,
  subtitle,
  backHref,
  backLabel = "Volver",
  editHref,
  gradient,
  badges,
  imageUrl,
  fallbackIcon,
  rating,
  children,
}: DetailPageHeroProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br", gradient)}>
      {imageUrl ? (
        <div className="relative aspect-[21/9] sm:aspect-[3/1]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
          {fallbackIcon || <div className="text-8xl opacity-20">☕</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          {editHref && (
            <Link href={editHref}>
              <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {badges && (
            <div className="flex flex-wrap items-center gap-2">
              {badges}
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 drop-shadow">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

interface DetailBadgeProps {
  children: React.ReactNode
  variant?: "default" | "amber" | "coffee"
}

export function DetailBadge({ children, variant = "default" }: DetailBadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        variant === "default"
          ? "bg-white/90 dark:bg-black/60"
          : "bg-coffee-500/90 text-white"
      )}
    >
      {children}
    </span>
  )
}

interface DetailMetricCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  subvalue?: string
  className?: string
}

export function DetailMetricCard({
  icon: Icon,
  label,
  value,
  subvalue,
  className,
}: DetailMetricCardProps) {
  return (
    <div className={cn("rounded-3xl glass-panel p-5", className)}>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {subvalue && <span className="text-sm text-muted-foreground ml-1">{subvalue}</span>}
      </p>
    </div>
  )
}

interface DetailMetricGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function DetailMetricGrid({ children, columns = 4, className }: DetailMetricGridProps) {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {children}
    </div>
  )
}

interface DetailSectionProps {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
}

export function DetailSection({ title, icon: Icon, children, className }: DetailSectionProps) {
  return (
    <div className={cn("rounded-3xl glass-panel overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-white/15 dark:border-white/[0.04] bg-white/30 dark:bg-white/[0.04]">
        <h3 className="font-semibold flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: React.ReactNode
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/15 dark:border-white/[0.04] last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
