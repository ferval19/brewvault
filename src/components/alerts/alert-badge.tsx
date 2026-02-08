import { cn } from "@/lib/utils"

interface AlertBadgeProps {
  count: number
  className?: string
}

export function AlertBadge({ count, className }: AlertBadgeProps) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center",
        "min-w-[18px] h-[18px] px-1 text-[10px] font-bold",
        "bg-red-500 text-white rounded-full",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
