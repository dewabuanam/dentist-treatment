"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, List, Settings, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/actions",
    label: "Daftar Tindakan",
    icon: List,
  },
  {
    href: "/action-types",
    label: "Kelola Jenis Tindakan",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="px-2 py-6 flex flex-col gap-4">
            {routes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                  pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </a>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <a
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === route.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <route.icon className="h-4 w-4 mr-2" />
            {route.label}
          </a>
        ))}
      </nav>
    </>
  )
}
