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

  const unseenWords = await prisma.words.findMany({
    where: {
      OR: [
        {
          wordprogress: {
            none: {
              userid: user.id,
            },
          },
        },
        {
          wordprogress: {
            some: {
              userid: user.id,
              islearned: false,
            },
          },
        },
      ],
    },
    take: 5,
  });

  if (!unseenWords) {
    return NextResponse.json(
      { error: "No unseen words found" },
      { status: 404 }
    );
  }

  // Insert wordprogress entries for any that don't have them yet
  await Promise.all(
    unseenWords.map(async (word) => {
      try {
        const existingProgress = await prisma.wordprogress.findUnique({
          where: {
            userid_wordid: {
              userid: user.id,
              wordid: word.id,
            },
          },
        });

        if (!existingProgress) {
          await prisma.wordprogress.create({
            data: {
              userid: user.id,
              wordid: word.id,
              islearned: false,
            },
          });
        }
      } catch {
        return NextResponse.json(
          {
            error: `Failed to create word progress entry for word ID ${word.id}`,
          },
          { status: 500 }
        );
      }
    })
  );

  return NextResponse.json(unseenWords, { status: 200 });
}
