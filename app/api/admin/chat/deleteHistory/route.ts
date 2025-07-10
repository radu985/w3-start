export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Delete all messages for the session
    await prisma.message.deleteMany({
      where: {
        sessionId: sessionId
      }
    })

    // Delete the session itself
    await prisma.chatSession.delete({
      where: {
        id: sessionId
      }
    })

    return NextResponse.json({ success: true, message: 'Chat session and history deleted successfully' })
  } catch (error) {
    console.error('Error deleting chat history:', error)
    return NextResponse.json({ error: 'Failed to delete chat history' }, { status: 500 })
  }
} 