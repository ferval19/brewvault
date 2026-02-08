import { Coffee } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Coffee className="h-8 w-8" />
        <span className="text-2xl font-bold">BrewVault</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
