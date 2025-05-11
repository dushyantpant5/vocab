import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { redis } from "@/utils/redisClient";
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

  // Check if the learned words are cached in Redis
  const cacheKey = `learned:${user.id}:${
    parsedDate.toISOString().split("T")[0]
  }`;
  const cachedLearnedWords = await redis.get(cacheKey);
  if (cachedLearnedWords) {
    return NextResponse.json(
      { learnedWords: cachedLearnedWords },
      { status: 200 }
    );
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

    // Cache the learned words in Redis for 10 minutes
    await redis.set(cacheKey, learnedWordsAtParticularDate, { ex: 60 * 10 });

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
