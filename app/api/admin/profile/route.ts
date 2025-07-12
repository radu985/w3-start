export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { verifyAdminToken } from '@/lib/middleware'

export async function PUT(request: NextRequest) {
  const user = verifyAdminToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const updateData: any = { email }
    if (password && password.length > 0) {
      updateData.password = await hashPassword(password)
    }
    console.log('Updating 💫💫💫💫 profile with data:', user)
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
} 