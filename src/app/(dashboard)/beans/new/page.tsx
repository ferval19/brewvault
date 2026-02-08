import { Suspense } from "react"
import { BeanFormWithCatalog } from "./bean-form-with-catalog"
import { getRoasters } from "../actions"

export const metadata = {
  title: "Nuevo Cafe",
}

export default async function NewBeanPage() {
  const roastersResult = await getRoasters()
  const roasters = roastersResult.success ? roastersResult.data : []

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo Cafe</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo cafe a tu boveda
        </p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <BeanFormWithCatalog roasters={roasters} />
      </Suspense>
    </div>
  )
}
