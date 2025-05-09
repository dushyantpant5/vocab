import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { getUserId, UserData } from "@/helpers/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ selectedDate: Date }> }
) {
  const { user, error }: UserData = await getUserId();

  if (error || !user.id) {
    return NextResponse.json(
      { error: error || "User ID not found" },
      { status: 401 }
    );
  }

  const { selectedDate } = await params;
  const parsedDate = new Date(selectedDate);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }
  try {
    const learnedWordsAtParticularDate = await prisma.words.findMany({
      where: {
        wordprogress: {
          some: {
            userid: user.id,
            islearned: true,
            learnedAtDate: new Date(parsedDate),
          },
        },
      },
    });

    return NextResponse.json(
      { learnedWords: learnedWordsAtParticularDate },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err ?? "Failed to fetch word progress" },
      { status: 500 }
    );
  }
}
