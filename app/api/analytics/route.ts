import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [totalUsers, checkedInUsers, totalTeams, totalSubs] = await Promise.all([
      adminDb.collection('users').where('role', '==', 'PARTICIPANT').count().get(),
      adminDb.collection('users').where('role', '==', 'PARTICIPANT').where('checkedIn', '==', true).count().get(),
      adminDb.collection('teams').count().get(),
      adminDb.collection('submissions').count().get(),
    ])

    return NextResponse.json({
      total: totalUsers.data().count,
      checkedIn: checkedInUsers.data().count,
      teams: totalTeams.data().count,
      submissions: totalSubs.data().count,
      timeline: []
    })
  } catch (error) {
    return NextResponse.json({
      total: 0, checkedIn: 0, teams: 0, submissions: 0, timeline: []
    })
  }
}

