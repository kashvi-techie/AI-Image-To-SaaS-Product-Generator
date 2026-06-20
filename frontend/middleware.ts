import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, skip authentication entirely
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  // Only import Supabase if env vars are available
  try {
    const { createServerClient } = await import("@supabase/ssr");
    
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              supabaseResponse.cookies.set(name, value, options);
            });
          } catch (error) {
            // Ignore cookie setting errors in middleware
          }
        },
      },
    });

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    const protectedRoutes = ["/dashboard", "/projects", "/settings"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    const authRoutes = ["/login", "/signup"];
    const isAuthRoute = authRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If Supabase fails, continue without authentication
    console.error("Middleware auth error:", error);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
