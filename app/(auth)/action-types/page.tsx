import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

export default async function ActionTypesPage() {
  const supabase = createServerClient()

  const session = await getSession()
  const userId = session?.userId

  if (!userId) {
    return <p>Unauthorized</p>
  }

  const { data: actionTypes, error } = await supabase
    .from("action_types")
    .select("*")
    .eq("created_by", userId)
    .order("name")

  if (error) {
    console.error("Error fetching action types:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jenis Tindakan</h2>
          <p className="text-muted-foreground">Kelola daftar jenis tindakan dokter gigi</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button asChild>
          <Link href="/action-types/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Jenis Tindakan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {actionTypes && actionTypes.length > 0 ? (
          actionTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader className="pb-2">
                <CardTitle>{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {type.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {type.description}
                  </p>
                )}
                {type.target && (
                  <p className="text-sm font-medium text-primary mb-4">
                    🎯 Target Total Tindakan: {type.target}
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/action-types/${type.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteConfirmationModal id={type.id} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <p className="text-muted-foreground mb-4">Belum ada jenis tindakan yang tercatat</p>
              <Button asChild>
                <Link href="/action-types/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Jenis Tindakan Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
