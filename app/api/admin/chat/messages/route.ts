export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        sessionId: sessionId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Transform messages to match the expected format
    const transformedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || message.sender.email,
      senderRole: message.sender.role,
      timestamp: message.createdAt
    }))

    return NextResponse.json(transformedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, senderId, sessionId, senderName, senderRole } = await request.json()

    if (!content || !senderId || !sessionId) {
      return NextResponse.json({ error: 'Content, senderId, and sessionId are required' }, { status: 400 })
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { id: senderId }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: senderId,
          email: `${senderId}@temp.com`,
          name: senderName,
          role: senderRole || 'customer'
        }
      })
    }

    // Create or find session
    let session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          id: sessionId,
          customerId: senderId,
          customerName: senderName,
          status: 'active'
        }
      })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        sessionId: session.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Update session lastMessage
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { lastMessage: message.createdAt }
    })

    // Transform message to match expected format
    const transformedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || message.sender.email,
      senderRole: message.sender.role,
      timestamp: message.createdAt
    }

    return NextResponse.json(transformedMessage)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
} 