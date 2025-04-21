"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export function FilterDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (type: "filter" | "actionStatus", value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "semua") {
      params.delete(type)
    } else {
      params.set(type, value)
    }
    router.push(`/actions?${params.toString()}`)
  }

  const currentFilter = searchParams.get("filter") || "semua"
  const currentStatus = searchParams.get("actionStatus") || "semua"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-2 py-1 text-sm text-muted-foreground font-semibold">Status Persetujuan</div>
        {["semua", "approved", "not_approved"].map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={currentFilter === option}
            onCheckedChange={() => handleChange("filter", option)}
          >
            {option === "approved" ? "Disetujui" : option === "not_approved" ? "Belum Disetujui" : "Semua"}
          </DropdownMenuCheckboxItem>
        ))}
        <div className="px-2 py-1 text-sm text-muted-foreground font-semibold mt-2">Status Perawatan</div>
        {["semua", "pending", "onprogress", "done"].map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={currentStatus === option}
            onCheckedChange={() => handleChange("actionStatus", option)}
          >
            {option === "pending"
              ? "Belum Dikerjakan"
              : option === "onprogress"
              ? "Sedang Dikerjakan"
              : option === "done"
              ? "Selesai"
              : "Semua"}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
