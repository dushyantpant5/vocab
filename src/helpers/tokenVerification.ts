import supabase from "../utils/supabaseClient";

export async function verifyToken(accessToken: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error && !data) {
      // If there's an error, the token is likely invalid or expired
      return false;
    }
    return true;
  } catch (error) {
    // Handle any errors that occur during token verification
    console.error("Token verification failed", error);
    return false;
  }
}
