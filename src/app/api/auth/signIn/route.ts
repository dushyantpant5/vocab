import { NextResponse } from "next/server";
import supabase from "../../../../utils/supabaseClient";
import prisma from "@/utils/prismaClient";
import { signInSchema } from "@/zod-validator";
import { setTokensAtTheTimeOfSignIn } from "@/helpers/cookies";

export async function POST(request: Request) {
  const signInData = await request.json();
  const signInDataValidation = signInSchema.safeParse(signInData);
  if (!signInDataValidation.success) {
    return NextResponse.json(
      { error: signInDataValidation.error.format() },
      { status: 400 }
    );
  }
  const { email, password } = signInDataValidation.data;

  // Check if user  exists in database

  const user = await prisma.user_profiles.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !data.session) {
    return NextResponse.json(
      { error: authError?.message || "Invalid credentials" },
      { status: 401 }
    );
  }

  const response = NextResponse.json(
    { message: "User signed in successfully", user },
    { status: 200 }
  );

  const { access_token, refresh_token } = data.session;
  // Set the tokens in cookies
  setTokensAtTheTimeOfSignIn(access_token, refresh_token, response);
  return response;
}
