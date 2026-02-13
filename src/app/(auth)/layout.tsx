import { Coffee } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100/80 dark:bg-neutral-950 mesh-gradient p-4">
      <div className="flex items-center gap-2 mb-8">
        <Coffee className="h-8 w-8 text-coffee-600" />
        <span className="text-2xl font-bold">BrewVault</span>
      </div>
      <div className="w-full max-w-md glass-panel rounded-3xl p-8">{children}</div>
    </div>
  )
}
