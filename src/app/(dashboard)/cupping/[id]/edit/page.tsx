import { notFound } from "next/navigation"
import { CuppingNoteForm } from "@/components/forms/cupping-note-form"
import { getCuppingNote, getBrewsWithoutCupping } from "../../actions"

export const metadata = {
  title: "Editar Nota de Cata",
}

export default async function EditCuppingNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCuppingNote(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const brewsResult = await getBrewsWithoutCupping(result.data.brew_id)
  const availableBrews = brewsResult.success ? brewsResult.data : []

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Nota de Cata</h1>
        <p className="text-muted-foreground">
          Modifica la evaluacion de tu preparacion
        </p>
      </div>

      <CuppingNoteForm note={result.data} availableBrews={availableBrews} />
    </div>
  )
}
