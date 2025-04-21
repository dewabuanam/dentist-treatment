// imports tetap sama
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, CheckCircle, AlertCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth" 
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function DashboardPage() {
  const supabase = createServerClient()

  let actionTypesCount = 0
  let dentalActionsCount = 0
  let approvedActionsCount = 0
  let pendingActionsCount = 0
  let recentActions: any[] = []
  let actionStats: { id:string, name: string, count: number, approved: number, done: number }[] = []
  let treatmentStats: { name: string, count: number }[] = []

  try {
    const session = await getSession()
    const userId = session?.userId

    if (!userId) {
      return <p>Unauthorized</p>
    }

    const { count: actionTypesCountResult } = await supabase
      .from("action_types")
      .select("*", { count: "exact" })
      .eq("created_by", userId)
    
    if (actionTypesCountResult !== null) actionTypesCount = actionTypesCountResult

    const { count: dentalActionsCountResult } = await supabase
      .from("dental_actions")
      .select("*", { count: "exact" })
      .eq("created_by", userId)

    if (dentalActionsCountResult !== null) dentalActionsCount = dentalActionsCountResult

    const { count: approvedActionsCountResult } = await supabase
      .from("dental_actions")
      .select("*", { count: "exact" })
      .eq("is_approved", true)
      .eq("created_by", userId)

    if (approvedActionsCountResult !== null) approvedActionsCount = approvedActionsCountResult

    const { count: pendingActionsCountResult } = await supabase
      .from("dental_actions")
      .select("*", { count: "exact" })
      .eq("is_approved", false)
      .eq("created_by", userId)

    if (pendingActionsCountResult !== null) pendingActionsCount = pendingActionsCountResult
    // Fetch detailed action stats
    const { data: actionTypes, error: actionTypesError } = await supabase
      .from("action_types")
      .select("id, name, target")

    const { data: actionData, error } = await supabase
      .from("dental_actions")
      .select("is_approved, treatment_status, action_type_id, action_types(name, target)") // Tambah target di sini
      .eq("created_by", userId)

    if (error) throw error

    const groupedStats: Record<
      string, // key is action_type_id
      {
        id: string
        name: string
        count: number
        approved: number
        done: number
        target?: number // tambahkan target di sini
      }
    > = {}

    
    for (const action of actionData) {
      const id = action.action_type_id
      const name = action.action_types?.name ?? "Tidak diketahui"
      const target = action.action_types?.target

      if (!groupedStats[id]) {
        groupedStats[id] = {
          id,
          name,
          count: 0,
          approved: 0,
          done: 0,
          target, // assign target saat pertama kali ditemukan
        }
      }

      groupedStats[id].count++
      if (action.is_approved) groupedStats[id].approved++
      if (action.treatment_status === "done") groupedStats[id].done++
    }
      
    for (const actionType of actionTypes) {
      const id = actionType.id
      const name = actionType.name ?? "Tidak diketahui"
      const target = actionType.target

      if (!groupedStats[id]) {
        groupedStats[id] = {
          id,
          name,
          count: 0,
          approved: 0,
          done: 0,
          target, // assign target saat pertama kali ditemukan
        }
      }
    }

    // Final array of stats with ID included
    actionStats = Object.values(groupedStats)


    // Recent actions
    const { data: recentActionsResult } = await supabase
      .from("dental_actions")
      .select(`
        id,
        patient_name,
        category,
        is_approved,
        created_at,
        action_types ( name )
      `)
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentActionsResult) recentActions = recentActionsResult

    // Treatment stats
    const { data: treatmentStatusData } = await supabase
      .from("dental_actions")
      .select("treatment_status")
      .eq("created_by", userId)

    if (treatmentStatusData) {
      const statusGroup = treatmentStatusData.reduce((acc, curr) => {
        const status = curr.treatment_status || "Tidak diketahui"
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      treatmentStats = Object.entries(statusGroup).map(([name, count]) => ({
        name,
        count,
      }))
    }

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Ringkasan tindakan dokter gigi dan statistik</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button asChild>
          <Link href="/actions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Tindakan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Cards for summary counts */}
        
        <a href={`/actions`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tindakan</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dentalActionsCount}</div>
              <p className="text-xs text-muted-foreground">Jumlah tindakan yang tercatat</p>
            </CardContent>
          </Card>
        </a>

        <a href={`/action-types`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jenis Tindakan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{actionTypesCount}</div>
              <p className="text-xs text-muted-foreground">Jenis tindakan yang tersedia</p>
            </CardContent>
          </Card>
        </a>

        <a href={`/actions?filter=approved`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tindakan Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedActionsCount}</div>
              <p className="text-xs text-muted-foreground">Tindakan yang telah disetujui</p>
            </CardContent>
          </Card>
        </a>

        <a href={`/actions?filter=not_approved`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tindakan Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingActionsCount}</div>
              <p className="text-xs text-muted-foreground">Tindakan yang belum disetujui</p>
            </CardContent>
          </Card>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Kolom Statistik */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Tindakan</CardTitle>
              <CardDescription>Distribusi tindakan berdasarkan jenis tindakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionStats.length > 0 ? (
                actionStats.map((stat: any, index: number) => {
                  const targetRate = stat.target > 0 ? (stat.approved / stat.target) * 100 : 0
                  const approvalRate = stat.count > 0 ? (stat.approved / stat.count) * 100 : 0
                  const doneRate = stat.count > 0 ? (stat.done / stat.count) * 100 : 0

                  return (
                    <div key={index} className="flex flex-col border-b pb-4 space-y-1">
                      
                      <div key={index} className="flex items-center justify-between pb-2">
                        <p className="text-xl font-semibold">{stat.name}</p>
                        <span className="text-sm text-muted-foreground">Total: {stat.count} tindakan</span>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div>
                          <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                            <span className="flex items-center">Target: {stat.approved}/{stat.target} tindakan</span>
                            <div className="flex items-center gap-2">
                              <span>{targetRate.toFixed(0)}%</span>
                        
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                      <a href={`/actions?filter=not_approved&actionTypeId=${stat.id}`}>
                                        <Button variant="ghost" size="icon">
                                          <ArrowRight className="h-4 w-4" />
                                        </Button>
                                      </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Lihat tindakan belum disetujui</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <Progress value={targetRate} className="h-4" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                            <span className="flex items-center">Disetujui: {stat.approved} tindakan</span>
                            <div className="flex items-center gap-2">
                              <span>{approvalRate.toFixed(0)}%</span>
                        
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                      <a href={`/actions?filter=not_approved&actionTypeId=${stat.id}`}>
                                        <Button variant="ghost" size="icon">
                                          <ArrowRight className="h-4 w-4" />
                                        </Button>
                                      </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Lihat tindakan belum disetujui</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <Progress value={approvalRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                            <span className="flex items-center">Selesai: {stat.done} tindakan</span>
                            <div className="flex items-center gap-2">
                              <span>{doneRate.toFixed(0)}%</span>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                        <a href={`/actions?actionTypeId=${stat.id}&actionStatus=onprogress`}>
                                          <Button variant="ghost" size="icon">
                                            <ArrowRight className="h-4 w-4" />
                                          </Button>
                                        </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Lihat tindakan sedang dikerjakan</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <Progress value={doneRate} className="h-2 bg-muted" />
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted-foreground">Belum ada data statistik tindakan</p>
              )}
            </CardContent>

          </Card>
        </div>
        
        {/* Kolom Tindakan Terbaru */}
        <div className="space-y-4">

          <Card>
            <CardHeader>
              <CardTitle>Status Tindakan</CardTitle>
              <CardDescription>Distribusi berdasarkan status pengerjaan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {treatmentStats.length > 0 ? (
                treatmentStats.map((stat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <p className="font-medium">
                      {stat.name === "pending" && "Belum Dikerjakan"}
                      {stat.name === "onprogress" && "Sedang Dikerjakan"}
                      {stat.name === "done" && "Selesai"}
                      {!["pending", "onprogress", "done"].includes(stat.name) && stat.name}
                    </p>
                    <span className="text-sm text-muted-foreground">{stat.count} tindakan</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Belum ada data status tindakan</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tindakan Terbaru</CardTitle>
              <CardDescription>Daftar 5 tindakan dokter gigi terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActions && recentActions.length > 0 ? (
                <div className="space-y-4">
                  {recentActions.map((action: any) => (
                    <div key={action.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{action.patient_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.action_types?.name} - {action.category}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${action.is_approved ? "bg-green-500" : "bg-amber-500"}`}
                        />
                        <span className="text-sm">{action.is_approved ? "Disetujui" : "Pending"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Belum ada tindakan yang tercatat</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
