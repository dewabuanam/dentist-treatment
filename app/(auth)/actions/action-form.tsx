"use client"

import { useState } from "react"
import { createAction, updateAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Loader2 } from "lucide-react" // Add a spinner icon for loading state

interface ActionType {
  id: string
  name: string
}

interface DentalAction {
  id: string
  action_type_id: string
  patient_name: string
  category: string
  is_approved: boolean
  notes: string
}

interface ActionFormProps {
  actionTypes: ActionType[]
  action?: DentalAction
}

export default function ActionForm({ actionTypes, action }: ActionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = action ? await updateAction(formData) : await createAction(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.target)); }}>
        {action && <input type="hidden" name="id" value={action.id} />}

        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="actionTypeId">Jenis Tindakan</Label>
            <Select name="actionTypeId" defaultValue={action?.action_type_id} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis tindakan" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Nama Pasien</Label>
            <Input id="patientName" name="patientName" defaultValue={action?.patient_name} required />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <RadioGroup name="category" defaultValue={action?.category || "Umum"} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Umum" id="umum" />
                <Label htmlFor="umum">Umum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BPJS" id="bpjs" />
                <Label htmlFor="bpjs">BPJS</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isApproved" name="isApproved" defaultChecked={action?.is_approved} />
            <Label htmlFor="isApproved">Disetujui</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="treatmentStatus">Status Tindakan</Label>
            <Select name="treatmentStatus" defaultValue={action?.treatment_status || "pending"} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status tindakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="onprogress">Sedang Dikerjakan</SelectItem>
                <SelectItem value="done">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={action?.notes}
              placeholder="Tambahkan catatan jika diperlukan"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/actions">Batal</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : action ? "Perbarui" : "Simpan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
