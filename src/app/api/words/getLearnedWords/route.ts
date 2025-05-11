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

  // Check if the learned words are cached in Redis
  const cacheKey = `learnedWords:${user.id}:all`;
  const cachedLearnedWords = await redis.get(cacheKey);
  if (cachedLearnedWords) {
    console.log("Returning cached learned words");
    return NextResponse.json(
      { learnedWords: cachedLearnedWords },
      { status: 200 }
    );
  }

  const learnedWords = await prisma.words.findMany({
    where: {
      wordprogress: {
        some: {
          userid: user.id,
          islearned: true,
        },
      },
    },
  });

  if (!learnedWords) {
    return NextResponse.json(
      { error: "No learned words found" },
      { status: 404 }
    );
  }

  // Cache the learned words in Redis for 10 minutes
  await redis.set(cacheKey, learnedWords, { ex: 60 * 10 });

  return NextResponse.json({ learnedWords }, { status: 200 });
}
