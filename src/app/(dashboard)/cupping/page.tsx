import Link from "next/link"
import { Plus, ClipboardList, Star, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getCuppingNotes } from "./actions"
import { CuppingNoteCard } from "./cupping-note-card"

export const metadata = {
  title: "Notas de Cata",
}

export default async function CuppingPage() {
  const result = await getCuppingNotes()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const notes = result.data
  const avgScore = notes.filter((n) => n.total_score).length > 0
    ? notes.filter((n) => n.total_score).reduce((acc, n) => acc + (n.total_score || 0), 0) / notes.filter((n) => n.total_score).length
    : 0

  const highestScore = notes.reduce((max, n) => Math.max(max, n.total_score || 0), 0)

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {notes.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={ClipboardList}
            label="Notas de cata"
            value={notes.length.toString()}
          />
          <StatCard
            icon={Star}
            label="Puntuacion media"
            value={avgScore > 0 ? avgScore.toFixed(0) : "-"}
            suffix="/100"
          />
          <StatCard
            icon={TrendingUp}
            label="Mejor puntuacion"
            value={highestScore > 0 ? highestScore.toString() : "-"}
            suffix="/100"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notas de Cata</h1>
          <p className="text-muted-foreground">
            {notes.length} {notes.length === 1 ? "nota" : "notas"} guardadas
          </p>
        </div>

        <Link href="/cupping/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nueva nota
          </Button>
        </Link>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <CuppingNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/cupping/new"
        className="fixed bottom-24 right-6 sm:hidden z-50"
      >
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {value}
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Icon className="h-5 w-5 text-amber-500" />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 rounded-full bg-amber-500/10 mb-6">
        <ClipboardList className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Sin notas de cata
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Crea tu primera nota de cata para registrar tus evaluaciones de cafe
      </p>
      <Link href="/cupping/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Nueva nota
        </Button>
      </Link>
    </div>
  )
}
