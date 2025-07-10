export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Helper function to verify admin token
const verifyAdminToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = verifyToken(token)
    return decoded && decoded.role === 'admin' ? decoded : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = verifyAdminToken(request)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    })
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = verifyAdminToken(request)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, category, level, order, icon } = body

    if (!name || !category) {
      return NextResponse.json(
        { message: 'Name and category are required' },
        { status: 400 }
      )
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: level || 5,
        order: order || 0,
        icon
      }
    })

    return NextResponse.json({
      message: 'Skill created successfully',
      skill
    })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const user = verifyAdminToken(request)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, category, level, order, icon } = body

    if (!id) {
      return NextResponse.json(
        { message: 'Skill ID is required' },
        { status: 400 }
      )
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        level,
        order,
        icon
      }
    })

    return NextResponse.json({
      message: 'Skill updated successfully',
      skill
    })
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const user = verifyAdminToken(request)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'Skill ID is required' },
        { status: 400 }
      )
    }

    await prisma.skill.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Skill deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 