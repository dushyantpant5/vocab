import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { UserData, getUserId } from "@/helpers/auth";
import { profileEditSchema } from "../../../../zod-validator";

export async function PATCH(request: Request) {
  const profileUpdateData = await request.json();
  console.log("sigupadtda", profileUpdateData);
  const profileDataValidation = profileEditSchema.safeParse(profileUpdateData);

  if (!profileDataValidation.success) {
    return NextResponse.json(
      { error: profileDataValidation.error.format() },
      { status: 400 }
    );
  }

  const { phonenumber, dailywordcount } = profileDataValidation.data;
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }
  try {
    if((phonenumber!==undefined && dailywordcount===undefined) || (phonenumber===undefined && dailywordcount!==undefined) || (phonenumber!==undefined && dailywordcount!==undefined))
    {
    const updatedUser = await prisma.user_profiles.update({
      where: {
        id: user.id,
      },
      data: {
        phonenumber: phonenumber,
        dailywordcount: dailywordcount,
        updatedat: new Date(),
      },
    });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  }
  else{
    console.log("Nothing to change in schema");
  }
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
