import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const accessToken: string = "sb_access_token";
const refreshToken: string = "sb_refresh_token";

const setAccessToken = (token: string, response: NextResponse) => {
  response.cookies.set({
    name: accessToken,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure cookies in production
    path: "/",
    maxAge: 60 * 60, // 1 hour
    sameSite: "strict", // Add SameSite attribute for extra security
  });
};

const setRefreshToken = (token: string, response: NextResponse) => {
  response.cookies.set({
    name: refreshToken,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure cookies in production
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "strict", // Add SameSite attribute for extra security
  });
};

const setTokensAtTheTimeOfSignIn = (
  accessToken: string,
  refreshToken: string,
  response: NextResponse
) => {
  setAccessToken(accessToken, response);
  setRefreshToken(refreshToken, response);
};

const removeTokesAtTheTimeOfSignOut = (response: NextResponse) => {
  response.cookies.delete({ name: accessToken, path: "/" });
  response.cookies.delete({ name: refreshToken, path: "/" });
};

const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = cookies(); // Access the cookie store
  const accessTokenValue = (await cookieStore).get(accessToken);
  // Return access token
  // If the access token is not found, return null
  if (accessTokenValue) {
    return accessTokenValue.value;
  }
  return null;
};

export {
  setTokensAtTheTimeOfSignIn,
  getAccessToken,
  removeTokesAtTheTimeOfSignOut,
};
