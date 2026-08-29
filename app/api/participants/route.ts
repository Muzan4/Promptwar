import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('role', '==', 'PARTICIPANT').get();
    
    const participants = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      participants.push({
        id: doc.id,
        checkedIn: data.checkedIn || false,
        checkedInAt: data.checkedInAt || null,
        qrCode: data.qrCode || '',
        createdAt: data.createdAt,
        user: {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          skills: data.skills || '[]'
        },
        team: data.teamId ? { name: 'Team ' + data.teamId } : null
      });
    }

    return NextResponse.json(participants)
  } catch (error: any) {
    console.error('Error fetching participants:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { participantId, checkedIn } = await req.json()
    
    const userRef = adminDb.collection('users').doc(participantId);
    
    const checkedInAt = checkedIn ? new Date().toISOString() : null;
    await userRef.update({
      checkedIn,
      checkedInAt
    });

    const updatedDoc = await userRef.get();
    const data = updatedDoc.data() || {};
    
    return NextResponse.json({ 
      id: updatedDoc.id, 
      checkedIn: data.checkedIn, 
      checkedInAt: data.checkedInAt,
      user: {
        id: updatedDoc.id,
        name: data.name,
        email: data.email,
        skills: data.skills
      }
    })
  } catch (error: any) {
    console.error('Error updating participant:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
