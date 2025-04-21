"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "./supabase/server"

// Make sure getSession is properly exported
export async function getSession() {
  const session = cookies().get("session")?.value

  if (!session) {
    return null
  }

  return JSON.parse(session)
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // For this demo, we're using a simple authentication
  // In a real app, you would use proper authentication with hashed passwords
  const supabase = createServerClient()

  // Check if user exists with these credentials
  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("password", password).single()

  if (error || !data) {
    return { error: "Invalid credentials" }
  }

  // Set a session cookie
  cookies().set(
    "session",
    JSON.stringify({
      userId: data.id,
      email: data.email,
      authenticated: true,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  redirect("/dashboard")
}

export async function logout() {
  cookies().delete("session")
  redirect("/login")
}

export async function checkAuth() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect("/login")
  }

  return session
}
