import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const token = request.cookies.get('adminToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      const decoded = verifyToken(token)
      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export function verifyAdminToken(request: NextRequest): { id: string; email: string; role: string } | null {
  // Try to get token from Authorization header (Bearer) or cookies
  const authHeader = request.headers.get('authorization')
  let token = null
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  } else {
    token = request.cookies.get('adminToken')?.value || null
  }
  if (!token) return null
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'admin') return null
  return decoded as { id: string; email: string; role: string }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
} 