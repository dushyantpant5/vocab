import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { UserData, getUserId } from "@/helpers/auth";

export async function GET() {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const learnedWordsCount = await prisma.words.count({
    where: {
      wordprogress: {
        some: {
          userid: user.id,
          islearned: true,
        },
      },
    },
  });

  if (!learnedWordsCount) {
    return NextResponse.json(
      { error: "No learned words found" },
      { status: 404 }
    );
}

  return NextResponse.json({ learnedWordsCount }, { status: 200 });
}
