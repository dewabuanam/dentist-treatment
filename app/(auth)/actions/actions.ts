"use server"

import { createServerClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAction(formData: FormData) {
  const supabase = createServerClient()
  const session = await getSession()
  const userId = session?.userId

  const actionTypeId = formData.get("actionTypeId") as string
  const patientName = formData.get("patientName") as string
  const category = formData.get("category") as string
  const isApproved = formData.get("isApproved") === "on"
  const notes = formData.get("notes") as string
  const treatmentStatus = formData.get("treatmentStatus") as string || "pending"

  if (!actionTypeId || !patientName || !category) {
    return { error: "Semua field wajib diisi" }
  }

  const { error } = await supabase.from("dental_actions").insert([
    {
      action_type_id: actionTypeId,
      patient_name: patientName,
      category,
      is_approved: isApproved,
      treatment_status: treatmentStatus,
      notes,
      created_by: userId,
    },
  ])

  if (error) {
    console.error("Error creating action:", error)
    return { error: "Gagal menyimpan tindakan" }
  }

  revalidatePath("/actions")
  redirect("/actions")
}

export async function updateAction(formData: FormData) {
  const supabase = createServerClient()
  const session = await getSession()
  const userId = session?.userId

  const id = formData.get("id") as string
  const actionTypeId = formData.get("actionTypeId") as string
  const patientName = formData.get("patientName") as string
  const category = formData.get("category") as string
  const isApproved = formData.get("isApproved") === "on"
  const notes = formData.get("notes") as string
  const treatmentStatus = formData.get("treatmentStatus") as string || "pending"

  if (!id || !actionTypeId || !patientName || !category) {
    return { error: "Semua field wajib diisi" }
  }

  const { error } = await supabase
    .from("dental_actions")
    .update({
      action_type_id: actionTypeId,
      patient_name: patientName,
      category,
      is_approved: isApproved,
      treatment_status: treatmentStatus,
      notes,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating action:", error)
    return { error: "Gagal memperbarui tindakan" }
  }

  revalidatePath("/actions")
  redirect("/actions")
}

export async function deleteAction(formData: FormData) {
  const supabase = createServerClient()

  const id = formData.get("id") as string

  if (!id) {
    return { error: "ID tindakan tidak valid" }
  }

  const { error } = await supabase.from("dental_actions").delete().eq("id", id)

  if (error) {
    console.error("Error deleting action:", error)
    return { error: "Gagal menghapus tindakan" }
  }

  revalidatePath("/actions")
}
