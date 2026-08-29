import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('announcements').orderBy('createdAt', 'desc').get()
    const announcements = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(announcements)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const newAnnouncement = {
      ...data,
      createdAt: new Date().toISOString(),
      author: { name: 'Admin' } // Simplified for now
    }
    const docRef = await adminDb.collection('announcements').add(newAnnouncement)
    return NextResponse.json({ id: docRef.id, ...newAnnouncement })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
