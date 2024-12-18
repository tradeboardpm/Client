import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const expiry = request.cookies.get("expiry")?.value;

  // Paths that don't require authentication
  const publicPaths = [
    "/login",
    "/sign-up",
    "/reset-password",
    "/ap-verification",
    "/ap-data",
  ];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If no token exists and trying to access a protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, check for expiration
  if (token && expiry) {
    const expiryTime = Number(expiry);

    // If token is expired
    if (Date.now() > expiryTime) {
      // Create a response to clear cookies
      const response = NextResponse.redirect(new URL("/login", request.url));

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
    // Exclude static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
