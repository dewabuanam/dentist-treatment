import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  // Use try/catch to handle any potential errors with getSession
  let session = null
  try {
    session = await getSession()
  } catch (error) {
    console.error("Error getting session:", error)
  }

  if (session?.authenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Dentist Treatment Management</h1>
        <p className="text-xl text-muted-foreground">Aplikasi untuk mencatat tindakan dokter</p>
      </div>

      <Button asChild size="lg">
        <Link href="/login">Login</Link>
      </Button>
    </div>
  )
}
