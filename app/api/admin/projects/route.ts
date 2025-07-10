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
  } catch (error) {
    console.error('Error fetching projects:', error)
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
    const { title, description, technologies, imageUrl, githubUrl, liveUrl, featured, order } = body

    if (!title || !description || !technologies) {
      return NextResponse.json(
        { message: 'Title, description, and technologies are required' },
        { status: 400 }
      )
    }

    // Convert technologies array to string for database storage
    const technologiesString = Array.isArray(technologies) ? technologies.join(', ') : technologies

    const project = await prisma.project.create({
      data: {
        title,
        description,
        technologies: technologiesString,
        imageUrl,
        githubUrl,
        liveUrl,
        featured: featured || false,
        order: order || 0
      }
    })

    // Convert back to array for response
    const projectWithArrayTechnologies = {
      ...project,
      technologies: project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : []
    }

    return NextResponse.json({
      message: 'Project created successfully',
      project: projectWithArrayTechnologies
    })
  } catch (error) {
    console.error('Error creating project:', error)
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
    const { id, title, description, technologies, imageUrl, githubUrl, liveUrl, featured, order } = body

    if (!id) {
      return NextResponse.json(
        { message: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Convert technologies array to string for database storage
    const technologiesString = Array.isArray(technologies) ? technologies.join(', ') : technologies

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        technologies: technologiesString,
        imageUrl,
        githubUrl,
        liveUrl,
        featured,
        order
      }
    })

    // Convert back to array for response
    const projectWithArrayTechnologies = {
      ...project,
      technologies: project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : []
    }

    return NextResponse.json({
      message: 'Project updated successfully',
      project: projectWithArrayTechnologies
    })
  } catch (error) {
    console.error('Error updating project:', error)
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
        { message: 'Project ID is required' },
        { status: 400 }
      )
    }

    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 