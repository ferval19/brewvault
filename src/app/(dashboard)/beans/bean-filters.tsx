"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BeanFiltersProps {
  currentStatus: string
}

export function BeanFilters({ currentStatus }: BeanFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    router.push(`/beans?${params.toString()}`)
  }

  return (
    <Tabs value={currentStatus} onValueChange={handleStatusChange}>
      <TabsList>
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="active">Activos</TabsTrigger>
        <TabsTrigger value="finished">Agotados</TabsTrigger>
        <TabsTrigger value="archived">Archivados</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
