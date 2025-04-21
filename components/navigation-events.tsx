// components/navigation-events.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function NavigationEvents() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [pathname])

  return loading ? <LoadingSpinner /> : null;
}
