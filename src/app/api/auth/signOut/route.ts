import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { removeTokesAtTheTimeOfSignOut } from "@/helpers/cookies";

export async function GET(request: Request) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
  }
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url);
  // Clear cookies
  removeTokesAtTheTimeOfSignOut(response);
  return response;
}
