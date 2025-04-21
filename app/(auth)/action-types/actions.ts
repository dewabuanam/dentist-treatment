"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export async function createActionType(formData: FormData) {
  const supabase = createServerClient()
  const session = await getSession()

  const userId = session?.userId
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const target = parseInt(formData.get("target")?.toString() || "0", 10)

  if (!name) {
    return { error: "Nama jenis tindakan wajib diisi" }
  }

  const { error } = await supabase.from("action_types").insert([
    {
      name,
      description,
      target,
      created_by: userId,
    },
  ])

  if (error) {
    console.error("Error creating action type:", error)
    return { error: "Gagal menyimpan jenis tindakan" }
  }

  revalidatePath("/action-types")
  redirect("/action-types")
}

export async function updateActionType(formData: FormData) {
  const supabase = createServerClient()
  const session = await getSession()

  const userId = session?.userId
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const target = parseInt(formData.get("target")?.toString() || "0", 10)

  if (!id || !name) {
    return { error: "Nama jenis tindakan wajib diisi" }
  }

  const { error } = await supabase
    .from("action_types")
    .update({
      name,
      description,
      target,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating action type:", error)
    return { error: "Gagal memperbarui jenis tindakan" }
  }

  revalidatePath("/action-types")
  redirect("/action-types")
}

export async function deleteActionType(formData: FormData) {
  const supabase = createServerClient()

  const id = formData.get("id") as string

  if (!id) {
    return { error: "ID jenis tindakan tidak valid" }
  }

  const { data: usedActions, error: checkError } = await supabase
    .from("dental_actions")
    .select("id")
    .eq("action_type_id", id)
    .limit(1)

  if (checkError) {
    console.error("Error checking action type usage:", checkError)
    return { error: "Gagal memeriksa penggunaan jenis tindakan" }
  }

  if (usedActions && usedActions.length > 0) {
    return {
      error: "Jenis tindakan ini sedang digunakan dalam tindakan dokter gigi. Hapus tindakan terkait terlebih dahulu.",
    }
  }

  const { error } = await supabase.from("action_types").delete().eq("id", id)

  if (error) {
    console.error("Error deleting action type:", error)
    return { error: "Gagal menghapus jenis tindakan" }
  }

  revalidatePath("/action-types")
}
