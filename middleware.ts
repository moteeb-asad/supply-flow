import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routePermissions } from "@/src/lib/route-permissions"; // 👈 import

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedRoute = !isAuthRoute && !pathname.startsWith("/api");

  // 🔐 1️⃣ AUTH CHECK
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔁 2️⃣ AUTH ROUTE GUARD
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔐 3️⃣ ROLE CHECK (⬅️ WRITE YOUR CODE HERE)
  if (user && isProtectedRoute) {
    const role = user.user_metadata?.role;

    for (const route in routePermissions) {
      if (pathname.startsWith(route)) {
        if (!role || !routePermissions[route].includes(role)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:css|js|map|json|png|jpg|jpeg|svg|woff2)).*)",
  ],
};
