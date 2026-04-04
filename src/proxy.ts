export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth (auth routes)
     * - / (login page is accessible)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, logo.svg, robots.txt
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.svg|robots.txt).*)",
  ],
};
