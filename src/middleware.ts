import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  // Se tentar acessar qualquer rota /admin (exceto login) sem cookie
  if (!authCookie && pathname.startsWith('/admin') && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Se já estiver logado e tentar ir para o login
  if (authCookie && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
