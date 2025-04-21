"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteAction } from "./actions"
import { Loader2 } from "lucide-react" // Add a spinner icon for loading state

export function DeleteConfirmationModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await deleteAction(new FormData(e.target as HTMLFormElement))

      if (result?.error) {
        // Handle any error that occurs during the delete action
        console.error(result.error)
      }
    } catch (err) {
      // Handle general error
      console.error("Terjadi kesalahan. Silakan coba lagi.", err)
    } finally {
      setIsLoading(false)
      setOpen(false) // Close the modal after deleting
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
          <Button variant="outline" onClick={() => setOpen(false)}>
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
