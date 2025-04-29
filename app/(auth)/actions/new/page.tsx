import { createServerClient } from "@/lib/supabase/server"
import ActionForm from "../action-form"
import {getSession} from "@/lib/auth";

export default async function NewActionPage() {
  const supabase = createServerClient()

    const session = await getSession()
    const userId = session?.userId

    if (!userId) {
        return <p>Unauthorized</p>
    }
    const {
        data: actionTypes,
        error
    } = await supabase.from("action_types").select("id, name").eq("created_by", userId).order("name")

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
