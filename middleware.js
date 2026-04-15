import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  let res = NextResponse.next({ request: { headers: req.headers } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => req.cookies.getAll(), setAll: (cookies) => cookies.forEach(({ name, value }) => req.cookies.set(name, value)) } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Se tentar acessar dashboard sem estar logado
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/home/:path*'],
}