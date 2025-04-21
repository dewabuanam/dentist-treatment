import { createServerClient } from "@/lib/supabase/server"
import ActionForm from "../../action-form"
import { notFound } from "next/navigation"

export default async function EditActionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  const { data: action, error: actionError } = await supabase
    .from("dental_actions")
    .select("*")
    .eq("id", params.id)
    .single()

  if (actionError || !action) {
    notFound()
  }

  const { data: actionTypes, error: typesError } = await supabase.from("action_types").select("id, name").order("name")

  if (typesError) {
    console.error("Error fetching action types:", typesError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Tindakan</h2>
        <p className="text-muted-foreground">Perbarui data tindakan dokter gigi</p>
      </div>

      <ActionForm actionTypes={actionTypes || []} action={action} />
    </div>
  )
}
