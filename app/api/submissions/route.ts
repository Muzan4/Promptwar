import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('submissions').get()
    const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const newSubmission = {
      ...data,
      totalScore: 0,
      scores: [],
      createdAt: new Date().toISOString()
    }
    const docRef = await adminDb.collection('submissions').add(newSubmission)
    return NextResponse.json({ id: docRef.id, ...newSubmission })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
