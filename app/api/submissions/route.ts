import { NextResponse } from 'next/server'

const MOCK_SUBMISSIONS = [
  { id: 's1', title: 'SmartScheduler', description: 'AI Agent for scheduling', totalScore: 42.5, team: { name: 'Neural Nexus', track: 'AI/ML' }, scores: [{ id: '1' }, { id: '2' }] },
  { id: 's2', title: 'DeFi Swap', description: 'Swap tokens', totalScore: 38.0, team: { name: 'BlockBuilders', track: 'Web3' }, scores: [{ id: '3' }] },
]

export async function GET() {
  return NextResponse.json(MOCK_SUBMISSIONS)
}

export async function POST(req: Request) {
  const data = await req.json()
  return NextResponse.json({ ...data, id: Date.now().toString(), totalScore: 0, scores: [], team: { name: 'Your Team', track: 'General' } })
}
