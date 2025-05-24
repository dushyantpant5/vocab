import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const accessToken: string = "sb_access_token";
const refreshToken: string = "sb_refresh_token";

const setAccessToken = async (token: string, response: NextResponse) => {
  response.cookies.set({
    name: accessToken,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, //1 hour
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return response;
};

const setRefreshToken = (token: string, response: NextResponse) => {
  response.cookies.set({
    name: refreshToken,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return response;
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
  response.cookies.set({
    name: accessToken,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  response.cookies.set({
    name: refreshToken,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};

const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const accessTokenValue = cookieStore.get(accessToken);
  // Return access token
  // If the access token is not found, return null
  if (accessTokenValue) {
    return accessTokenValue.value;
  }
  return null;
};

const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get(refreshToken);
  return refreshTokenValue ? refreshTokenValue.value : null;
};

export {
  setTokensAtTheTimeOfSignIn,
  getAccessToken,
  removeTokesAtTheTimeOfSignOut,
  getRefreshToken,
  setAccessToken
};
