import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { getUserId, UserData } from "@/helpers/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ selectedDate: Date }>}
) {
  const { user, error }: UserData = await getUserId();

  if (error || !user.id) {
    return NextResponse.json({ error: error || "User ID not found" }, { status: 401 });
  }

const { selectedDate } = await params; 
  console.log("parameter", selectedDate);
  try {
    const learnedWordsAtParticularDate = await prisma.wordprogress.findMany({
      where: {
        userid: user.id,
        islearned: true,
        learnedAtDate: selectedDate
      },
      include: {
        words: true, // optional: to include full word data
      },
    });

    return NextResponse.json(learnedWordsAtParticularDate);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch word progress" },
      { status: 500 }
    );
  }
}
