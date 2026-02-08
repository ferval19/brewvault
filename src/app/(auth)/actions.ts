"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  type LoginInput,
  type SignupInput,
  type ForgotPasswordInput,
} from "@/lib/validations/auth"

export type AuthActionResult = {
  error?: string
  success?: boolean
  message?: string
}

export async function login(data: LoginInput): Promise<AuthActionResult> {
  const validatedFields = loginSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Datos inválidos" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return { error: "Email o contraseña incorrectos" }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(data: SignupInput): Promise<AuthActionResult> {
  const validatedFields = signupSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Datos inválidos" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        full_name: validatedFields.data.fullName,
      },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este email ya está registrado" }
    }
    return { error: "Error al crear la cuenta" }
  }

  return {
    success: true,
    message: "Revisa tu email para confirmar tu cuenta",
  }
}

export async function forgotPassword(
  data: ForgotPasswordInput
): Promise<AuthActionResult> {
  const validatedFields = forgotPasswordSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Email inválido" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedFields.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    }
  )

  if (error) {
    return { error: "Error al enviar el email" }
  }

  return {
    success: true,
    message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña",
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  })

  if (error) {
    return { error: "Error al iniciar sesión" }
  }

  if (data.url) {
    redirect(data.url)
  }
}
