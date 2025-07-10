export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const portfolio = await prisma.portfolio.findFirst()
  if (!portfolio) {
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
} 