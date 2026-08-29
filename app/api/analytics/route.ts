import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [usersSnap, teamsSnap, subsSnap] = await Promise.all([
      adminDb.collection('users').get(),
      adminDb.collection('teams').get(),
      adminDb.collection('submissions').get(),
    ])

    let total = 0
    let checkedIn = 0
    
    usersSnap.forEach(doc => {
      const data = doc.data()
      if (data.role === 'PARTICIPANT') {
        total++
        if (data.checkedIn) checkedIn++
      }
    })

    return NextResponse.json({
      total,
      checkedIn,
      teams: teamsSnap.size,
      submissions: subsSnap.size,
      timeline: []
    })
  } catch (error) {
    return NextResponse.json({
      total: 0, checkedIn: 0, teams: 0, submissions: 0, timeline: []
    })
  }
}

