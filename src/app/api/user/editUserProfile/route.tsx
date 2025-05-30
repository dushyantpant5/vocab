import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { UserData, getUserId } from "@/helpers/auth";
import { profileEditSchema } from "../../../../zod-validator";


export async function PATCH(request: Request) {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }
  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const profileUpdateData = await request.formData();
  const phonenumber = profileUpdateData.get("phonenumber") as string | undefined;
  const dailyWordCount = profileUpdateData.get("dailywordcount") as string | undefined;

  const profileDataValidation = profileEditSchema.safeParse({
    phonenumber,
    dailyWordCount,
  });

  if (!profileDataValidation.success) {
    return NextResponse.json(
      { error: profileDataValidation.error.format() },
      { status: 400 }
    );
  }

  try {
    const updateData: { phonenumber?: string; dailywordcount?: number; } = {};

    updateData.phonenumber = phonenumber == undefined ? undefined : phonenumber;
    updateData.dailywordcount = dailyWordCount == undefined ? 5 : parseInt(dailyWordCount);
    await prisma.user_profiles.update({
      where: {
        id: user.id,
      },
      data: updateData
    });

    return NextResponse.json(
      { message: "User profile data updated successfully" },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" + err },
      { status: 500 }
    );
  }
}
