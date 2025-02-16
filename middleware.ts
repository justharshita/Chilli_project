import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected here
const PROTECTED_PATHS = ['/transaction', '/dashboard']

export function middleware(request: NextRequest) {
  // Check if the path should be protected
  const path = request.nextUrl.pathname
  if (!PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath))) {
    return NextResponse.next()
  }

  // Check for company info in cookies
  const companyInfo = request.cookies.get('companyInfo')

  if (!companyInfo) {
    // Redirect to login if no company info found
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/transaction/:path*', '/dashboard/:path*']
} 