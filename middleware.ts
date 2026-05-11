import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routePermissions } from "@/src/lib/route-permissions";

export async function middleware(request: NextRequest) {
  const startTime = performance.now();
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

  // IMPORTANT: When users logout, clear the cached_user_session cookie
  // In your logout handler, add: cookies().delete("cached_user_session")

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
  if (
    pathname === "/reset-password" &&
    request.nextUrl.searchParams.has("code")
  ) {
    const code = request.nextUrl.searchParams.get("code")!;
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error(
        "exchangeCodeForSession failed in middleware:",
        error.message,
      );
    }
  }

  // Session caching: Check if we have a cached user session
  const cachedSession = request.cookies.get("cached_user_session");
  let user = null;

  if (cachedSession) {
    // Use cached session (no network call needed)
    try {
      const cached = JSON.parse(cachedSession.value);
      // Check if cache is still valid (60 seconds)
      if (Date.now() - cached.timestamp < 60000) {
        user = cached.user;
        if (process.env.ENABLE_PERF_LOGS === "true") {
          console.log(`[Middleware] ${pathname} - Using cached session (0ms)`);
        }
      }
    } catch (e) {
      // Invalid cache, fall through to fetch
    }
  }

  // If no valid cache, fetch from Supabase
  if (!user) {
    const getUserStartTime = performance.now();
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
    const getUserEndTime = performance.now();

    // Cache the session for 60 seconds
    if (user) {
      const cacheData = {
        user: user,
        timestamp: Date.now(),
      };
      response.cookies.set("cached_user_session", JSON.stringify(cacheData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60, // 60 seconds
      });
    } else {
      // Clear cache if no user
      response.cookies.delete("cached_user_session");
    }

    if (process.env.ENABLE_PERF_LOGS === "true") {
      console.log(
        `[Middleware] ${pathname} - getUser: ${(getUserEndTime - getUserStartTime).toFixed(2)}ms (cached for 60s)`,
      );
    }
  }

  // 1️⃣ AUTH CHECK
  if (isProtectedRoute && !user) {
    if (process.env.ENABLE_PERF_LOGS === "true") {
      console.log(
        `[Middleware] ${pathname} - Total: ${(performance.now() - startTime).toFixed(2)}ms (redirect to login)`,
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const primaryRole = user?.user_metadata?.primary_role as string | undefined;
  const legacyRole = user?.user_metadata?.role as string | undefined;
  const rolesMetadata = user?.user_metadata?.roles;
  const roles = Array.isArray(rolesMetadata)
    ? (rolesMetadata.filter((value) => typeof value === "string") as string[])
    : primaryRole
      ? [primaryRole]
      : legacyRole
        ? [legacyRole]
        : [];
  const isKnownRole = roles.some(
    (value) =>
      value === "super_admin" ||
      value === "operations_manager" ||
      value === "store_keeper",
  );

  // 2️⃣ AUTH ROUTE GUARD (allow password recovery flow)
  if (
    isAuthRoute &&
    user &&
    isKnownRole &&
    !isPasswordRecovery &&
    !isResetPasswordRoute
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3️⃣ ROLE CHECK (⬅️ WRITE YOUR CODE HERE)
  if (user && isProtectedRoute) {
    // Optimized: Find most specific matching route first, then check permissions once
    const matchedRoute = Object.keys(routePermissions)
      .sort((a, b) => b.length - a.length) // Longest first (most specific route)
      .find((route) => pathname.startsWith(route));

    if (matchedRoute) {
      const allowedRoles = routePermissions[matchedRoute];
      const isAllowed = roles.some((value) => allowedRoles.includes(value));
      if (!isAllowed) {
        if (process.env.ENABLE_PERF_LOGS === "true") {
          console.log(
            `[Middleware] ${pathname} - Total: ${(performance.now() - startTime).toFixed(2)}ms (unauthorized)`,
          );
        }
        return NextResponse.redirect(
          new URL("/login?unauthorized=1", request.url),
        );
      }
    }
  }

  if (process.env.ENABLE_PERF_LOGS === "true") {
    console.log(
      `[Middleware] ${pathname} - Total: ${(performance.now() - startTime).toFixed(2)}ms`,
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude: _next, static files, auth routes (login, forgot-password, reset-password)
    // This prevents middleware from running on /login after logout, saving ~200-500ms
    "/((?!_next|favicon.ico|login|forgot-password|reset-password|api|.*\\.(?:css|js|map|json|png|jpg|jpeg|svg|woff2)).*)",
  ],
};
