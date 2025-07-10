export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: 'desc'
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
  return NextResponse.json(messages)
} 