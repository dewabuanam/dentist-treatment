import LoginForm from "./login-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Treatment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Login to manage doctor treatment</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
