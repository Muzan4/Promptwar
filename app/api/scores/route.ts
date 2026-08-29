import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { submissionId, ...scoreData } = data
    
    // Add score document
    const scoreDoc = {
      ...scoreData,
      createdAt: new Date().toISOString()
    }
    const docRef = await adminDb.collection('scores').add(scoreDoc)

    // Append to submission's scores array
    const subRef = adminDb.collection('submissions').doc(submissionId)
    const subDoc = await subRef.get()
    
    if (subDoc.exists) {
      const existing = subDoc.data()
      const scores = existing?.scores || []
      scores.push({ id: docRef.id, ...scoreDoc })
      
      // Calculate new total
      let totalScore = 0
      scores.forEach((s: any) => {
        const avg = (s.innovation + s.impact + s.technical + s.presentation) / 4
        totalScore += avg
      })
      totalScore = scores.length > 0 ? totalScore / scores.length : 0

      await subRef.update({ scores, totalScore })
    }

    return NextResponse.json({ id: docRef.id, ...scoreDoc })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
