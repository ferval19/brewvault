import { RoasterForm } from "@/components/forms/roaster-form"

export const metadata = {
  title: "Nuevo Tostador",
}

export default function NewRoasterPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nuevo Tostador</h1>
        <p className="text-muted-foreground">
          Agrega un tostador a tu coleccion
        </p>
      </div>

      <RoasterForm />
    </div>
  )
}
