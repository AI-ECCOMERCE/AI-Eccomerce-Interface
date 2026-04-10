import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/auth/is-admin";

const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin";

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  return NextResponse.redirect(url);
}

function redirectToDashboard(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = DASHBOARD_PATH;
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    if (request.nextUrl.pathname === LOGIN_PATH) {
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    return redirectToLogin(request);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const adminCheck = await verifyAdminAccess(session?.access_token);

  if (!adminCheck.isAdmin) {
    await supabase.auth.signOut();

    if (request.nextUrl.pathname === LOGIN_PATH) {
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    return redirectToLogin(request);
  }

  if (request.nextUrl.pathname === LOGIN_PATH) {
    return redirectToDashboard(request);
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
