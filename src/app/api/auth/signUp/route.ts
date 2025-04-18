import { NextResponse } from "next/server";
import supabase from "../../../../utils/supabaseClient";
import prisma from "@/utils/prismaClient";
import { signUpSchema } from "@/zod-validator";

export async function POST(request: Request) {
  const signUpData = await request.json();
  const signUpDataValidation = signUpSchema.safeParse(signUpData);

  if (!signUpDataValidation.success) {
    return NextResponse.json(
      { error: signUpDataValidation.error.format() },
      { status: 400 }
    );
  }

  const { email, username, password } = signUpDataValidation.data;

  // Check if user with this email already exists in database
  const userWithEmail = await prisma.user_profiles.findUnique({
    where: {
      email,
    },
  });

  if (userWithEmail) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 409 }
    );
  }

  // Check if user with this username already exists in database
  const userWithUsername = await prisma.user_profiles.findUnique({
    where: {
      username,
    },
  });

  if (userWithUsername) {
    return NextResponse.json(
      { error: "A user with this username already exists." },
      { status: 409 }
    );
  }

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "User cannot be created" },
      { status: 404 }
    );
  }

  try {
    const { user } = data;
    const newUserProfile = await prisma.user_profiles.create({
      data: {
        email: user?.email ?? "",
        username,
        id: user?.id, // Same user ID from Supabase Auth
        createdat: new Date(),
        updatedat: new Date(),
      },
    });
    return NextResponse.json(
      { message: "User created successfully", user: newUserProfile },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while creating the user profile",
        details: error,
      },
      { status: 500 }
    );
  }
}
