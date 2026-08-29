import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const participantsRef = adminDb.collection('participants');
    const snapshot = await participantsRef.orderBy('createdAt', 'desc').get();
    
    // We need to fetch the associated user for each participant to match our interface
    const participants = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let userData = { id: data.userId, name: 'Unknown', email: 'unknown@example.com', skills: '[]' };
      
      // Fetch user data
      if (data.userId) {
        const userDoc = await adminDb.collection('users').doc(data.userId).get();
        if (userDoc.exists) {
          const ud = userDoc.data();
          userData = { id: data.userId, name: ud?.name, email: ud?.email, skills: ud?.skills || '[]' };
        }
      }

      participants.push({
        id: doc.id,
        ...data,
        user: userData,
        team: data.teamId ? { name: 'Team ' + data.teamId } : null // simplified team resolution
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
    
    const participantRef = adminDb.collection('participants').doc(participantId);
    
    const checkedInAt = checkedIn ? new Date().toISOString() : null;
    await participantRef.update({
      checkedIn,
      checkedInAt
    });

    const updatedDoc = await participantRef.get();
    
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() })
  } catch (error: any) {
    console.error('Error updating participant:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
