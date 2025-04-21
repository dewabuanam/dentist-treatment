// (auth)/layout.tsx
import type { ReactNode } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { InstallPWAButton } from "@/components/install-pwa-button"
import { checkAuth } from "@/lib/auth"

export default async function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await checkAuth()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex pl-6">
            <h1 className="text-xl font-bold ">Dentist Treatment</h1>
          </div>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4 pr-6">
            <InstallPWAButton />
            <ModeToggle />
            <UserNav email={session?.email || "User"} />
          </div>
        </div>
      </header>
      <main className="flex-1 container p-5">{children}</main>
    </>
  )
}
