import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { getUserId, UserData } from "@/helpers/auth";
import { redis } from "@/utils/redisClient";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ wordId: string }>;
  }
) {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const { wordId } = await params;

  if (!wordId || wordId.length === 0) {
    return NextResponse.json(
      { error: "Params or Word ID not found" },
      { status: 400 }
    );
  }

  try {
    const updatedWordProgress = await prisma.wordprogress.update({
      where: {
        userid_wordid: {
          userid: user.id,
          wordid: wordId,
        },
      },
      data: {
        islearned: true,
        learnedAtDate: new Date(),
      },
    });

    // After updating, invalidate the caches
    const cacheKeyAll = `learnedWords:${user.id}:all`;
    const dashboardCacheKey = `dashboardWords:${user.id}:all`;
    const cacheKeyDate = `learned:${user.id}:${
      new Date().toISOString().split("T")[0]
    }`; // Using current date for cache invalidation
    await redis.del(cacheKeyAll); // Delete the cache for all learned words
    await redis.del(cacheKeyDate); // Delete the cache for date-specific learned words
    await redis.del(dashboardCacheKey); //Delete dashboard cache if user click on mark as done from dashboard
    return NextResponse.json(updatedWordProgress);
  } catch {
    return NextResponse.json(
      { error: "Failed to update word progress" },
      { status: 500 }
    );
  }
}
