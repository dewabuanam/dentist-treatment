"use client"

import { useState } from "react"
import { createActionType, updateActionType } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface ActionType {
  id: string
  name: string
  description: string
  target?: string // Ditambahkan untuk menyimpan target total tindakan
}

interface ActionTypeFormProps {
  actionType?: ActionType
}

export default function ActionTypeForm({ actionType }: ActionTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = actionType ? await updateActionType(formData) : await createActionType(formData)

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
      <form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        handleSubmit(formData)
      }}>
        {actionType && <input type="hidden" name="id" value={actionType.id} />}

        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nama Jenis Tindakan</Label>
            <Input
              id="name"
              name="name"
              defaultValue={actionType?.name}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={actionType?.description}
              placeholder="Tambahkan deskripsi jenis tindakan"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Total Tindakan</Label>
            <Input
              id="target"
              name="target"
              type="number"
              defaultValue={actionType?.target}
              placeholder="Contoh: 10"
              min={0}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild disabled={isLoading}>
            <Link href="/action-types">Batal</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : actionType ? (
              "Perbarui"
            ) : (
              "Simpan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
