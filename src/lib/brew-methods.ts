import {
  Coffee,
  Beaker,
  FlaskConical,
  Flame,
  Snowflake,
  CircleDot,
  Droplets,
  type LucideIcon,
} from "lucide-react"

export type BrewMethodConfig = {
  value: string
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  gradient: string
}

export const brewMethodConfigs: Record<string, BrewMethodConfig> = {
  v60: {
    value: "v60",
    label: "V60",
    icon: FlaskConical,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  chemex: {
    value: "chemex",
    label: "Chemex",
    icon: FlaskConical,
    color: "text-amber-500",
    bgColor: "bg-amber-400/10",
    gradient: "from-amber-400/20 to-yellow-500/20",
  },
  aeropress: {
    value: "aeropress",
    label: "AeroPress",
    icon: Beaker,
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    gradient: "from-gray-400/20 to-slate-500/20",
  },
  french_press: {
    value: "french_press",
    label: "French Press",
    icon: Beaker,
    color: "text-amber-700",
    bgColor: "bg-amber-600/10",
    gradient: "from-amber-600/20 to-orange-600/20",
  },
  moka: {
    value: "moka",
    label: "Moka",
    icon: Flame,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  espresso: {
    value: "espresso",
    label: "Espresso",
    icon: Coffee,
    color: "text-amber-800",
    bgColor: "bg-amber-700/10",
    gradient: "from-amber-700/20 to-brown-600/20",
  },
  cold_brew: {
    value: "cold_brew",
    label: "Cold Brew",
    icon: Snowflake,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    gradient: "from-blue-400/20 to-cyan-500/20",
  },
  clever: {
    value: "clever",
    label: "Clever Dripper",
    icon: Droplets,
    color: "text-teal-600",
    bgColor: "bg-teal-500/10",
    gradient: "from-teal-500/20 to-emerald-500/20",
  },
  kalita: {
    value: "kalita",
    label: "Kalita Wave",
    icon: CircleDot,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
  siphon: {
    value: "siphon",
    label: "Siphon",
    icon: Beaker,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  turkish: {
    value: "turkish",
    label: "Cafe Turco",
    icon: Flame,
    color: "text-orange-700",
    bgColor: "bg-orange-600/10",
    gradient: "from-orange-600/20 to-red-600/20",
  },
  other: {
    value: "other",
    label: "Otro",
    icon: Coffee,
    color: "text-gray-500",
    bgColor: "bg-gray-400/10",
    gradient: "from-gray-400/20 to-slate-400/20",
  },
}

export function getBrewMethodConfig(method: string): BrewMethodConfig {
  return (
    brewMethodConfigs[method] || {
      value: method,
      label: method,
      icon: Coffee,
      color: "text-gray-500",
      bgColor: "bg-gray-400/10",
      gradient: "from-gray-400/20 to-slate-400/20",
    }
  )
}
