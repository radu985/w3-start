export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        status: {
          not: 'closed'
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const sessionsWithCounts = sessions.map(session => ({
      id: session.id,
      customerId: session.customerId,
      customerName: session.customerName,
      status: session.status,
      lastMessage: session.lastMessage,
      unreadCount: 0, // This would need to be calculated based on business logic
      messages: session.messages
    }))

    return NextResponse.json(sessionsWithCounts)
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 })
  }
} 