import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// หน้าที่ไม่ต้อง login (Public routes)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/auth/confirm',
  '/test',
  '/api/auth',
]

// หน้าที่ต้อง login (Protected routes)
const PROTECTED_ROUTES = [
  '/profile',
  '/cart',
  '/checkout',
  '/orders',
  '/wallet',
  '/settings',
  '/seller',
  '/admin',
]

// Routes เฉพาะคนที่ยัง "ไม่ login" (ถ้า login แล้วจะ redirect)
const GUEST_ONLY_ROUTES = ['/login', '/signup']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // ดึงข้อมูล user (session refresh ถ้าจำเป็น)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // เช็คว่าเป็น protected route ไหม
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // เช็คว่าเป็น guest-only route ไหม
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // 🔒 ถ้าไม่ได้ login แต่พยายามเข้า protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 🔓 ถ้า login แล้วแต่พยายามเข้า /login, /signup → ส่งไปหน้าแรก
  if (isGuestOnlyRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// กำหนดว่า middleware จะทำงานกับ path ไหนบ้าง
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}