import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { UserData, getUserId } from "@/helpers/auth";
import { profileEditSchema } from "../../../../zod-validator";
import cloudinary from "@/utils/cloudinary";

export async function PATCH(request: Request) {
  const profileUpdateData = await request.formData();

  const file = profileUpdateData.get("profileurl") as File | null;
  let phonenumber = profileUpdateData.get("phonenumber") as string | undefined;
  let dailywordcount = profileUpdateData.get("dailywordcount") as
    | string
    | undefined;
  const updateData: any = {
    updatedat: new Date(), // always update timestamp
  };
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }
  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }
  if (!phonenumber) {
    phonenumber = undefined;
  }
  if (!dailywordcount) {
    dailywordcount = undefined;
  }
  const profileDataValidation = profileEditSchema.safeParse({
    phonenumber,
    dailywordcount,
  });
  if (!profileDataValidation.success) {
    return NextResponse.json(
      { error: profileDataValidation.error.format() },
      { status: 400 }
    );
  }

  try {
    if (phonenumber !== undefined) {
      updateData.phonenumber = phonenumber;
    }

    if (dailywordcount !== undefined) {
      updateData.dailywordcount = dailywordcount;
    }

    if (file !== null) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile_pics",
              public_id: user.id,
              overwrite: true,
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });
      const { secure_url } = result as { secure_url: string };
      updateData.profileurl = secure_url;
    }
    const updatedUser = await prisma.user_profiles.update({
      where: {
        id: user.id,
      },
      data: updateData,
    });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
