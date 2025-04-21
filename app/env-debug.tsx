"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Only collect NEXT_PUBLIC_ variables
    const publicEnvVars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        publicEnvVars[key] = process.env[key] || ""
      }
    })
    setEnvVars(publicEnvVars)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
        <CardDescription>Showing only NEXT_PUBLIC_ environment variables</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.keys(envVars).length > 0 ? (
            Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-2">
                <div className="font-medium">{key}</div>
                <div>{value ? "✅ Set" : "❌ Not set"}</div>
              </div>
            ))
          ) : (
            <p>No public environment variables found</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
