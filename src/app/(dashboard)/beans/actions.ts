"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { beanSchema, type BeanInput } from "@/lib/validations/beans"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type Bean = {
  id: string
  user_id: string
  name: string
  roaster_id: string | null
  origin_country: string | null
  origin_region: string | null
  farm: string | null
  altitude: number | null
  variety: string | null
  process: string | null
  roast_level: string | null
  roast_date: string | null
  flavor_notes: string[] | null
  sca_score: number | null
  weight_grams: number | null
  current_weight_grams: number | null
  price: number | null
  currency: string | null
  photo_url: string | null
  barcode: string | null
  certifications: string[] | null
  personal_rating: number | null
  status: string
  created_at: string
  updated_at: string
  roasters: { id: string; name: string } | null
}

export type Roaster = {
  id: string
  name: string
}

export async function getBeans(): Promise<ActionResult<Bean[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("beans")
    .select(`
      *,
      roasters (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Bean[] }
}

export async function getBean(id: string): Promise<ActionResult<Bean>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("beans")
    .select(`
      *,
      roasters (
        id,
        name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Bean }
}

export async function createBean(
  input: BeanInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = beanSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const beanData = {
    ...validatedFields.data,
    user_id: userData.user.id,
    current_weight_grams: validatedFields.data.weight_grams,
    roaster_id: validatedFields.data.roaster_id || null,
  }

  const { error } = await supabase.from("beans").insert(beanData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/beans")
  return { success: true, data: undefined }
}

export async function updateBean(
  id: string,
  input: BeanInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = beanSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase
    .from("beans")
    .update({
      ...validatedFields.data,
      roaster_id: validatedFields.data.roaster_id || null,
    })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/beans")
  revalidatePath(`/beans/${id}`)
  return { success: true, data: undefined }
}

export async function deleteBean(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("beans")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/beans")
  return { success: true, data: undefined }
}

export async function getRoasters(): Promise<ActionResult<Roaster[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("roasters")
    .select("id, name")
    .order("name")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Roaster[] }
}

export async function uploadCoffeePhoto(
  formData: FormData
): Promise<ActionResult<string>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "No se recibio archivo" }
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("coffee-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data: urlData } = supabase.storage
    .from("coffee-photos")
    .getPublicUrl(fileName)

  return { success: true, data: urlData.publicUrl }
}

export async function deleteCoffeePhoto(
  photoUrl: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Extract file path from URL
  const urlParts = photoUrl.split("/coffee-photos/")
  if (urlParts.length !== 2) {
    return { success: false, error: "URL invalida" }
  }

  const filePath = urlParts[1]

  // Verify the file belongs to the user
  if (!filePath.startsWith(userData.user.id)) {
    return { success: false, error: "No autorizado" }
  }

  const { error } = await supabase.storage
    .from("coffee-photos")
    .remove([filePath])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: undefined }
}
