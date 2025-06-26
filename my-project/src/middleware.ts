import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { verifyWithJose } from "./db/helpers/jwt";

export async function middleware(request: NextRequest) {
  const auth = request.cookies.get("Authorization")?.value;


  
  if (request.nextUrl.pathname.startsWith("/api/articles")) {
    if (!auth)
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const [type, token] = auth?.split(" ");
    if (type !== "Bearer")
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const verified = await verifyWithJose<{ _id: string }>(token);
    console.log(verified, "🔑 Verified User");

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", verified._id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  
  if (request.nextUrl.pathname.startsWith("/article")) {
    if (!auth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}


export const config = {
  matcher: ["/api/articles/:path*", "/article/:path*"],
};
