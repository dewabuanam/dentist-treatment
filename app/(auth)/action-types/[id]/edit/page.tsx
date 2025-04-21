import { createServerClient } from "@/lib/supabase/server"
import ActionTypeForm from "../../action-type-form"
import { notFound } from "next/navigation"

export default async function EditActionTypePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  const { data: actionType, error } = await supabase.from("action_types").select("*").eq("id", params.id).single()

  if (error || !actionType) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Jenis Tindakan</h2>
        <p className="text-muted-foreground">Perbarui data jenis tindakan dokter gigi</p>
      </div>

      <ActionTypeForm actionType={actionType} />
    </div>
  )
}
