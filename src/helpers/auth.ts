import supabase from "../utils/supabaseClient";
import { getAccessToken } from "./cookies";

export type UserData = {
  user: { id: string };
  error: string | null;
};

export async function getUserId(): Promise<UserData> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      user: { id: "" },
      error: "[auth]:Authentication required. Access token not found.",
    };
  }

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      return {
        user: { id: "" },
        error: error.message,
      };
    }
    return {
      user: { id: data.user.id },
      error: null,
    };
  } catch {
    return {
      user: { id: "" },
      error: "An unknown error occurred.",
    };
  }
}
