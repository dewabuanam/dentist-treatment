import { createServerClient } from "@/lib/supabase/server"
import ActionForm from "../action-form"

export default async function NewActionPage() {
  const supabase = createServerClient()

  const { data: actionTypes, error } = await supabase.from("action_types").select("id, name").order("name")

  if (error) {
    console.error("Error fetching action types:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tambah Tindakan Baru</h2>
        <p className="text-muted-foreground">Catat tindakan dokter gigi baru</p>
      </div>

      <ActionForm actionTypes={actionTypes || []} />
    </div>
  )
}
