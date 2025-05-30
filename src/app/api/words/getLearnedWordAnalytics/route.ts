import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { UserData, getUserId } from "@/helpers/auth";
import { subDays, startOfDay, endOfDay} from 'date-fns'

export async function GET() {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  //Gives you learned words count data of past 7 days (excluding today)

  const today = startOfDay(new Date())
  const startDate = subDays(today, 7)
  const endDate = endOfDay(subDays(today, 1)); 

  const learnedWordsAnalytics = await prisma.user_word_analytics.findMany({
    where: {
        userid: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        words_learned_count: true,
      },
      orderBy: {
        date: 'asc',
      },
  });

  if (!learnedWordsAnalytics) {
    return NextResponse.json(
      { error: "No learned words found" },
      { status: 404 }
    );
    }
  return NextResponse.json({ learnedWordsAnalytics }, { status: 200 });
}
