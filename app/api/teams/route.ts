import { NextResponse } from 'next/server'

const MOCK_TEAMS = [
  { id: 't1', name: 'Neural Nexus', track: 'AI/ML', description: 'AI agents for scheduling', status: 'OPEN', lookingFor: '["Frontend", "React"]', members: [{ user: { name: 'Alice', skills: '["Python", "AI"]' } }] },
  { id: 't2', name: 'BlockBuilders', track: 'Web3', description: 'DeFi protocol', status: 'FULL', lookingFor: '[]', members: [{ user: { name: 'Bob', skills: '["Solidity"]' } }] },
]

export async function GET() {
  return NextResponse.json(MOCK_TEAMS)
}

export async function POST(req: Request) {
  const data = await req.json()
  return NextResponse.json({ ...data, id: Date.now().toString(), status: 'OPEN', members: [] })
}
