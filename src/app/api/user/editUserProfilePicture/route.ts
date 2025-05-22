import { getUserId, UserData } from "@/helpers/auth";
import cloudinary from "@/utils/cloudinary";
import prisma from "@/utils/prismaClient";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }
  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const profilePictureUpdateData = await request.formData();
  const pictureFile = profilePictureUpdateData.get(
    "profilePictureFile"
  ) as File | null;

  if (pictureFile === null) {
    console.error("No file provided");
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  //File to cloudinary
  try {
    const buffer = Buffer.from(await pictureFile.arrayBuffer());
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

    // Update the user profile picture in the database
    if (!result) {
      return NextResponse.json(
        { error: "Failed to upload profile picture to cloudinary" },
        { status: 500 }
      );
    }
    try {
      const { secure_url } = result as { secure_url: string };
      await prisma.user_profiles.update({
        where: { id: user.id },
        data: {
          profileurl: secure_url,
          updatedat: new Date(),
        },
      });
      return NextResponse.json(
        { profilePictureUrl: secure_url },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update profile picture in database" + error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload profile picture to cloudinary" + error },
      { status: 500 }
    );
  }
}
