import Link from "next/link"
import { Plus, ClipboardList } from "lucide-react"

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notas de Cata</h1>
          <p className="text-muted-foreground">
            {notes.length} {notes.length === 1 ? "nota" : "notas"} guardadas
          </p>
        </div>

        <Link href="/cupping/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva nota
          </Button>
        </Link>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Sin notas de cata</h3>
          <p className="text-muted-foreground mt-2">
            Crea tu primera nota de cata para comenzar
          </p>
          <Link href="/cupping/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nueva nota
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <CuppingNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
