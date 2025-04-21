import { createServerClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import ActionsPageClient from './ActionsPageClient'

export const dynamic = 'force-dynamic'

export default async function ActionsPage({ searchParams }: { searchParams: any }) {
  const supabase = createServerClient()
  const session = await getSession()
  const userId = session?.userId

  if (!userId) {
    return <p>Unauthorized</p>
  }

  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const offset = (page - 1) * limit
  const filter = searchParams.filter
  const status = searchParams.actionStatus
  const actionTypeId = searchParams.actionTypeId
  const search = searchParams.search
  const sortBy = searchParams.sortBy || 'created_at'

  let query = supabase
    .from("dental_actions")
    .select(`
      id,
      patient_name,
      category,
      treatment_status,
      is_approved,
      notes,
      created_at,
      action_type_id,
      action_types (
        id,
        name
      )
    `, { count: 'exact' })
    .eq("created_by", userId)

  if (filter === "approved") query = query.eq("is_approved", true)
  if (filter === "not_approved") query = query.eq("is_approved", false)
  if (status) query = query.eq("treatment_status", status)
  if (actionTypeId) query = query.eq("action_type_id", actionTypeId)
  if (search) {
    query = query.or(`patient_name.ilike.%${search}%,notes.ilike.%${search}%`)
  }

  query = query.range(offset, offset + limit - 1)
    .order(sortBy, { ascending: sortBy === 'patient_name' })

  const { data: actions, error, count: totalCount } = await query

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0

  const { data: types } = await supabase
    .from("action_types")
    .select("id, name")
    .order("name")

  return (
    <ActionsPageClient
      actions={actions || []}
      currentPage={page}
      totalPages={totalPages}
      actionTypes={types || []}
      sortBy={sortBy}
    />
  )
}
