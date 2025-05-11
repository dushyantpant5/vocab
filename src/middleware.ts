import { getAccessToken } from "./helpers/cookies";
import { verifyToken } from "@/helpers/tokenVerification";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for protected route");

  const accessToken = await getAccessToken();

  if (!accessToken || !(await verifyToken(accessToken))) {
    const callBackURL = new URL("/auth-callback", request.nextUrl.origin);
    return NextResponse.redirect(callBackURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/learned"],
};
