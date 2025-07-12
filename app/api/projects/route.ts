export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' }
    ]
  })
  
  // Convert technologies string to array for frontend compatibility
  const projectsWithArrayTechnologies = projects.map(project => ({
    ...project,
    technologies: project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : []
  }))
  
  return NextResponse.json(projectsWithArrayTechnologies)
} 
//