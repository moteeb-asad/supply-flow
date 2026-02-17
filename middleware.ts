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
          cookiesToSet.forEach(({ name, value }) =>
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

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isResetPasswordRoute = pathname.startsWith("/reset-password");

  const isProtectedRoute = !isAuthRoute && !pathname.startsWith("/api");

  // Check if this is a password recovery flow
  const typeParam = request.nextUrl.searchParams.get("type");
  const isPasswordRecovery =
    pathname === "/reset-password" &&
    (request.nextUrl.searchParams.has("token") ||
      request.nextUrl.searchParams.has("code") ||
      request.nextUrl.searchParams.has("access_token") ||
      request.nextUrl.searchParams.has("refresh_token") ||
      typeParam === "recovery" ||
      typeParam === "invite" ||
      request.nextUrl.hash.includes("type=recovery") ||
      request.nextUrl.hash.includes("type=invite"));

  // Handle PKCE code exchange for password recovery
  if (request.nextUrl.searchParams.has("code")) {
    const code = request.nextUrl.searchParams.get("code")!;
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 1️⃣ AUTH CHECK
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user?.user_metadata?.role;
  const isKnownRole =
    role === "super_admin" ||
    role === "operations_manager" ||
    role === "store_keeper";

  // 🔐 2️⃣ AUTH ROUTE GUARD (allow password recovery flow)
  if (
    isAuthRoute &&
    user &&
    isKnownRole &&
    !isPasswordRecovery &&
    !isResetPasswordRoute
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔐 3️⃣ ROLE CHECK (⬅️ WRITE YOUR CODE HERE)
  if (user && isProtectedRoute) {
    for (const route in routePermissions) {
      if (pathname.startsWith(route)) {
        if (!role || !routePermissions[route].includes(role)) {
          return NextResponse.redirect(
            new URL("/login?unauthorized=1", request.url),
          );
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
