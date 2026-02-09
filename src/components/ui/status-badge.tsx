import { cn } from "@/lib/utils"

type Status = "active" | "finished" | "archived" | "wishlist" | "low_stock"

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: "Activo",
    className: "bg-emerald-500/90 text-white",
  },
  finished: {
    label: "Agotado",
    className: "bg-neutral-500/90 text-white",
  },
  archived: {
    label: "Archivado",
    className: "bg-amber-500/90 text-white",
  },
  wishlist: {
    label: "Wishlist",
    className: "bg-purple-500/90 text-white",
  },
  low_stock: {
    label: "Stock bajo",
    className: "bg-red-500/90 text-white",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
