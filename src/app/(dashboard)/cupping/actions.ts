"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { cuppingNoteSchema, type CuppingNoteInput } from "@/lib/validations/cupping-notes"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type CuppingNote = {
  id: string
  brew_id: string
  fragrance: number | null
  flavor: number | null
  aftertaste: number | null
  acidity: number | null
  body: number | null
  balance: number | null
  sweetness: number | null
  uniformity: number | null
  clean_cup: number | null
  overall: number | null
  total_score: number | null
  flavor_descriptors: string[] | null
  created_at: string
  updated_at: string
  brews: {
    id: string
    brew_method: string
    brewed_at: string
    rating: number | null
    beans: {
      id: string
      name: string
      roasters: { id: string; name: string } | null
    } | null
  } | null
}

export type BrewOption = {
  id: string
  brew_method: string
  brewed_at: string
  beans: {
    name: string
    roasters: { name: string } | null
  } | null
}

const CUPPING_SELECT = `
  *,
  brews (
    id,
    brew_method,
    brewed_at,
    rating,
    beans (
      id,
      name,
      roasters (
        id,
        name
      )
    )
  )
`

export async function getCuppingNotes(): Promise<ActionResult<CuppingNote[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("cupping_notes")
    .select(CUPPING_SELECT)
    .order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as CuppingNote[] }
}

export async function getCuppingNote(id: string): Promise<ActionResult<CuppingNote>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("cupping_notes")
    .select(CUPPING_SELECT)
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as CuppingNote }
}

export async function getCuppingNoteByBrewId(
  brewId: string
): Promise<ActionResult<CuppingNote | null>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("cupping_notes")
    .select(CUPPING_SELECT)
    .eq("brew_id", brewId)
    .maybeSingle()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as CuppingNote | null }
}

export async function createCuppingNote(
  input: CuppingNoteInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = cuppingNoteSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase.from("cupping_notes").insert(validatedFields.data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/cupping")
  revalidatePath("/brews")
  return { success: true, data: undefined }
}

export async function updateCuppingNote(
  id: string,
  input: CuppingNoteInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = cuppingNoteSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  // Exclude brew_id from update — it shouldn't change
  const { brew_id: _, ...updateData } = validatedFields.data

  const { error } = await supabase
    .from("cupping_notes")
    .update(updateData)
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/cupping")
  revalidatePath(`/cupping/${id}`)
  revalidatePath("/brews")
  return { success: true, data: undefined }
}

export async function deleteCuppingNote(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("cupping_notes")
    .delete()
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/cupping")
  revalidatePath("/brews")
  return { success: true, data: undefined }
}

export async function getBrewsWithoutCupping(
  excludeBrewId?: string
): Promise<ActionResult<BrewOption[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Get all brew IDs that already have cupping notes
  const { data: existingNotes, error: notesError } = await supabase
    .from("cupping_notes")
    .select("brew_id")

  if (notesError) {
    return { success: false, error: notesError.message }
  }

  const usedBrewIds = existingNotes
    .map((n) => n.brew_id)
    .filter((id) => id !== excludeBrewId)

  let query = supabase
    .from("brews")
    .select(`
      id,
      brew_method,
      brewed_at,
      beans (
        name,
        roasters (
          name
        )
      )
    `)
    .order("brewed_at", { ascending: false })

  if (usedBrewIds.length > 0) {
    query = query.not("id", "in", `(${usedBrewIds.join(",")})`)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as BrewOption[] }
}
