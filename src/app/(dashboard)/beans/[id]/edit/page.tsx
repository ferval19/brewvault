import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { BeanForm } from "@/components/forms/bean-form"
import { getBean, getRoasters } from "../../actions"

export const metadata = {
  title: "Editar Grano",
}

export default async function EditBeanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [beanResult, roastersResult] = await Promise.all([
    getBean(id),
    getRoasters(),
  ])

  if (!beanResult.success || !beanResult.data) {
    notFound()
  }

  const bean = beanResult.data
  const roasters = roastersResult.success ? roastersResult.data || [] : []

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href={`/beans/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver al detalle
        </Link>
        <h1 className="text-3xl font-bold">Editar Grano</h1>
        <p className="text-muted-foreground">{bean.name}</p>
      </div>

      <BeanForm bean={bean} roasters={roasters} />
    </div>
  )
}
