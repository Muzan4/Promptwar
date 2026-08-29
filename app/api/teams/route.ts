import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('teams').get()
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const newTeam = {
      ...data,
      status: 'OPEN',
      members: [],
      createdAt: new Date().toISOString()
    }
    const docRef = await adminDb.collection('teams').add(newTeam)
    return NextResponse.json({ id: docRef.id, ...newTeam })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
