import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicContext = await getClinicContext(supabase, user.id)
    if (!clinicContext?.clinicConfigId) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    const clinicConfigId = clinicContext.clinicConfigId

    // Get all distinct months from call_logs for this clinic
    const { data: months, error: monthsError } = await supabase
      .from('call_logs')
      .select('created_at')
      .eq('clinic_config_id', clinicConfigId)
      .order('created_at', { ascending: false })

    if (monthsError) {
      console.error('Error fetching call_logs:', monthsError)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    // Extract unique months
    const monthSet = new Set<string>()
    months?.forEach((record: any) => {
      if (record.created_at) {
        const date = new Date(record.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
        monthSet.add(monthKey)
      }
    })

    const uniqueMonths = Array.from(monthSet).sort().reverse()

    if (uniqueMonths.length === 0) {
      return NextResponse.json({
        message: 'No data to backfill',
        monthsProcessed: 0,
      })
    }

    // Call upsert_monthly_report for each month
    let successCount = 0
    const errors: string[] = []

    for (const monthStr of uniqueMonths) {
      const { error } = await supabase.rpc('upsert_monthly_report' as any, {
        p_clinic_config_id: clinicConfigId,
        p_month: monthStr,
      })

      if (error) {
        console.error(`Error processing month ${monthStr}:`, error)
        errors.push(`${monthStr}: ${error.message}`)
      } else {
        successCount++
      }
    }

    return NextResponse.json({
      message: 'Backfill completed',
      monthsProcessed: successCount,
      totalMonths: uniqueMonths.length,
      errors: errors.length > 0 ? errors : undefined,
      success: errors.length === 0,
    })
  } catch (err) {
    console.error('Backfill error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
