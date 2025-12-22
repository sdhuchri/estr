import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/signin", "/signup", "/forgot-password"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Redirect root to signin if not authenticated, or to home if authenticated
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = userId ? "/home" : "/signin";
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected route
  if (!userId && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access signin page
  if (userId && pathname === "/signin") {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - fonts (public fonts folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
