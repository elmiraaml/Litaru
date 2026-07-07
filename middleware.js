import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/user");

  // Halaman lain (home, login, register, dll) gak disentuh
  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next();
  }

  // Belum login sama sekali -> paksa ke /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    // Admin nyasar ke /user -> lempar balik ke /admin
    if (isUserRoute && role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // User biasa nyasar ke /admin -> lempar balik ke /user
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    return NextResponse.next();
  } catch {
    // Token gak valid/expired -> paksa login ulang
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};