import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./helpers/cookies";
import { verifyToken } from "@/helpers/tokenVerification";
import { NextResponse, NextRequest } from "next/server";
import supabase from "./utils/supabaseClient";

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for protected route");

  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    const callBackURL = new URL("/signIn", request.nextUrl.origin);
    return NextResponse.redirect(callBackURL);
  }

  if (!accessToken && refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (data?.session?.access_token) {
        const newAccessToken = data.session.access_token;
        const response = NextResponse.next();
        await setAccessToken(newAccessToken, response);
        return response;
      } else {
        console.log("Refresh failed:", error);
      }
    } catch (err) {
      console.error("Error during token refresh", err);
    }
  }

  if (accessToken && (await verifyToken(accessToken))) {
    return NextResponse.next();
  }
  const callBackURL = new URL("/auth-callback", request.nextUrl.origin);
  return NextResponse.redirect(callBackURL);
}

export const config = {
  matcher: ["/dashboard", "/learned", "/profile"],
};
