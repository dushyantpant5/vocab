import { cookies } from "next/headers"; // Importing the cookies API to work with cookies

export async function GET() {
  const cookieStore = cookies(); // Access the cookie store

  const accessToken = (await cookieStore).get("sb_access_token");
  const refreshToken = (await cookieStore).get("sb_refresh_token");

  // Return cookies
  if (accessToken && refreshToken) {
    return new Response(
      JSON.stringify({
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ error: "Cookies are not set" }), {
    status: 404,
  });
}
