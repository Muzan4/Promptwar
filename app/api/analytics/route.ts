import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    total: 247,
    checkedIn: 187,
    teams: 42,
    submissions: 38,
    timeline: []
  })
}

