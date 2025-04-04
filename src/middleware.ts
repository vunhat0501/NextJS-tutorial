import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/signin' || path === '/signup'
    const token =  request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        // If the user is authenticated and tries to access a public route, redirect them to the profile page
        return NextResponse.redirect(new URL('/profile', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        // If the user is not authenticated and tries to access a protected route, redirect them to the sign-in page
        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/profile',
        '/signin',
        '/signup',
    ],
}