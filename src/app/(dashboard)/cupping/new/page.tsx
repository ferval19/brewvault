import { CuppingNoteForm } from "@/components/forms/cupping-note-form"
import { getBrewsWithoutCupping } from "../actions"

export const metadata = {
  title: "Nueva Nota de Cata",
}

export default async function NewCuppingNotePage({
  searchParams,
}: {
  searchParams: Promise<{ brew_id?: string }>
}) {
  const { brew_id } = await searchParams
  const result = await getBrewsWithoutCupping()

  const availableBrews = result.success ? result.data : []

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nueva Nota de Cata</h1>
        <p className="text-muted-foreground">
          Evalua tu preparacion siguiendo el protocolo SCA
        </p>
      </div>

      <CuppingNoteForm
        availableBrews={availableBrews}
        preselectedBrewId={brew_id}
      />
    </div>
  )
}
