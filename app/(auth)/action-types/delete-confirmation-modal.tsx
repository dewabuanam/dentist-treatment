"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteActionType } from "./actions"
import { Loader2 } from "lucide-react" // Import the spinner icon for loading

export function DeleteConfirmationModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Loading state

  async function handleDelete(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const result = await deleteActionType(formData)
      
      if (result?.error) {
        // Handle error here if necessary
        console.error(result.error)
      } else {
        // Successfully deleted, you can close the dialog or show a success message
        setOpen(false)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      // Handle unexpected errors
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Hapus</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yakin ingin menghapus?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tindakan ini tidak dapat dibatalkan. Apakah kamu yakin ingin melanjutkan?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Batal
          </Button>
          <form onSubmit={handleDelete}>
            <input type="hidden" name="id" value={id} />
            <Button variant="destructive" size="sm" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
