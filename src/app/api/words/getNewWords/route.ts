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
  
  const cacheKey = `dashboardWords:${user.id}:all`;
  const cachedDashboardWords = await redis.get(cacheKey);
  if (cachedDashboardWords) {
    return NextResponse.json(
      cachedDashboardWords ,
      { status: 200 }
    );
  }

  const dashboardWords = await prisma.words.findMany({
    where: {
      assignedwords: {
        some: {
          user_id: user.id,
        },
      },
      wordprogress: {
        some: {
          userid: user.id,
          islearned: false,
        },
      },
    },
  });

  if (!dashboardWords) {
    return NextResponse.json(
      { error: "No unseen words found" },
      { status: 404 }
    );
  }
  
  await redis.set(cacheKey, dashboardWords, { ex: 10*60 });
  return NextResponse.json(dashboardWords, { status: 200 });
}
