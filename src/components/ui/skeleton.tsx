import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className
      )}
    />
  )
}

// Card skeleton matching the card structure
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Image placeholder */}
      <Skeleton className="aspect-[16/10] rounded-none" />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Metrics */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Grid of card skeletons
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Detail page hero skeleton
export function DetailHeroSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-muted">
      <Skeleton className="aspect-[21/9] sm:aspect-[3/1] rounded-none" />
    </div>
  )
}

// Metric cards skeleton
export function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

// Form section skeleton
export function FormSectionSkeleton() {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Form fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  )
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}
