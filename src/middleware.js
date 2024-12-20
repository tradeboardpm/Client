import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the request is for a static asset
  const isStaticAsset =
    /\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/i.test(
      request.nextUrl.pathname
    );

  // If it's a static asset, allow the request to proceed
  if (isStaticAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const expiry = request.cookies.get("expiry")?.value;

  // Get current path
  const currentPath = request.nextUrl.pathname;

  // Paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/sign-up",
    "/reset-password",
    "/ap-verification",
    "/ap-data",
  ];

  // Check if the current path is a public path
  const isPublicPath =
    publicPaths.includes(currentPath) ||
    publicPaths.some((path) => currentPath.startsWith(path + "/"));

  // Immediate token check - if no token, only allow public paths
  if (!token) {
    // If already on a public path, allow access
    if (isPublicPath) {
      return NextResponse.next();
    }
    // For any other path, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If token exists, check for expiration
  if (expiry) {
    const expiryTime = Number(expiry);

    // If token is expired
    if (Date.now() > expiryTime) {
      // Create a response to clear cookies and redirect to home
      const response = NextResponse.redirect(new URL("/", request.url));

      // Clear authentication cookies
      response.cookies.delete("token");
      response.cookies.delete("expiry");
      response.cookies.delete("userName");
      response.cookies.delete("userEmail");
      response.cookies.delete("userId");

      return response;
    }
  }

  // If everything is fine, continue the request
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
