'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { FilterDropdown } from "./filter-dropdown"

interface ActionsPageClientProps {
  actions: any[]
  currentPage: number
  totalPages: number
  actionTypes: { id: string, name: string }[]
  sortBy: string
}

export default function ActionsPageClient({
  actions,
  currentPage,
  totalPages,
  actionTypes,
  sortBy
}: ActionsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    params.set("search", e.target.value)
    router.push(`/actions?${params.toString()}`)
  }

  const handleActionTypeChange = (value: string) => {
    if (value === "all") params.delete("actionTypeId")
    else if (value) params.set("actionTypeId", value)
    else params.delete("actionTypeId")
    router.push(`/actions?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    params.set("sortBy", value)
    router.push(`/actions?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    params.set("page", String(page))
    router.push(`/actions?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daftar Tindakan</h2>
          <p className="text-muted-foreground">Kelola semua tindakan dokter gigi yang tercatat</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <FilterDropdown />

          <Select onValueChange={handleActionTypeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Jenis Tindakan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {actionTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Cari nama pasien atau catatan"
            onChange={handleSearch}
            defaultValue={searchParams.get("search") || ""}
            className="w-[250px]"
          />

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Urutkan Berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
              <SelectItem value="patient_name">Nama Pasien</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild>
          <Link href="/actions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {actions.length > 0 ? (
          actions.map((action) => (
            <Card key={action.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{action.patient_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={action.is_approved ? "default" : "outline"}>
                      {action.is_approved ? "Disetujui" : "Belum Disetujui"}
                    </Badge>
                    <Badge variant="secondary">
                      {action.treatment_status === "pending" && "Belum Dikerjakan"}
                      {action.treatment_status === "onprogress" && "Sedang Dikerjakan"}
                      {action.treatment_status === "done" && "Selesai"}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {action.action_types?.name} - {action.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {action.notes && <p className="text-sm text-muted-foreground mb-4">{action.notes}</p>}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/actions/${action.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteConfirmationModal id={action.id} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <p className="text-muted-foreground mb-4">Belum ada tindakan yang tercatat</p>
              <Button asChild>
                <Link href="/actions/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Tindakan Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
