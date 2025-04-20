import { getAccessToken } from "./helpers/cookies";
import { verifyToken } from "@/helpers/tokenVerification";
import { NextResponse } from "next/server";

export async function middleware() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      {
        error: "[Middleware]: Authentication required. Access token not found.",
      },
      { status: 401 }
    );
  }

  const isTokenValid = await verifyToken(accessToken);

  if (!isTokenValid) {
    return NextResponse.json(
      {
        error:
          "[Middleware]: Authentication required. Access token is invalid.",
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
