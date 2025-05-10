import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { removeTokesAtTheTimeOfSignOut } from "@/helpers/cookies";

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
  }

  const response = NextResponse.redirect("/");
  // Clear cookies
  removeTokesAtTheTimeOfSignOut(response);
  return response;
}
