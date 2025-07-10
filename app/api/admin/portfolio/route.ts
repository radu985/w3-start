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
    const portfolio = await prisma.portfolio.findFirst()
    
    if (!portfolio) {
      // Return default data if no portfolio exists
      return NextResponse.json({
        title: 'Full Stack Developer Portfolio',
        subtitle: 'Building modern web applications',
        aboutMe: "Hello! I'm a Full Stack Developer based in Cali, Colombia, with a deep passion for technology and software craftsmanship. I graduated from Universidad del Valle (University of the Valley) with a degree in Software Engineering, where I built a strong foundation in full cycle application development, algorithms, and systems design.",
        location: 'Cali, Colombia',
        email: 'www_star@email.com',
        github: 'github.com/radu985',
        linkedin: 'linkedin.com/in/yourprofile',
        website: 'yourdomain.com',
        avatar: null
      })
    }
    
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
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
    const { title, subtitle, aboutMe, location, email, github, linkedin, website, avatar } = body

    if (!title || !subtitle || !aboutMe || !location || !email) {
      return NextResponse.json(
        { message: 'Title, subtitle, about me, location, and email are required' },
        { status: 400 }
      )
    }

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findFirst()
    
    let portfolio
    if (existingPortfolio) {
      // Update existing portfolio
      portfolio = await prisma.portfolio.update({
        where: { id: existingPortfolio.id },
        data: {
          title,
          subtitle,
          aboutMe,
          location,
          email,
          github,
          linkedin,
          website,
          avatar
        }
      })
    } else {
      // Create new portfolio
      portfolio = await prisma.portfolio.create({
        data: {
          title,
          subtitle,
          aboutMe,
          location,
          email,
          github,
          linkedin,
          website,
          avatar
        }
      })
    }

    return NextResponse.json({
      message: 'Portfolio updated successfully',
      portfolio
    })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 