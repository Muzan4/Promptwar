import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(null)
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: decodedToken.uid,
      name: userData.name || 'Hacker',
      email: userData.email,
      role: userData.role || 'PARTICIPANT',
      skills: userData.skills || '[]',
      bio: userData.bio || '',
    })
  } catch (error) {
    console.error('API /me error:', error)
    return NextResponse.json(null)
  }
}
