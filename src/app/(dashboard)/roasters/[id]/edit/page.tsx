import { notFound } from "next/navigation"
import { RoasterForm } from "@/components/forms/roaster-form"
import { getRoaster } from "../../actions"

export const metadata = {
  title: "Editar Tostador",
}

export default async function EditRoasterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getRoaster(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Tostador</h1>
        <p className="text-muted-foreground">
          Modifica la informacion del tostador
        </p>
      </div>

      <RoasterForm roaster={result.data} />
    </div>
  )
}
