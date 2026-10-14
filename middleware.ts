import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRoutePermission } from "@/src/lib/route-permissions";
import {
  getRolesFromMetadata,
  hasPermission,
} from "@/src/features/auth/utils/rbac";

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

  // Verify the session JWT locally with the project's asymmetric signing key
  // (JWKS is cached), so no Supabase Auth round trip per request. Refreshes an
  // expired session through setAll above. Never trust unsigned cookie data.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  // 1️⃣ AUTH CHECK
  if (isProtectedRoute && !claims) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roles = getRolesFromMetadata(claims?.user_metadata);
  const isKnownRole = roles.length > 0;

  // 2️⃣ AUTH ROUTE GUARD (allow password recovery flow)
  if (
    isAuthRoute &&
    claims &&
    isKnownRole &&
    !isPasswordRecovery &&
    !isResetPasswordRoute
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3️⃣ PERMISSION CHECK
  if (claims && isProtectedRoute) {
    const requiredPermission = getRoutePermission(pathname);

    if (requiredPermission && !hasPermission(roles, requiredPermission)) {
      return NextResponse.redirect(
        new URL("/login?unauthorized=1", request.url),
      );
    }
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
