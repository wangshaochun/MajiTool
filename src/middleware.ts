import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACTION_HEADER = "next-action";

export function middleware(request: NextRequest) {
  if (request.headers.has(ACTION_HEADER)) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
