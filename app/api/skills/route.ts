export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const portfolio = await prisma.skill.findMany()
  console.log('Portfolio👌👌 fetched:', portfolio)
  // ...fallback/default...
  return NextResponse.json(portfolio)
} 