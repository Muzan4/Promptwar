import { NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

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
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    if (!decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const newAnnouncement = {
      ...data,
      createdAt: new Date().toISOString(),
      author: { name: 'Admin' }
    }
    const docRef = await adminDb.collection('announcements').add(newAnnouncement)
    return NextResponse.json({ id: docRef.id, ...newAnnouncement })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
