import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { redis } from "@/utils/redisClient";
import { UserData, getUserId } from "@/helpers/auth";

export async function GET() {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }
  try{
  const userDetails = await prisma.user_profiles.findUnique({
    where: { id: user.id },
    select: {
      username: true,
      email: true,
      phonenumber: true,
      dailywordcount: true
    },
  });

  if (!userDetails) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(userDetails);
} catch (err) {
  console.error("Error fetching user:", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}